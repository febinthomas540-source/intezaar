import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  findLetterByAccessToken,
  insertLetterEvent,
  updateLetterMetadata,
} from "@/lib/letter-security";
import {
  registeredCookieName,
  registeredDeliveryEnabled,
  registeredSessionIsValid,
} from "@/lib/registered-delivery";
import { sendLetterOpenedEmail } from "@/lib/opened-letter-mail";

export const runtime = "nodejs";

const actions = new Set(["opened", "write_back", "future_self", "share_idea"]);

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function openProofMatches(actual: string, expected: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(actual) || !/^[A-Za-z0-9_-]{43}$/.test(expected)) return false;
  const actualBuffer = Buffer.from(actual, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    const body = await request.json() as { token?: unknown; action?: unknown; openProof?: unknown };
    const token = cleanText(body.token, 100);
    const action = cleanText(body.action, 32);
    const openProof = cleanText(body.openProof, 80);

    if (!/^[A-Za-z0-9_-]{40,60}$/.test(token) || !actions.has(action)) {
      return NextResponse.json({ error: "Invalid recipient event." }, { status: 400 });
    }

    const letter = await findLetterByAccessToken(token);
    if (!letter) {
      return NextResponse.json({ error: "This letter could not be found." }, { status: 404 });
    }

    const nowMs = Date.now();
    const opensAt = new Date(letter.opens_at).getTime();
    const expiryAt = letter.expires_at ? new Date(letter.expires_at).getTime() : Number.NaN;
    const unavailable = letter.status === "cancelled"
      || letter.status === "expired"
      || (Number.isFinite(expiryAt) && nowMs >= expiryAt);

    if (unavailable || !Number.isFinite(opensAt) || nowMs < opensAt) {
      return NextResponse.json({ error: "This recipient action is not available yet." }, { status: 409 });
    }

    if (action !== "opened") {
      await insertLetterEvent(letter.id, `recipient_${action}`, { source: "recipient_page" });
      return NextResponse.json(
        { recorded: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const registered = registeredDeliveryEnabled(letter.metadata);
    if (registered) {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get(registeredCookieName(letter.id))?.value;
      if (!registeredSessionIsValid(token, letter.id, sessionCookie)) {
        return NextResponse.json(
          { error: "Registered delivery verification is required before an opened receipt can be recorded." },
          { status: 403, headers: { "Cache-Control": "no-store" } },
        );
      }
    }

    const usesE2EE = letter.metadata?.e2ee_version === 1 && letter.metadata?.payload_version === 3;
    let verifiedE2EEKey = false;
    if (usesE2EE) {
      const expectedProof = typeof letter.metadata?.e2ee_open_proof === "string"
        ? letter.metadata.e2ee_open_proof
        : "";

      // Older E2EE letters created before proof commitments cannot provide a
      // cryptographically verified opened receipt. Reading still works; only
      // the sender notification is withheld rather than making a weak claim.
      if (!expectedProof) {
        return NextResponse.json(
          { error: "A verified opened receipt is unavailable for this older encrypted letter." },
          { status: 409, headers: { "Cache-Control": "no-store" } },
        );
      }
      if (!openProofMatches(openProof, expectedProof)) {
        return NextResponse.json(
          { error: "Successful end-to-end decryption could not be verified." },
          { status: 403, headers: { "Cache-Control": "no-store" } },
        );
      }
      verifiedE2EEKey = true;
    }

    const now = new Date().toISOString();
    const previousOpenedAt = typeof letter.metadata?.opened_at === "string"
      ? letter.metadata.opened_at
      : "";
    let metadata: Record<string, unknown> = {
      ...(letter.metadata || {}),
      opened_at: previousOpenedAt || now,
    };

    if (!previousOpenedAt) {
      await updateLetterMetadata(letter.id, metadata);
      await insertLetterEvent(letter.id, "opened", {
        source: "recipient_page",
        opened_at: now,
        verified_e2ee_key: verifiedE2EEKey,
        registered_session_verified: registered,
      });
    }

    const notifySender = metadata.notify_sender_on_open === true;
    const sentAt = typeof metadata.opened_notification_sent_at === "string"
      ? metadata.opened_notification_sent_at
      : "";

    let notification = null;
    if (notifySender && letter.sender_email && !sentAt) {
      notification = await sendLetterOpenedEmail({
        letterId: letter.id,
        to: letter.sender_email,
        senderName: letter.sender_name,
        recipientName: letter.recipient_name,
        openedAt: previousOpenedAt || now,
      });

      if (notification.sent) {
        metadata = {
          ...metadata,
          opened_notification_sent_at: new Date().toISOString(),
        };
        await updateLetterMetadata(letter.id, metadata);
        await insertLetterEvent(letter.id, "sender_open_notification_sent", {
          provider: "resend",
          provider_id: notification.emailId || null,
          verified_e2ee_key: verifiedE2EEKey,
          registered_session_verified: registered,
        });
      } else {
        await insertLetterEvent(letter.id, "sender_open_notification_failed", {
          provider: "resend",
          reason: notification.message,
        });
      }
    }

    return NextResponse.json(
      {
        recorded: true,
        firstOpen: !previousOpenedAt,
        senderNotificationSent: notification?.sent || Boolean(sentAt),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Recipient event recording failed:", error);
    return NextResponse.json(
      { error: "The recipient event could not be recorded." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
