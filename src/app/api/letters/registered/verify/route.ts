import { NextResponse } from "next/server";
import {
  createRegisteredSession,
  findRegisteredLetterByAccessToken,
  registeredCookieName,
  registeredDeliveryEnabled,
  updateRegisteredMetadata,
  verificationCodeMatches,
} from "@/lib/registered-delivery";

export const runtime = "nodejs";

function cleanToken(value: unknown) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{40,60}$/.test(value) ? value : "";
}

function cleanCode(value: unknown) {
  return typeof value === "string" && /^\d{6}$/.test(value.trim()) ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    const body = await request.json() as { token?: unknown; code?: unknown };
    const token = cleanToken(body.token);
    const code = cleanCode(body.code);
    if (!token || !code) {
      return NextResponse.json({ error: "Enter the six-digit verification code." }, { status: 400 });
    }

    const letter = await findRegisteredLetterByAccessToken(token);
    if (!letter || !registeredDeliveryEnabled(letter.metadata) || !letter.recipient_email) {
      return NextResponse.json({ error: "Registered delivery is not available for this letter." }, { status: 404 });
    }
    if (letter.status === "cancelled" || letter.status === "expired") {
      return NextResponse.json({ error: "This letter is no longer available." }, { status: 410 });
    }

    const hash = typeof letter.metadata.registered_otp_hash === "string" ? letter.metadata.registered_otp_hash : "";
    const salt = typeof letter.metadata.registered_otp_salt === "string" ? letter.metadata.registered_otp_salt : "";
    const rawExpiry = typeof letter.metadata.registered_otp_expires_at === "string" ? letter.metadata.registered_otp_expires_at : "";
    const expiry = new Date(rawExpiry).getTime();
    const attempts = typeof letter.metadata.registered_otp_attempts === "number" ? letter.metadata.registered_otp_attempts : 0;

    if (!hash || !salt || !Number.isFinite(expiry) || expiry <= Date.now()) {
      return NextResponse.json({ error: "This code has expired. Request a new one." }, { status: 400 });
    }
    if (attempts >= 5) {
      return NextResponse.json({ error: "Too many incorrect attempts. Request a new code." }, { status: 429 });
    }

    if (!verificationCodeMatches(letter.id, salt, code, hash)) {
      await updateRegisteredMetadata(letter.id, {
        ...letter.metadata,
        registered_otp_attempts: attempts + 1,
      });
      return NextResponse.json({ error: "That verification code is not correct." }, { status: 400 });
    }

    await updateRegisteredMetadata(letter.id, {
      ...letter.metadata,
      registered_otp_hash: null,
      registered_otp_salt: null,
      registered_otp_expires_at: null,
      registered_otp_attempts: 0,
      registered_last_verified_at: new Date().toISOString(),
    });

    const session = createRegisteredSession(token, letter.id);
    const response = NextResponse.json(
      { verified: true },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set({
      name: registeredCookieName(letter.id),
      value: session.value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: `/receive/${token}`,
      maxAge: session.maxAge,
    });
    return response;
  } catch (error) {
    console.error("Registered verification failed:", error);
    return NextResponse.json(
      { error: "Recipient verification could not be completed. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
