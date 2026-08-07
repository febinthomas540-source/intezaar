import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";
import { hashPrivateToken } from "@/lib/letter-security";

export type RegisteredLetterRecord = {
  id: string;
  recipient_name: string;
  recipient_email: string | null;
  status: string;
  opens_at: string;
  expires_at: string;
  metadata: Record<string, unknown>;
};

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function verificationKey() {
  const key = Buffer.from(requiredEnvironment("LETTER_ENCRYPTION_KEY"), "base64");
  if (key.length !== 32) throw new Error("LETTER_ENCRYPTION_KEY must be 32 bytes.");
  return key;
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

export async function findRegisteredLetterByAccessToken(token: string): Promise<RegisteredLetterRecord | null> {
  const query = new URLSearchParams({
    access_token_hash: `eq.${hashPrivateToken(token)}`,
    select: "id,recipient_name,recipient_email,status,opens_at,expires_at,metadata",
    limit: "1",
  });
  const response = await fetch(supabaseUrl(`letters?${query.toString()}`), {
    headers: supabaseHeaders(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Registered delivery lookup failed.");
  const rows = await response.json() as RegisteredLetterRecord[];
  return rows[0] ?? null;
}

export async function updateRegisteredMetadata(letterId: string, metadata: Record<string, unknown>) {
  const query = new URLSearchParams({ id: `eq.${letterId}` });
  const response = await fetch(supabaseUrl(`letters?${query.toString()}`), {
    method: "PATCH",
    headers: supabaseHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify({ metadata, updated_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Registered delivery update failed.");
}

export function registeredDeliveryEnabled(metadata: Record<string, unknown> | undefined) {
  return metadata?.registered_delivery === true;
}

export function registeredLetterUnavailable(letter: Pick<RegisteredLetterRecord, "status" | "expires_at">) {
  if (letter.status === "cancelled" || letter.status === "expired") return true;
  const expiry = new Date(letter.expires_at).getTime();
  return Number.isFinite(expiry) && Date.now() >= expiry;
}

export function createVerificationCode(letterId: string) {
  const code = String(randomInt(100000, 1_000_000));
  const salt = randomBytes(16).toString("base64url");
  const hash = hashVerificationCode(letterId, salt, code);
  return { code, salt, hash };
}

function hashVerificationCode(letterId: string, salt: string, code: string) {
  return createHmac("sha256", verificationKey())
    .update(`${letterId}:${salt}:${code}`)
    .digest("hex");
}

export function verificationCodeMatches(letterId: string, salt: string, code: string, expectedHash: string) {
  const actual = Buffer.from(hashVerificationCode(letterId, salt, code), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function registeredCookieName(letterId: string) {
  return `intezaar_registered_${letterId.replace(/-/g, "")}`;
}

export function createRegisteredSession(token: string, letterId: string) {
  const expires = Math.floor(Date.now() / 1000) + 35 * 24 * 60 * 60;
  const tokenHash = hashPrivateToken(token);
  const signature = createHmac("sha256", verificationKey())
    .update(`${letterId}:${tokenHash}:${expires}`)
    .digest("base64url");
  return { value: `${expires}.${signature}`, maxAge: 35 * 24 * 60 * 60 };
}

export function registeredSessionIsValid(token: string, letterId: string, value: string | undefined) {
  if (!value) return false;
  const [rawExpires, signature] = value.split(".");
  const expires = Number(rawExpires);
  if (!Number.isInteger(expires) || expires <= Math.floor(Date.now() / 1000) || !signature) return false;

  const tokenHash = hashPrivateToken(token);
  const expected = createHmac("sha256", verificationKey())
    .update(`${letterId}:${tokenHash}:${expires}`)
    .digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}
