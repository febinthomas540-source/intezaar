import { NextResponse } from "next/server";
import {
  decryptLetterPayload,
  findLetterByManageToken,
  hashPrivateToken,
  insertLetterEvent,
  markRecipientNotified,
  updateLetterMetadata,
} from "@/lib/letter-security";
import { sendPostedLetterEmail, type EmailDeliveryResult } from "@/lib/resend-mail";
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
    if (url.origin !== expectedOrigin) return null;

    const match = url.pathname.match(/^\/receive\/([A-Za-z0-9_-]{40,60})$/);
    if (!match || hashPrivateToken(match[1]) !== accessTokenHash) return null;
    return url.toString();
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

    const payload = decryptLetterPayload(letter);
    const media = payload.media || [];
    if (!payload.mediaKey || !media.length) {
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
      message: "No recipient email was added. Share the private link manually.",
    };

    if (letter.recipient_email) {
      emailDelivery = await sendPostedLetterEmail({
        letterId: letter.id,
        to: letter.recipient_email,
        recipientName: letter.recipient_name,
        senderName: letter.sender_name,
        occasion: letter.occasion,
        recipientUrl,
      });
    }

    if (emailDelivery.sent) {
      await markRecipientNotified(letter.id);
      await insertLetterEvent(letter.id, "invitation_sent", {
        recipient_email: letter.recipient_email,
        provider: "resend",
        provider_id: emailDelivery.emailId || null,
        media_count: media.length,
      });
    } else if (letter.recipient_email && emailDelivery.attempted) {
      await insertLetterEvent(letter.id, "email_failed", {
        recipient_email: letter.recipient_email,
        provider: "resend",
        reason: emailDelivery.message,
        media_count: media.length,
      });
    }

    return NextResponse.json(
      {
        mediaReady: true,
        mediaCount: media.length,
        emailDelivery,
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
