import { NextResponse } from "next/server";
import {
  findLetterByManageToken,
  insertLetterEvent,
  updateLetterMetadata,
} from "@/lib/letter-security";

export const runtime = "nodejs";

function cleanEmail(value: unknown) {
  if (typeof value !== "string") return "";
  const email = value.trim().toLowerCase().slice(0, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    const body = await request.json() as Record<string, unknown>;
    const recipientEmail = cleanEmail(body.recipientEmail);
    const registeredDelivery = body.registeredDelivery === true && Boolean(recipientEmail);

    const target = new URL("/api/letters", request.url);
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("content-length");

    const upstream = await fetch(target, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const raw = await upstream.text();
    let result: Record<string, unknown> | null = null;
    try {
      result = raw ? JSON.parse(raw) as Record<string, unknown> : null;
    } catch {
      result = null;
    }

    if (upstream.ok && result && typeof result.manageToken === "string") {
      const letter = await findLetterByManageToken(result.manageToken);
      if (letter) {
        const metadata: Record<string, unknown> = {
          ...(letter.metadata || {}),
          registered_delivery: registeredDelivery,
          recipient_notification_email: Boolean(recipientEmail),
          recipient_notification_mode: recipientEmail ? "posted_and_arrival_email" : "private_link_only",
          recipient_notification_updated_at: new Date().toISOString(),
        };

        await updateLetterMetadata(letter.id, metadata);
        await insertLetterEvent(
          letter.id,
          recipientEmail ? "recipient_notifications_enabled" : "recipient_notifications_not_requested",
          { source: "creator", registered_delivery: registeredDelivery },
        );

        if (registeredDelivery) {
          await insertLetterEvent(letter.id, "registered_delivery_enabled", { source: "creator" });
        }
      }

      result.registeredDelivery = registeredDelivery;
      result.recipientNotificationEmail = Boolean(recipientEmail);
    }

    return new NextResponse(result ? JSON.stringify(result) : raw, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Notification-aware letter creation failed:", error);
    return NextResponse.json(
      { error: "The letter could not be prepared for notification delivery." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
