import { NextResponse } from "next/server";
import {
  findLetterByManageToken,
  insertLetterEvent,
  updateSenderNotificationPreferences,
} from "@/lib/letter-security";
import { sendLetterOpenedEmail } from "@/lib/opened-letter-mail";

export const runtime = "nodejs";

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function cleanEmail(value: unknown) {
  const email = cleanText(value, 254).toLowerCase();
  if (!email) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    const body = await request.json() as {
      manageToken?: unknown;
      email?: unknown;
      notifyOnOpen?: unknown;
    };
    const manageToken = cleanText(body.manageToken, 100);
    const notifyOnOpen = body.notifyOnOpen === true;
    const email = cleanEmail(body.email);

    if (!/^[A-Za-z0-9_-]{40,60}$/.test(manageToken)) {
      return NextResponse.json({ error: "The letter management token is invalid." }, { status: 400 });
    }
    if (notifyOnOpen && !email) {
      return NextResponse.json({ error: "Enter a valid email address for the opened-letter notification." }, { status: 400 });
    }
    if (email === null) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const letter = await findLetterByManageToken(manageToken);
    if (!letter) {
      return NextResponse.json({ error: "This letter could not be found." }, { status: 404 });
    }

    const expiryTime = letter.expires_at ? new Date(letter.expires_at).getTime() : Number.NaN;
    const unavailable = letter.status === "cancelled"
      || letter.status === "expired"
      || (Number.isFinite(expiryTime) && Date.now() >= expiryTime);
    if (unavailable) {
      return NextResponse.json({ error: "Notifications can no longer be changed for this letter." }, { status: 409 });
    }

    const now = new Date().toISOString();
    let metadata: Record<string, unknown> = {
      ...(letter.metadata || {}),
      notify_sender_on_open: notifyOnOpen,
      sender_notification_updated_at: now,
    };

    if (!notifyOnOpen) {
      delete metadata.opened_notification_sent_at;
    }

    await updateSenderNotificationPreferences(
      letter.id,
      notifyOnOpen ? email : null,
      metadata,
    );

    await insertLetterEvent(
      letter.id,
      notifyOnOpen ? "sender_open_notification_enabled" : "sender_open_notification_disabled",
      { channel: notifyOnOpen ? "email" : "none" },
    );

    let alreadyOpenedNotification = null;
    const openedAt = typeof metadata.opened_at === "string" ? metadata.opened_at : "";
    const notificationSentAt = typeof metadata.opened_notification_sent_at === "string"
      ? metadata.opened_notification_sent_at
      : "";

    if (notifyOnOpen && openedAt && !notificationSentAt && email) {
      alreadyOpenedNotification = await sendLetterOpenedEmail({
        letterId: letter.id,
        to: email,
        senderName: letter.sender_name,
        recipientName: letter.recipient_name,
        openedAt,
      });

      if (alreadyOpenedNotification.sent) {
        metadata = {
          ...metadata,
          opened_notification_sent_at: new Date().toISOString(),
        };
        await updateSenderNotificationPreferences(letter.id, email, metadata);
        await insertLetterEvent(letter.id, "sender_open_notification_sent", {
          provider: "resend",
          provider_id: alreadyOpenedNotification.emailId || null,
          reason: "enabled_after_open",
        });
      }
    }

    return NextResponse.json(
      {
        saved: true,
        notifyOnOpen,
        alreadyOpened: Boolean(openedAt),
        notificationSent: alreadyOpenedNotification?.sent || Boolean(notificationSentAt),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Sender notification preference update failed:", error);
    return NextResponse.json(
      { error: "The notification preference could not be saved. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
