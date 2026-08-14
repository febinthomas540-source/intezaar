import { createHash, randomBytes, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  MAX_DELIVERY_MS,
  MAX_MEDIA_ITEMS,
  MAX_TOTAL_MEDIA_BYTES,
  MEDIA_LIMIT_BYTES,
  MIN_DELIVERY_MS,
} from "@/lib/letter-rules";
import {
  createPrivateToken,
  e2eeTransportMedia,
  encryptLetterPayload,
  findLetterByAccessToken,
  hashPrivateToken,
  insertEncryptedLetter,
  insertLetterEvent,
  markRecipientNotified,
  type E2EETransportMediaItem,
  type LetterMediaKind,
  type LetterMediaManifestItem,
  type LetterPhotoLayout,
  type StoredLetter,
} from "@/lib/letter-security";
import { scheduleArrivalLetterEmail, sendPostedLetterEmail } from "@/lib/resend-mail";
import { createMediaUploadTargets } from "@/lib/supabase-storage";
import { validateTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

const formats = new Set([
  "classic",
  "minimal",
  "typewriter",
  "airmail",
  "inland",
  "postcard",
  "folded",
  "photo",
  "festival",
  "telegram",
]);

const mediaLimits: Record<LetterMediaKind, number> = MEDIA_LIMIT_BYTES;

type E2EEEnvelope = {
  version: 3;
  ciphertext: string;
  iv: string;
  authTag: string;
};

type CreateLetterBody = {
  senderName?: unknown;
  senderEmail?: unknown;
  recipientName?: unknown;
  recipientEmail?: unknown;
  registeredDelivery?: unknown;
  occasion?: unknown;
  format?: unknown;
  fromCity?: unknown;
  toCity?: unknown;
  heading?: unknown;
  message?: unknown;
  closing?: unknown;
  opensAt?: unknown;
  timezoneOffset?: unknown;
  encryptedPayload?: unknown;
  media?: unknown;
  idempotencyKey?: unknown;
  openProofCommitment?: unknown;
};

type ValidatedMedia = {
  id: string;
  kind: LetterMediaKind;
  name: string;
  mimeType: string;
  size: number;
  caption: string;
  iv?: string;
  photoLayout?: LetterPhotoLayout;
};

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function cleanEmail(value: unknown) {
  const email = cleanText(value, 254).toLowerCase();
  if (!email) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function clampNumber(value: unknown, minimum: number, maximum: number, fallback: number) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
}

function cleanPhotoLayout(value: unknown): LetterPhotoLayout | undefined {
  if (!value || typeof value !== "object") return undefined;
  const layout = value as Record<string, unknown>;
  return {
    fit: layout.fit === "contain" ? "contain" : "cover",
    zoom: clampNumber(layout.zoom, 0.6, 2.4, 1),
    cropX: clampNumber(layout.cropX, 0, 100, 50),
    cropY: clampNumber(layout.cropY, 0, 100, 50),
    x: clampNumber(layout.x, 0, 100, 50),
    y: clampNumber(layout.y, 0, 100, 50),
    width: clampNumber(layout.width, 20, 88, 60),
    aspectRatio: clampNumber(layout.aspectRatio, 0.55, 1.9, 4 / 3),
    zIndex: clampNumber(layout.zIndex, 1, 100, 1),
  };
}

function validBase64Bytes(value: unknown, expectedBytes: number) {
  if (typeof value !== "string" || value.length > 128 || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) return false;
  try {
    return Buffer.from(value, "base64").length === expectedBytes;
  } catch {
    return false;
  }
}

function validateEncryptedPayload(value: unknown): E2EEEnvelope | null {
  if (!value || typeof value !== "object") return null;
  const envelope = value as Partial<E2EEEnvelope>;
  if (
    envelope.version !== 3 ||
    typeof envelope.ciphertext !== "string" ||
    envelope.ciphertext.length < 1 ||
    envelope.ciphertext.length > 24_000 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(envelope.ciphertext) ||
    !validBase64Bytes(envelope.iv, 12) ||
    !validBase64Bytes(envelope.authTag, 16)
  ) {
    return null;
  }
  return envelope as E2EEEnvelope;
}

function validateMedia(value: unknown, e2ee: boolean): ValidatedMedia[] | null {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > MAX_MEDIA_ITEMS) return null;

  const result: ValidatedMedia[] = [];
  const seenIvs = new Set<string>();
  let total = 0;
  let videoCount = 0;

  for (const raw of value) {
    if (!raw || typeof raw !== "object") return null;
    const item = raw as Record<string, unknown>;
    const id = cleanText(item.id, 64);
    const kind = cleanText(item.kind, 12) as LetterMediaKind;
    const name = cleanText(item.name, 160) || `${kind}-attachment`;
    const mimeType = cleanText(item.mimeType, 120).toLowerCase();
    const size = typeof item.size === "number" ? Math.floor(item.size) : Number.NaN;
    const iv = e2ee ? cleanText(item.iv, 64) : "";

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return null;
    if (kind !== "photo" && kind !== "voice" && kind !== "video") return null;
    if (!Number.isFinite(size) || size <= 0 || size > mediaLimits[kind]) return null;
    if (kind === "photo" && !mimeType.startsWith("image/")) return null;
    if (kind === "voice" && !mimeType.startsWith("audio/")) return null;
    if (kind === "video" && !mimeType.startsWith("video/")) return null;
    if (e2ee) {
      if (!iv || !validBase64Bytes(iv, 12) || seenIvs.has(iv)) return null;
      seenIvs.add(iv);
    }

    total += size;
    if (total > MAX_TOTAL_MEDIA_BYTES) return null;
    if (kind === "video") videoCount += 1;
    if (videoCount > 1) return null;

    result.push({
      id,
      kind,
      name,
      mimeType,
      size,
      caption: e2ee ? "" : cleanText(item.caption, 240),
      iv: e2ee ? iv : undefined,
      photoLayout: !e2ee && kind === "photo" ? cleanPhotoLayout(item.photoLayout) : undefined,
    });
  }

  return result;
}

function publicSiteUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return configured || new URL(request.url).origin;
}

function cleanIdempotencyKey(value: unknown) {
  const key = cleanText(value, 64);
  return /^[A-Za-z0-9_-]{32,64}$/.test(key) ? key : "";
}

function cleanOpenProof(value: unknown) {
  const proof = cleanText(value, 64);
  return /^[A-Za-z0-9_-]{43}$/.test(proof) ? proof : "";
}

function idempotentPrivateToken(idempotencyKey: string, purpose: "access" | "manage") {
  return createHash("sha256")
    .update(`intezaar-create-${purpose}-v1:${idempotencyKey}`)
    .digest("base64url");
}

function idempotentLetterId(idempotencyKey: string) {
  const chars = createHash("sha256")
    .update(`intezaar-create-letter-v1:${idempotencyKey}`)
    .digest("hex")
    .slice(0, 32)
    .split("");
  chars[12] = "4";
  chars[16] = ((Number.parseInt(chars[16], 16) & 3) | 8).toString(16);
  const value = chars.join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

function creationRequestHash(input: Record<string, unknown>) {
  return createHash("sha256").update(JSON.stringify(input)).digest("base64url");
}

async function replayCreationResponse(
  request: Request,
  letter: StoredLetter,
  accessToken: string,
  manageToken: string,
) {
  const manifest = e2eeTransportMedia(letter);
  const mediaReady = letter.metadata?.media_ready === true;
  const uploadTargets = !mediaReady && manifest.length
    ? await createMediaUploadTargets(manifest.map(({ id, path }) => ({ id, path })))
    : [];
  const mediaCount = typeof letter.metadata?.media_count === "number"
    ? letter.metadata.media_count
    : manifest.length;

  return NextResponse.json(
    {
      recipientUrl: `${publicSiteUrl(request)}/receive/${accessToken}`,
      manageToken,
      opensAt: letter.opens_at,
      mediaReady,
      mediaCount,
      mediaUpload: !mediaReady && manifest.length
        ? {
            items: manifest.map((item) => ({
              id: item.id,
              path: item.path,
              iv: item.iv,
              token: uploadTargets.find((target) => target.id === item.id)?.token,
            })),
          }
        : null,
      replayed: true,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    const challenge = await validateTurnstile(
      request,
      request.headers.get("x-intezaar-turnstile-token"),
    );
    if (!challenge.success) {
      return NextResponse.json(
        { error: "Complete the secure posting check and try again." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    const body = await request.json() as CreateLetterBody;
    const encryptedPayload = body.encryptedPayload === undefined
      ? null
      : validateEncryptedPayload(body.encryptedPayload);
    if (body.encryptedPayload !== undefined && !encryptedPayload) {
      return NextResponse.json({ error: "The browser-encrypted letter payload is invalid." }, { status: 400 });
    }
    const isE2EE = Boolean(encryptedPayload);

    const senderName = cleanText(body.senderName, 80);
    const senderEmail = cleanEmail(body.senderEmail);
    const recipientName = cleanText(body.recipientName, 80);
    const recipientEmail = cleanEmail(body.recipientEmail);
    const registeredDelivery = body.registeredDelivery === true && Boolean(recipientEmail);
    const occasion = cleanText(body.occasion, 100) || "Just because";
    const format = cleanText(body.format, 30);
    const fromCity = cleanText(body.fromCity, 80);
    const toCity = cleanText(body.toCity, 80);
    const heading = isE2EE ? "" : cleanText(body.heading, 240);
    const message = isE2EE ? "" : cleanText(body.message, 4000);
    const closing = isE2EE ? "" : cleanText(body.closing, 240);
    const media = validateMedia(body.media, isE2EE);
    const idempotencyKey = cleanIdempotencyKey(body.idempotencyKey);
    const openProofCommitment = cleanOpenProof(body.openProofCommitment);

    if (!senderName || !recipientName || (!isE2EE && !message)) {
      return NextResponse.json(
        { error: "Sender, recipient and letter text are required." },
        { status: 400 },
      );
    }

    if (senderEmail === null || recipientEmail === null) {
      return NextResponse.json({ error: "Enter a valid email address or leave it blank." }, { status: 400 });
    }

    if (!formats.has(format)) {
      return NextResponse.json({ error: "Unknown letter format." }, { status: 400 });
    }

    if (media === null) {
      return NextResponse.json(
        { error: "Media must be no more than three items and 30 MB total." },
        { status: 400 },
      );
    }

    if (body.idempotencyKey !== undefined && !idempotencyKey) {
      return NextResponse.json({ error: "The posting retry key is invalid." }, { status: 400 });
    }
    if (idempotencyKey && !isE2EE) {
      return NextResponse.json({ error: "Idempotent posting requires browser-encrypted delivery." }, { status: 400 });
    }
    if (idempotencyKey && !openProofCommitment) {
      return NextResponse.json({ error: "The encrypted opened-receipt commitment is invalid." }, { status: 400 });
    }

    if (isE2EE && media.some((item) => item.iv === encryptedPayload?.iv)) {
      return NextResponse.json({ error: "The encrypted letter used a duplicate encryption nonce." }, { status: 400 });
    }

    const opensAt = typeof body.opensAt === "string" ? new Date(body.opensAt) : new Date(Number.NaN);
    if (!Number.isFinite(opensAt.getTime())) {
      return NextResponse.json({ error: "Choose a valid opening date and time." }, { status: 400 });
    }

    const replayHash = idempotencyKey
      ? creationRequestHash({
          senderName,
          recipientName,
          recipientEmail: recipientEmail || "",
          occasion,
          format,
          fromCity,
          toCity,
          opensAt: opensAt.toISOString(),
          encryptedPayload,
          media: media.map((item) => ({
            id: item.id,
            kind: item.kind,
            mimeType: item.mimeType,
            size: item.size,
            iv: item.iv || "",
          })),
          openProofCommitment,
        })
      : "";
    const accessToken = idempotencyKey
      ? idempotentPrivateToken(idempotencyKey, "access")
      : createPrivateToken();
    const manageToken = idempotencyKey
      ? idempotentPrivateToken(idempotencyKey, "manage")
      : createPrivateToken();

    const now = Date.now();
    const earliest = now + MIN_DELIVERY_MS;
    const latest = now + MAX_DELIVERY_MS;
    if (opensAt.getTime() < earliest || opensAt.getTime() > latest) {
      return NextResponse.json(
        { error: "Choose an arrival at least 12 hours from now and within 30 days." },
        { status: 400 },
      );
    }

    const letterId = idempotencyKey ? idempotentLetterId(idempotencyKey) : randomUUID();
    const mediaKey = !isE2EE && media.length ? randomBytes(32).toString("base64") : undefined;

    const e2eeManifest: E2EETransportMediaItem[] = isE2EE
      ? media.map((item) => ({
          id: item.id,
          kind: item.kind,
          path: `${letterId}/${item.id}.bin`,
          mimeType: item.mimeType,
          size: item.size,
          iv: item.iv as string,
        }))
      : [];

    const legacyManifest: LetterMediaManifestItem[] = !isE2EE
      ? media.map((item) => ({
          id: item.id,
          kind: item.kind,
          path: `${letterId}/${item.id}.bin`,
          name: item.name,
          mimeType: item.mimeType,
          size: item.size,
          caption: item.caption,
          iv: randomBytes(12).toString("base64"),
          photoLayout: item.photoLayout,
        }))
      : [];

    const uploadManifest = isE2EE ? e2eeManifest : legacyManifest;
    const uploadTargets = uploadManifest.length
      ? await createMediaUploadTargets(uploadManifest.map(({ id, path }) => ({ id, path })))
      : [];

    const encrypted = encryptedPayload || encryptLetterPayload({
      version: 2,
      heading,
      message,
      closing,
      mediaKey,
      media: legacyManifest,
    });
    const expiresAt = new Date(opensAt.getTime() + 90 * 24 * 60 * 60 * 1000);
    const recipientUrl = `${publicSiteUrl(request)}/receive/${accessToken}`;
    const baseMetadata: Record<string, unknown> = {
      timezone_offset: typeof body.timezoneOffset === "number" ? body.timezoneOffset : null,
      media_transferred: media.length === 0,
      media_ready: media.length === 0,
      media_count: media.length,
      source: "web_creator",
      turnstile_validated: !challenge.skipped,
      registered_delivery: registeredDelivery,
      payload_version: isE2EE ? 3 : 2,
    };
    if (isE2EE) {
      baseMetadata.e2ee_version = 1;
      baseMetadata.e2ee_media = e2eeManifest;
      if (openProofCommitment) baseMetadata.e2ee_open_proof = openProofCommitment;
    }
    if (idempotencyKey) {
      baseMetadata.creation_request_hash = replayHash;
      baseMetadata.idempotent_creation = true;
    }

    // Insert first instead of requiring a Supabase read before every new
    // letter. The deterministic id and token hashes make this atomic: a first
    // attempt inserts normally, while a retry collides and is recovered below.
    // This also keeps a transient/preflight read failure from blocking a valid
    // first-time post before the database has even had a chance to store it.
    try {
      await insertEncryptedLetter({
        id: letterId,
        access_token_hash: hashPrivateToken(accessToken),
        manage_token_hash: hashPrivateToken(manageToken),
        sender_name: senderName,
        sender_email: senderEmail || null,
        recipient_name: recipientName,
        recipient_email: recipientEmail || null,
        occasion,
        letter_format: format,
        from_city: fromCity || null,
        to_city: toCity || null,
        payload_ciphertext: encrypted.ciphertext,
        payload_iv: encrypted.iv,
        payload_auth_tag: encrypted.authTag,
        opens_at: opensAt.toISOString(),
        status: "posted",
        expires_at: expiresAt.toISOString(),
        metadata: baseMetadata,
      });
    } catch (error) {
      if (idempotencyKey) {
        const existing = await findLetterByAccessToken(accessToken);
        if (existing) {
          if (existing.metadata?.creation_request_hash !== replayHash) {
            return NextResponse.json(
              { error: "This posting retry key was already used for a different encrypted letter." },
              { status: 409, headers: { "Cache-Control": "no-store" } },
            );
          }
          return replayCreationResponse(request, existing, accessToken, manageToken);
        }
      }
      throw error;
    }

    await insertLetterEvent(letterId, "created", { source: "web_creator", e2ee: isE2EE });
    await insertLetterEvent(letterId, "posted", { opens_at: opensAt.toISOString(), e2ee: isE2EE });

    const emailDelivery = media.length
      ? {
          attempted: false,
          sent: false,
          message: isE2EE
            ? "Your media is being encrypted before the delivery notice is sent. You will still need to share the complete private link yourself."
            : "Your media is being secured before the invitation is sent.",
        }
      : recipientEmail
        ? await sendPostedLetterEmail({
            letterId,
            to: recipientEmail,
            recipientName,
            senderName,
            occasion,
            recipientUrl,
            e2ee: isE2EE,
          })
        : {
            attempted: false,
            sent: false,
            message: "No recipient email was added. Share the private link manually.",
          };

    if (!media.length && emailDelivery.sent) {
      await markRecipientNotified(letterId);
      await insertLetterEvent(letterId, "invitation_sent", {
        recipient_email: recipientEmail,
        provider: "resend",
        provider_id: emailDelivery.emailId || null,
        e2ee: isE2EE,
      });
    } else if (!media.length && recipientEmail && emailDelivery.attempted) {
      await insertLetterEvent(letterId, "email_failed", {
        recipient_email: recipientEmail,
        provider: "resend",
        reason: emailDelivery.message,
        e2ee: isE2EE,
      });
    }

    const arrivalDelivery = !media.length && recipientEmail
      ? await scheduleArrivalLetterEmail({
          letterId,
          to: recipientEmail,
          recipientName,
          senderName,
          occasion,
          recipientUrl,
          opensAt: opensAt.toISOString(),
          e2ee: isE2EE,
        })
      : null;

    if (arrivalDelivery?.sent) {
      await insertLetterEvent(letterId, "arrival_email_scheduled", {
        recipient_email: recipientEmail,
        provider: "resend",
        provider_id: arrivalDelivery.emailId || null,
        scheduled_at: opensAt.toISOString(),
        e2ee: isE2EE,
      });
    } else if (arrivalDelivery?.attempted) {
      await insertLetterEvent(letterId, "arrival_email_schedule_failed", {
        recipient_email: recipientEmail,
        provider: "resend",
        reason: arrivalDelivery.message,
        e2ee: isE2EE,
      });
    }

    return NextResponse.json(
      {
        recipientUrl,
        manageToken,
        opensAt: opensAt.toISOString(),
        emailDelivery,
        mediaReady: media.length === 0,
        mediaCount: media.length,
        mediaUpload: media.length
          ? {
              ...(isE2EE ? {} : { key: mediaKey }),
              items: uploadManifest.map((item) => ({
                id: item.id,
                path: item.path,
                iv: item.iv,
                token: uploadTargets.find((target) => target.id === item.id)?.token,
              })),
            }
          : null,
        replayed: false,
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Secure letter creation failed:", error);
    return NextResponse.json(
      { error: "The letter could not be stored securely. Please try again." },
      { status: 500 },
    );
  }
}
