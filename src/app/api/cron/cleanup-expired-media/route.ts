import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { cleanupExpiredLetterMedia } from "@/lib/expired-letter-cleanup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorised(request: Request, secret: string) {
  const supplied = Buffer.from(request.headers.get("authorization") || "", "utf8");
  const expected = Buffer.from(`Bearer ${secret}`, "utf8");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    console.error("CRON_SECRET is missing; expired media cleanup cannot run.");
    return NextResponse.json(
      { error: "Cleanup is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!authorised(request, secret)) {
    return NextResponse.json(
      { error: "Unauthorised." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await cleanupExpiredLetterMedia();
    return NextResponse.json(
      { ok: result.failed === 0, ...result, completedAt: new Date().toISOString() },
      {
        status: result.failed === 0 ? 200 : 207,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Expired media cleanup job failed:", error);
    return NextResponse.json(
      { error: "Expired media cleanup failed." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
