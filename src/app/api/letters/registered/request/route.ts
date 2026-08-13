import { NextResponse } from "next/server";
import {
  createVerificationCode,
  findRegisteredLetterByAccessToken,
  registeredDeliveryEnabled,
  registeredLetterUnavailable,
  updateRegisteredMetadata,
} from "@/lib/registered-delivery";
import { sendRegisteredVerificationCode } from "@/lib/registered-delivery-mail";

export const runtime = "nodejs";

function cleanToken(value: unknown) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{40,60}$/.test(value) ? value : "";
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    const body = await request.json() as { token?: unknown };
    const token = cleanToken(body.token);
    if (!token) return NextResponse.json({ error: "Invalid registered-letter link." }, { status: 400 });

    const letter = await findRegisteredLetterByAccessToken(token);
    if (!letter || !registeredDeliveryEnabled(letter.metadata) || !letter.recipient_email) {
      return NextResponse.json({ error: "Registered delivery is not available for this letter." }, { status: 404 });
    }
    if (registeredLetterUnavailable(letter)) {
      return NextResponse.json({ error: "This letter is no longer available." }, { status: 410 });
    }

    const now = Date.now();
    const sentAt = typeof letter.metadata.registered_otp_sent_at === "string"
      ? new Date(letter.metadata.registered_otp_sent_at).getTime()
      : 0;
    if (Number.isFinite(sentAt) && now - sentAt < 60_000) {
      return NextResponse.json(
        { error: "Please wait a minute before requesting another code." },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    const windowStartedAt = typeof letter.metadata.registered_otp_window_started_at === "string"
      ? new Date(letter.metadata.registered_otp_window_started_at).getTime()
      : 0;
    const inWindow = Number.isFinite(windowStartedAt) && now - windowStartedAt < 60 * 60 * 1000;
    const requestCount = inWindow && typeof letter.metadata.registered_otp_request_count === "number"
      ? letter.metadata.registered_otp_request_count
      : 0;
    if (requestCount >= 5) {
      return NextResponse.json(
        { error: "Too many verification codes were requested. Try again later." },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    const verification = createVerificationCode(letter.id);
    const requestedAt = new Date().toISOString();
    const expiresAt = new Date(now + 10 * 60 * 1000).toISOString();

    // Make the new code verifiable before sending it, but do not consume the
    // resend cooldown or hourly allowance until the provider confirms delivery.
    // If delivery fails, restore the exact previous metadata so a provider
    // outage never locks the recipient out of another attempt.
    const pendingMetadata = {
      ...letter.metadata,
      registered_otp_hash: verification.hash,
      registered_otp_salt: verification.salt,
      registered_otp_expires_at: expiresAt,
      registered_otp_attempts: 0,
    };

    await updateRegisteredMetadata(letter.id, pendingMetadata);
    const delivery = await sendRegisteredVerificationCode({
      letterId: letter.id,
      requestId: verification.hash.slice(0, 16),
      to: letter.recipient_email,
      recipientName: letter.recipient_name,
      code: verification.code,
    });

    if (!delivery.sent) {
      try {
        await updateRegisteredMetadata(letter.id, letter.metadata);
      } catch (rollbackError) {
        console.error("Registered verification metadata rollback failed:", rollbackError);
      }
      return NextResponse.json(
        { error: delivery.message },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    const deliveredMetadata = {
      ...pendingMetadata,
      registered_otp_sent_at: requestedAt,
      registered_otp_window_started_at: inWindow
        ? letter.metadata.registered_otp_window_started_at
        : requestedAt,
      registered_otp_request_count: requestCount + 1,
    };

    try {
      await updateRegisteredMetadata(letter.id, deliveredMetadata);
    } catch (bookkeepingError) {
      // The email has already been delivered and pendingMetadata contains a
      // valid code. Do not tell the recipient the send failed just because the
      // cooldown bookkeeping could not be committed.
      console.error("Registered verification delivery bookkeeping failed:", bookkeepingError);
    }

    return NextResponse.json(
      { sent: true, expiresInSeconds: 600 },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Registered verification request failed:", error);
    return NextResponse.json(
      { error: "The verification code could not be sent. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
