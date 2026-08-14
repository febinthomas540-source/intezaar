import { NextResponse } from "next/server";
import {
  decryptLetterPayload,
  e2eeTransportMedia,
  findLetterByManageToken,
  hashPrivateToken,
  insertLetterEvent,
  letterUsesE2EE,
  markRecipientNotified,
  updateLetterMetadata,
} from "@/lib/letter-security";
import {
  scheduleArrivalLetterEmail,
  sendPostedLetterEmail,
  sendSenderPostedLetterEmail,
  type EmailDeliveryResult,
} from "@/lib/resend-mail";
import { verifyMediaObjects } from "@/lib/supabase-storage";

export const runtime = "nodejs";

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function expectedSiteOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return configured ? new URL(configured).origin : new URL(request.url).origin;
}

function validatedRecipientUrl(raw: unknown, accessTokenHash: string | undefined, expectedOrigin: string) {
  if (typeof raw !== "string" || !accessTokenHash) return null;

  try {
    const url = new URL(raw);
    if (url.origin !== expectedOrigin || url.search || url.hash) return null;

    const match = url.pathname.match(/^\/receive\/([A-Za-z0-9_-]{40,60})$/);
    if (!match || hashPrivateToken(match[1]) !== accessTokenHash) return null;
    return `${url.origin}${url.pathname}`;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    const body = await request.json() as {
      manageToken?: unknown;
      recipientUrl?: unknown;
      itemIds?: unknown;
    };
    const manageToken = cleanText(body.manageToken, 100);
    if (!/^[A-Za-z0-9_-]{40,60}$/.test(manageToken)) {
      return NextResponse.json({ error: "Invalid media management token." }, { status: 400 });
    }

    const letter = await findLetterByManageToken(manageToken);
    if (!letter || letter.status !== "posted") {
      return NextResponse.json({ error: "This letter cannot accept media uploads." }, { status: 404 });
    }

    const isE2EE = letterUsesE2EE(letter);
    const legacyPayload = isE2EE ? null : decryptLetterPayload(letter);
    const media = isE2EE ? e2eeTransportMedia(letter) : legacyPayload?.media || [];
    if ((!isE2EE && !legacyPayload?.mediaKey) || !media.length) {
      return NextResponse.json({ error: "This letter has no private media to complete." }, { status: 400 });
    }

    const itemIds = Array.isArray(body.itemIds)
      ? body.itemIds.map((value) => cleanText(value, 64)).filter(Boolean)
      : [];
    const expectedIds = media.map((item) => item.id).sort();
    const submittedIds = [...new Set(itemIds)].sort();
    if (
      expectedIds.length !== submittedIds.length ||
      !expectedIds.every((id, index) => id === submittedIds[index])
    ) {
      return NextResponse.json({ error: "Not every selected media item was uploaded." }, { status: 400 });
    }

    const recipientUrl = validatedRecipientUrl(
      body.recipientUrl,
      letter.access_token_hash,
      expectedSiteOrigin(request),
    );
    if (!recipientUrl) {
      return NextResponse.json({ error: "The private recipient link could not be verified." }, { status: 400 });
    }

    const objectsExist = await verifyMediaObjects(media.map((item) => item.path));
    if (!objectsExist) {
      return NextResponse.json(
        { error: "One or more encrypted media files have not finished uploading." },
        { status: 409 },
      );
    }

    await updateLetterMetadata(letter.id, {
      ...(letter.metadata || {}),
      media_transferred: true,
      media_ready: true,
      media_count: media.length,
      media_uploaded_at: new Date().toISOString(),
    });

    let emailDelivery: EmailDeliveryResult = {
      attempted: false,
      sent: false,
      message: "Recipient email notifications were not requested.",
    };

    if (letter.recipient_email) {
      emailDelivery = await sendPostedLetterEmail({
        letterId: letter.id,
        to: letter.recipient_email,
        recipientName: letter.recipient_name,
        senderName: letter.sender_name,
        occasion: letter.occasion,
        recipientUrl,
        e2ee: isE2EE,
      });
    }

    if (emailDelivery.sent) {
      await markRecipientNotified(letter.id);
      await insertLetterEvent(letter.id, "invitation_sent", {
        recipient_email: letter.recipient_email,
        provider: "resend",
        provider_id: emailDelivery.emailId || null,
        media_count: media.length,
        e2ee: isE2EE,
      });
    } else if (letter.recipient_email) {
      await insertLetterEvent(letter.id, "email_failed", {
        recipient_email: letter.recipient_email,
        provider: "resend",
        reason: emailDelivery.message,
        media_count: media.length,
        e2ee: isE2EE,
      });
    }

    const arrivalDelivery: EmailDeliveryResult = letter.recipient_email
      ? await scheduleArrivalLetterEmail({
          letterId: letter.id,
          to: letter.recipient_email,
          recipientName: letter.recipient_name,
          senderName: letter.sender_name,
          occasion: letter.occasion,
          recipientUrl,
          opensAt: letter.opens_at,
          e2ee: isE2EE,
        })
      : {
          attempted: false,
          sent: false,
          message: "Recipient ready-to-open notifications were not requested.",
        };

    if (arrivalDelivery.sent) {
      await insertLetterEvent(letter.id, "arrival_email_scheduled", {
        recipient_email: letter.recipient_email,
        provider: "resend",
        provider_id: arrivalDelivery.emailId || null,
        scheduled_at: letter.opens_at,
        media_count: media.length,
        e2ee: isE2EE,
      });
    } else if (letter.recipient_email) {
      await insertLetterEvent(letter.id, "arrival_email_schedule_failed", {
        recipient_email: letter.recipient_email,
        provider: "resend",
        reason: arrivalDelivery.message,
        media_count: media.length,
        e2ee: isE2EE,
      });
    }

    const senderNotifications = letter.metadata?.notify_sender_on_open === true && Boolean(letter.sender_email);
    const senderDelivery: EmailDeliveryResult = senderNotifications && letter.sender_email
      ? await sendSenderPostedLetterEmail({
          letterId: letter.id,
          to: letter.sender_email,
          senderName: letter.sender_name,
          recipientName: letter.recipient_name,
          opensAt: letter.opens_at,
          openedNotificationEnabled: true,
        })
      : {
          attempted: false,
          sent: false,
          message: "Sender email notifications were not requested.",
        };

    if (senderDelivery.sent) {
      await insertLetterEvent(letter.id, "sender_posting_receipt_sent", {
        provider: "resend",
        provider_id: senderDelivery.emailId || null,
        media_count: media.length,
      });
    } else if (senderNotifications) {
      await insertLetterEvent(letter.id, "sender_posting_receipt_failed", {
        provider: "resend",
        reason: senderDelivery.message,
        media_count: media.length,
      });
    }

    return NextResponse.json(
      {
        mediaReady: true,
        mediaCount: media.length,
        emailDelivery,
        notificationDelivery: {
          recipientPosted: emailDelivery,
          recipientArrival: arrivalDelivery,
          senderPosted: senderDelivery,
          senderOpenedEnabled: senderNotifications,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Media completion failed:", error);
    return NextResponse.json(
      { error: "The encrypted media could not be completed. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
