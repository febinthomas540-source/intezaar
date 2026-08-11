import { NextResponse } from "next/server";
import {
  findLetterByAccessToken,
  insertLetterEvent,
  updateLetterMetadata,
} from "@/lib/letter-security";
import { sendLetterOpenedEmail } from "@/lib/opened-letter-mail";

export const runtime = "nodejs";

const actions = new Set(["opened", "write_back", "future_self", "share_idea"]);

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    const body = await request.json() as { token?: unknown; action?: unknown };
    const token = cleanText(body.token, 100);
    const action = cleanText(body.action, 32);

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
        });
      } else if (notification.attempted) {
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
