import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  findLetterByAccessToken,
  insertLetterEvent,
  updateLetterMetadata,
} from "@/lib/letter-security";
import { sendSafetyReportAlert } from "@/lib/safety-report-mail";
import {
  higherSafetyPriority,
  triageSafetyReport,
  validSafetyReportCategory,
} from "@/lib/safety-triage";

export const runtime = "nodejs";

const MIN_REPORT_INTERVAL_MS = 60_000;
const MAX_REPORTS_PER_LETTER = 10;

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }

    const body = await request.json() as {
      token?: unknown;
      category?: unknown;
      details?: unknown;
      urgent?: unknown;
      consentToShareDetails?: unknown;
    };

    const token = cleanText(body.token, 100);
    const category = cleanText(body.category, 64);
    const details = cleanText(body.details, 1200);
    const urgent = body.urgent === true;
    const consentToShareDetails = body.consentToShareDetails === true;

    if (!/^[A-Za-z0-9_-]{40,60}$/.test(token) || !validSafetyReportCategory(category)) {
      return NextResponse.json({ error: "Choose a valid safety concern." }, { status: 400 });
    }

    if (details && !consentToShareDetails) {
      return NextResponse.json(
        { error: "Confirm that you understand report details are sent to Intezaar for safety review." },
        { status: 400 },
      );
    }

    const letter = await findLetterByAccessToken(token);
    if (!letter) {
      return NextResponse.json({ error: "This delivery could not be found." }, { status: 404 });
    }

    const metadata = letter.metadata || {};
    const reportCount = typeof metadata.abuse_report_count === "number"
      ? metadata.abuse_report_count
      : 0;
    const lastReportAt = typeof metadata.last_abuse_report_at === "string"
      ? Date.parse(metadata.last_abuse_report_at)
      : Number.NaN;

    if (reportCount >= MAX_REPORTS_PER_LETTER) {
      return NextResponse.json(
        { error: "This delivery has already been reported for safety review." },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (Number.isFinite(lastReportAt) && Date.now() - lastReportAt < MIN_REPORT_INTERVAL_MS) {
      return NextResponse.json(
        { error: "A report was just submitted for this delivery. Please wait before trying again." },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    const triage = triageSafetyReport({ category, details, urgent });
    const reportId = randomUUID();
    const reportedAt = new Date().toISOString();
    const nextMetadata: Record<string, unknown> = {
      ...metadata,
      abuse_report_count: reportCount + 1,
      last_abuse_report_at: reportedAt,
      safety_review_required: true,
      safety_priority: higherSafetyPriority(metadata.safety_priority, triage.priority),
      safety_last_category: category,
    };

    await updateLetterMetadata(letter.id, nextMetadata);
    await insertLetterEvent(letter.id, "abuse_report_submitted", {
      report_id: reportId,
      category,
      priority: triage.priority,
      urgent,
      details_shared: Boolean(details),
      details: details || null,
      content_auto_scanned: false,
      automatic_enforcement: false,
      requires_human_review: true,
      triage_indicator_count: triage.indicatorCount,
      source: "recipient_report",
      reported_at: reportedAt,
    });

    if (triage.priority === "critical") {
      await insertLetterEvent(letter.id, "safety_escalation_flagged", {
        report_id: reportId,
        category,
        reason: urgent ? "reporter_marked_immediate_danger" : "critical_safety_category",
        automatic_enforcement: false,
        reported_at: reportedAt,
      });
    }

    const alert = await sendSafetyReportAlert({
      reportId,
      letterId: letter.id,
      category,
      priority: triage.priority,
      urgent,
      detailsShared: Boolean(details),
      reportedAt,
    });

    if (alert.sent) {
      await insertLetterEvent(letter.id, "safety_alert_sent", {
        report_id: reportId,
        provider: "resend",
        provider_id: alert.emailId || null,
        priority: triage.priority,
      });
    } else if (alert.attempted) {
      await insertLetterEvent(letter.id, "safety_alert_failed", {
        report_id: reportId,
        provider: "resend",
        priority: triage.priority,
      });
    }

    return NextResponse.json(
      {
        received: true,
        reference: reportId.slice(0, 8).toUpperCase(),
        priority: triage.priority,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Safety report submission failed:", error);
    return NextResponse.json(
      { error: "The safety report could not be recorded. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
