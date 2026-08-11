import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

export type LetterMediaKind = "photo" | "voice" | "video";

export type LetterPhotoLayout = {
  fit: "cover" | "contain";
  zoom: number;
  cropX: number;
  cropY: number;
  x: number;
  y: number;
  width: number;
  aspectRatio: number;
  zIndex: number;
};

export type LetterMediaManifestItem = {
  id: string;
  kind: LetterMediaKind;
  path: string;
  name: string;
  mimeType: string;
  size: number;
  caption: string;
  iv: string;
  photoLayout?: LetterPhotoLayout;
};

export type E2EETransportMediaItem = {
  id: string;
  kind: LetterMediaKind;
  path: string;
  mimeType: string;
  size: number;
  iv: string;
};

export type LetterPayload = {
  version: 1 | 2;
  heading: string;
  message: string;
  closing: string;
  mediaKey?: string;
  media?: LetterMediaManifestItem[];
};

export type StoredLetter = {
  id: string;
  access_token_hash?: string;
  manage_token_hash?: string;
  sender_name: string;
  sender_email?: string | null;
  recipient_name: string;
  recipient_email?: string | null;
  occasion: string;
  letter_format: string;
  from_city: string | null;
  to_city: string | null;
  opens_at: string;
  expires_at?: string;
  status: string;
  payload_ciphertext: string;
  payload_iv: string;
  payload_auth_tag: string;
  metadata: Record<string, unknown>;
};

export type PublicLetterStats = {
  posted: number;
  waiting: number;
  opened: number;
};

type EncryptedPayload = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function encryptionKey() {
  const encoded = requiredEnvironment("LETTER_ENCRYPTION_KEY");
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32) {
    throw new Error("LETTER_ENCRYPTION_KEY must be a Base64-encoded 32-byte key.");
  }
  return key;
}

export function createPrivateToken() {
  return randomBytes(32).toString("base64url");
}

export function hashPrivateToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function encryptLetterPayload(payload: LetterPayload): EncryptedPayload {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
}

function validMediaItem(value: unknown): value is LetterMediaManifestItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<LetterMediaManifestItem>;
  return (
    typeof item.id === "string" &&
    (item.kind === "photo" || item.kind === "voice" || item.kind === "video") &&
    typeof item.path === "string" &&
    typeof item.name === "string" &&
    typeof item.mimeType === "string" &&
    typeof item.size === "number" &&
    typeof item.caption === "string" &&
    typeof item.iv === "string"
  );
}

function validE2EETransportMediaItem(value: unknown): value is E2EETransportMediaItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<E2EETransportMediaItem>;
  return (
    typeof item.id === "string" &&
    (item.kind === "photo" || item.kind === "voice" || item.kind === "video") &&
    typeof item.path === "string" &&
    typeof item.mimeType === "string" &&
    typeof item.size === "number" &&
    typeof item.iv === "string"
  );
}

export function letterUsesE2EE(letter: StoredLetter) {
  return letter.metadata?.e2ee_version === 1 && letter.metadata?.payload_version === 3;
}

export function e2eeTransportMedia(letter: StoredLetter): E2EETransportMediaItem[] {
  if (!letterUsesE2EE(letter)) return [];
  const raw = letter.metadata?.e2ee_media;
  if (raw === undefined) return [];
  if (!Array.isArray(raw) || !raw.every(validE2EETransportMediaItem)) {
    throw new Error("Stored E2EE media transport manifest is invalid.");
  }
  return raw;
}

export function decryptLetterPayload(letter: StoredLetter): LetterPayload {
  if (letterUsesE2EE(letter)) {
    throw new Error("E2EE letter contents must be decrypted in the recipient browser.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(letter.payload_iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(letter.payload_auth_tag, "base64"));

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(letter.payload_ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");

  const parsed = JSON.parse(plaintext) as Partial<LetterPayload>;
  if (
    (parsed.version !== 1 && parsed.version !== 2) ||
    typeof parsed.heading !== "string" ||
    typeof parsed.message !== "string" ||
    typeof parsed.closing !== "string"
  ) {
    throw new Error("Stored letter payload is invalid.");
  }

  if (parsed.version === 2) {
    if (parsed.mediaKey !== undefined && typeof parsed.mediaKey !== "string") {
      throw new Error("Stored media key is invalid.");
    }
    if (parsed.media !== undefined && (!Array.isArray(parsed.media) || !parsed.media.every(validMediaItem))) {
      throw new Error("Stored media manifest is invalid.");
    }
  }

  return parsed as LetterPayload;
}

function supabaseHeaders(extra?: HeadersInit) {
  const secret = requiredEnvironment("SUPABASE_SECRET_KEY");
  return {
    apikey: secret,
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
    ...extra,
  } satisfies HeadersInit;
}

function supabaseUrl(path: string) {
  return `${requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "")}/rest/v1/${path}`;
}

async function parseSupabaseError(response: Response) {
  const body = await response.text();
  return body || `${response.status} ${response.statusText}`;
}

async function countRows(
  table: "letters" | "letter_events",
  filters: Record<string, string> = {},
) {
  const query = new URLSearchParams({ select: "id", limit: "1", ...filters });
  const response = await fetch(supabaseUrl(`${table}?${query.toString()}`), {
    headers: supabaseHeaders({ Prefer: "count=exact" }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Supabase count failed: ${await parseSupabaseError(response)}`);
  }

  const contentRange = response.headers.get("content-range") || "";
  const total = Number(contentRange.split("/").pop());
  if (!Number.isFinite(total) || total < 0) {
    throw new Error("Supabase did not return a valid aggregate count.");
  }
  return total;
}

export async function getPublicLetterStats(): Promise<PublicLetterStats> {
  // Round the waiting threshold to five-minute buckets so the aggregate query
  // can be cached briefly instead of producing a new cache key every request.
  const bucketMs = 5 * 60 * 1000;
  const bucketNow = new Date(Math.floor(Date.now() / bucketMs) * bucketMs).toISOString();

  const [posted, waiting, opened] = await Promise.all([
    countRows("letters"),
    countRows("letters", {
      status: "eq.posted",
      opens_at: `gt.${bucketNow}`,
    }),
    countRows("letter_events", { event_type: "eq.opened" }),
  ]);

  return { posted, waiting, opened };
}

export async function insertEncryptedLetter(row: Record<string, unknown>) {
  const response = await fetch(supabaseUrl("letters"), {
    method: "POST",
    headers: supabaseHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed: ${await parseSupabaseError(response)}`);
  }

  const result = await response.json() as Array<{ id: string }>;
  if (!result[0]?.id) throw new Error("Supabase did not return the new letter id.");
  return result[0].id;
}

export async function updateLetterMetadata(letterId: string, metadata: Record<string, unknown>) {
  const query = new URLSearchParams({ id: `eq.${letterId}` });
  const response = await fetch(supabaseUrl(`letters?${query.toString()}`), {
    method: "PATCH",
    headers: supabaseHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify({ metadata, updated_at: new Date().toISOString() }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not update letter metadata: ${await parseSupabaseError(response)}`);
  }
}

export async function updateSenderNotificationPreferences(
  letterId: string,
  senderEmail: string | null,
  metadata: Record<string, unknown>,
) {
  const query = new URLSearchParams({ id: `eq.${letterId}` });
  const response = await fetch(supabaseUrl(`letters?${query.toString()}`), {
    method: "PATCH",
    headers: supabaseHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      sender_email: senderEmail,
      metadata,
      updated_at: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not update sender notification preferences: ${await parseSupabaseError(response)}`);
  }
}

export async function markRecipientNotified(letterId: string) {
  const query = new URLSearchParams({ id: `eq.${letterId}` });
  const response = await fetch(supabaseUrl(`letters?${query.toString()}`), {
    method: "PATCH",
    headers: supabaseHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify({ recipient_notified_at: new Date().toISOString() }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Could not mark recipient notification:", await parseSupabaseError(response));
  }
}

export async function insertLetterEvent(
  letterId: string,
  eventType: string,
  eventData: Record<string, unknown> = {},
) {
  const response = await fetch(supabaseUrl("letter_events"), {
    method: "POST",
    headers: supabaseHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      letter_id: letterId,
      event_type: eventType,
      event_data: eventData,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Could not record letter event:", await parseSupabaseError(response));
  }
}

const accessSelect = "id,sender_name,sender_email,recipient_name,occasion,letter_format,from_city,to_city,opens_at,expires_at,status,payload_ciphertext,payload_iv,payload_auth_tag,metadata";
const manageSelect = "id,access_token_hash,manage_token_hash,sender_name,sender_email,recipient_name,recipient_email,occasion,letter_format,from_city,to_city,opens_at,expires_at,status,payload_ciphertext,payload_iv,payload_auth_tag,metadata";

export async function findLetterByAccessToken(token: string): Promise<StoredLetter | null> {
  const hash = hashPrivateToken(token);
  const query = new URLSearchParams({
    access_token_hash: `eq.${hash}`,
    select: accessSelect,
    limit: "1",
  });

  const response = await fetch(supabaseUrl(`letters?${query.toString()}`), {
    headers: supabaseHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase read failed: ${await parseSupabaseError(response)}`);
  }

  const result = await response.json() as StoredLetter[];
  return result[0] ?? null;
}

export async function findLetterByManageToken(token: string): Promise<StoredLetter | null> {
  const hash = hashPrivateToken(token);
  const query = new URLSearchParams({
    manage_token_hash: `eq.${hash}`,
    select: manageSelect,
    limit: "1",
  });

  const response = await fetch(supabaseUrl(`letters?${query.toString()}`), {
    headers: supabaseHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase management read failed: ${await parseSupabaseError(response)}`);
  }

  const result = await response.json() as StoredLetter[];
  return result[0] ?? null;
}
