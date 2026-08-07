import { randomBytes, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  createPrivateToken,
  encryptLetterPayload,
  hashPrivateToken,
  insertEncryptedLetter,
  insertLetterEvent,
  markRecipientNotified,
  type LetterMediaKind,
  type LetterMediaManifestItem,
  type LetterPhotoLayout,
} from "@/lib/letter-security";
import { sendPostedLetterEmail } from "@/lib/resend-mail";
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

const MAX_MEDIA_ITEMS = 3;
const MAX_TOTAL_MEDIA_BYTES = 30 * 1024 * 1024;
const MIN_JOURNEY_MS = 3 * 24 * 60 * 60 * 1000;
const mediaLimits: Record<LetterMediaKind, number> = {
  photo: 5 * 1024 * 1024,
  voice: 10 * 1024 * 1024,
  video: 25 * 1024 * 1024,
};

type CreateLetterBody = {
  senderName?: unknown;
  senderEmail?: unknown;
  recipientName?: unknown;
  recipientEmail?: unknown;
  occasion?: unknown;
  format?: unknown;
  fromCity?: unknown;
  toCity?: unknown;
  heading?: unknown;
  message?: unknown;
  closing?: unknown;
  opensAt?: unknown;
  timezoneOffset?: unknown;
  media?: unknown;
};

type ValidatedMedia = {
  id: string;
  kind: LetterMediaKind;
  name: string;
  mimeType: string;
  size: number;
  caption: string;
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

function validateMedia(value: unknown): ValidatedMedia[] | null {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > MAX_MEDIA_ITEMS) return null;

  const result: ValidatedMedia[] = [];
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

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return null;
    if (kind !== "photo" && kind !== "voice" && kind !== "video") return null;
    if (!Number.isFinite(size) || size <= 0 || size > mediaLimits[kind]) return null;
    if (kind === "photo" && !mimeType.startsWith("image/")) return null;
    if (kind === "voice" && !mimeType.startsWith("audio/")) return null;
    if (kind === "video" && !mimeType.startsWith("video/")) return null;

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
      caption: cleanText(item.caption, 240),
      photoLayout: kind === "photo" ? cleanPhotoLayout(item.photoLayout) : undefined,
    });
  }

  return result;
}

function publicSiteUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return configured || new URL(request.url).origin;
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
    const senderName = cleanText(body.senderName, 80);
    const senderEmail = cleanEmail(body.senderEmail);
    const recipientName = cleanText(body.recipientName, 80);
    const recipientEmail = cleanEmail(body.recipientEmail);
    const occasion = cleanText(body.occasion, 100) || "Just because";
    const format = cleanText(body.format, 30);
    const fromCity = cleanText(body.fromCity, 80);
    const toCity = cleanText(body.toCity, 80);
    const heading = cleanText(body.heading, 240);
    const message = cleanText(body.message, 4000);
    const closing = cleanText(body.closing, 240);
    const media = validateMedia(body.media);

    if (!senderName || !recipientName || !message) {
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

    const opensAt = typeof body.opensAt === "string" ? new Date(body.opensAt) : new Date(Number.NaN);
    if (!Number.isFinite(opensAt.getTime())) {
      return NextResponse.json({ error: "Choose a valid opening date and time." }, { status: 400 });
    }

    const now = Date.now();
    const earliest = now + MIN_JOURNEY_MS;
    const latest = now + 31 * 24 * 60 * 60 * 1000;
    if (opensAt.getTime() < earliest || opensAt.getTime() > latest) {
      return NextResponse.json(
        { error: "The letter needs at least a 3-day journey and must arrive within 30 days." },
        { status: 400 },
      );
    }

    const letterId = randomUUID();
    const accessToken = createPrivateToken();
    const manageToken = createPrivateToken();
    const mediaKey = media.length ? randomBytes(32).toString("base64") : undefined;
    const manifest: LetterMediaManifestItem[] = media.map((item) => ({
      ...item,
      path: `${letterId}/${item.id}.bin`,
      iv: randomBytes(12).toString("base64"),
    }));
    const uploadTargets = manifest.length
      ? await createMediaUploadTargets(manifest.map(({ id, path }) => ({ id, path })))
      : [];

    const encrypted = encryptLetterPayload({
      version: 2,
      heading,
      message,
      closing,
      mediaKey,
      media: manifest,
    });
    const expiresAt = new Date(opensAt.getTime() + 90 * 24 * 60 * 60 * 1000);
    const recipientUrl = `${publicSiteUrl(request)}/receive/${accessToken}`;
    const baseMetadata = {
      timezone_offset: typeof body.timezoneOffset === "number" ? body.timezoneOffset : null,
      media_transferred: media.length === 0,
      media_ready: media.length === 0,
      media_count: media.length,
      source: "web_creator",
      turnstile_validated: !challenge.skipped,
      registered_delivery: Boolean(recipientEmail),
    };

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

    await insertLetterEvent(letterId, "created", { source: "web_creator" });
    await insertLetterEvent(letterId, "posted", { opens_at: opensAt.toISOString() });

    const emailDelivery = media.length
      ? {
          attempted: false,
          sent: false,
          message: "Your media is being secured before the invitation is sent.",
        }
      : recipientEmail
        ? await sendPostedLetterEmail({
            letterId,
            to: recipientEmail,
            recipientName,
            senderName,
            occasion,
            recipientUrl,
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
      });
    } else if (!media.length && recipientEmail && emailDelivery.attempted) {
      await insertLetterEvent(letterId, "email_failed", {
        recipient_email: recipientEmail,
        provider: "resend",
        reason: emailDelivery.message,
      });
    }

    return NextResponse.json(
      {
        recipientUrl,
        manageToken,
        opensAt: opensAt.toISOString(),
        emailDelivery,
        mediaUpload: media.length
          ? {
              key: mediaKey,
              items: manifest.map((item) => ({
                id: item.id,
                path: item.path,
                iv: item.iv,
                token: uploadTargets.find((target) => target.id === item.id)?.token,
              })),
            }
          : null,
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
