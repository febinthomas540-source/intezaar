import { NextResponse } from "next/server";
import {
  createPrivateToken,
  encryptLetterPayload,
  hashPrivateToken,
  insertEncryptedLetter,
  insertLetterEvent,
} from "@/lib/letter-security";

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

type CreateLetterBody = {
  senderName?: unknown;
  recipientName?: unknown;
  occasion?: unknown;
  format?: unknown;
  fromCity?: unknown;
  toCity?: unknown;
  heading?: unknown;
  message?: unknown;
  closing?: unknown;
  opensAt?: unknown;
  timezoneOffset?: unknown;
};

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
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

    const body = await request.json() as CreateLetterBody;
    const senderName = cleanText(body.senderName, 80);
    const recipientName = cleanText(body.recipientName, 80);
    const occasion = cleanText(body.occasion, 100) || "Just because";
    const format = cleanText(body.format, 30);
    const fromCity = cleanText(body.fromCity, 80);
    const toCity = cleanText(body.toCity, 80);
    const heading = cleanText(body.heading, 240);
    const message = cleanText(body.message, 4000);
    const closing = cleanText(body.closing, 240);

    if (!senderName || !recipientName || !message) {
      return NextResponse.json(
        { error: "Sender, recipient and letter text are required." },
        { status: 400 },
      );
    }

    if (!formats.has(format)) {
      return NextResponse.json({ error: "Unknown letter format." }, { status: 400 });
    }

    const opensAt = typeof body.opensAt === "string" ? new Date(body.opensAt) : new Date(Number.NaN);
    if (!Number.isFinite(opensAt.getTime())) {
      return NextResponse.json({ error: "Choose a valid opening date and time." }, { status: 400 });
    }

    const now = Date.now();
    const latest = now + 31 * 24 * 60 * 60 * 1000;
    if (opensAt.getTime() <= now || opensAt.getTime() > latest) {
      return NextResponse.json(
        { error: "The opening time must be in the future and within 30 days." },
        { status: 400 },
      );
    }

    const accessToken = createPrivateToken();
    const manageToken = createPrivateToken();
    const encrypted = encryptLetterPayload({
      version: 1,
      heading,
      message,
      closing,
    });
    const expiresAt = new Date(opensAt.getTime() + 90 * 24 * 60 * 60 * 1000);

    const letterId = await insertEncryptedLetter({
      access_token_hash: hashPrivateToken(accessToken),
      manage_token_hash: hashPrivateToken(manageToken),
      sender_name: senderName,
      recipient_name: recipientName,
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
      metadata: {
        timezone_offset: typeof body.timezoneOffset === "number" ? body.timezoneOffset : null,
        media_transferred: false,
        source: "web_creator",
      },
    });

    await insertLetterEvent(letterId, "created", { source: "web_creator" });
    await insertLetterEvent(letterId, "posted", { opens_at: opensAt.toISOString() });

    return NextResponse.json(
      {
        recipientUrl: `${publicSiteUrl(request)}/receive/${accessToken}`,
        manageToken,
        opensAt: opensAt.toISOString(),
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
