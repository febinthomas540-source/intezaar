"use client";

import { useEffect, useState } from "react";
import { RecipientArrivalNotificationUpgrade } from "@/components/recipient-arrival-notification-upgrade";
import { SenderGrowthPrompt } from "@/components/sender-growth-prompt";
import { StableLetterCreator } from "@/components/stable-letter-creator";
import { TurnstilePostingGuard } from "@/components/turnstile-posting-guard";
import { MAX_DELIVERY_MS, MIN_DELIVERY_MS } from "@/lib/letter-rules";
import "../photo-adjustment.css";
import "../seal-post.css";
import "../mobile-creator-polish.css";
import "../turnstile-posting.css";
import "../registered-delivery.css";
import "../recipient-arrival-notification.css";
import "../delivery-presets.css";

const DRAFT_KEY = "intezaar:create-draft:v3";
const CAMPAIGN_DRAFT_KEY = "intezaar:create-campaign-draft:v1";
const CAMPAIGN_BACKUP_KEY = "intezaar:create-normal-draft-backup:v1";
const CAMPAIGN_ACTIVE_KEY = "intezaar:create-campaign-active:v1";
const NO_DRAFT_SENTINEL = "__INTEZAAR_NO_DRAFT__";
const THIRUVONAM_OPEN_UTC = Date.parse("2026-08-26T01:30:00.000Z");
const PREFILL_FORMATS = new Set([
  "classic",
  "minimal",
  "typewriter",
  "airmail",
  "inland",
  "postcard",
  "folded",
  "photo",
  "festival",
  "telegram",
]);

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function localDateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function localTimeInput(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseDraft(raw: string | null) {
  if (!raw) return {} as Record<string, unknown>;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {} as Record<string, unknown>;
  }
}

function looksLikeLegacyOnamCampaignDraft(raw: string | null) {
  if (!raw) return false;
  const draft = parseDraft(raw);
  if (draft.occasion !== "Celebration" || draft.format !== "festival") return false;
  if (typeof draft.arrivalDate !== "string" || typeof draft.arrivalTime !== "string") return false;

  const timestamp = new Date(`${draft.arrivalDate}T${draft.arrivalTime}:00`).getTime();
  return Number.isFinite(timestamp) && Math.abs(timestamp - THIRUVONAM_OPEN_UTC) < 60_000;
}

function restoreNormalDraft() {
  const campaignRaw = window.localStorage.getItem(DRAFT_KEY);
  if (campaignRaw) window.localStorage.setItem(CAMPAIGN_DRAFT_KEY, campaignRaw);

  const backup = window.localStorage.getItem(CAMPAIGN_BACKUP_KEY);
  if (backup && backup !== NO_DRAFT_SENTINEL) {
    window.localStorage.setItem(DRAFT_KEY, backup);
  } else {
    window.localStorage.removeItem(DRAFT_KEY);
  }

  window.localStorage.removeItem(CAMPAIGN_ACTIVE_KEY);
  window.localStorage.removeItem(CAMPAIGN_BACKUP_KEY);
}

function migrateLegacyOnamLeak() {
  const current = window.localStorage.getItem(DRAFT_KEY);
  if (!looksLikeLegacyOnamCampaignDraft(current)) return;

  // Older Onam links wrote directly into the ordinary creator draft. Preserve
  // that work as a campaign draft, then give the normal creator a clean slate.
  if (current) window.localStorage.setItem(CAMPAIGN_DRAFT_KEY, current);
  window.localStorage.removeItem(DRAFT_KEY);
}

export default function CreatePage() {
  const [prefillReady, setPrefillReady] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const occasion = params.get("occasion")?.trim().slice(0, 100) || "";
      const opensAtValue = params.get("opensAt")?.trim() || "";
      const heading = params.get("heading")?.trim().slice(0, 240) || "";
      const starter = params.get("starter")?.trim().slice(0, 1200) || "";
      const requestedFormat = params.get("format")?.trim() || "";
      const campaign = params.get("campaign")?.trim().slice(0, 80) || "";
      const format = PREFILL_FORMATS.has(requestedFormat) ? requestedFormat : "";
      const hasCampaignPrefill = Boolean(campaign || occasion || opensAtValue || heading || starter || format);

      if (!hasCampaignPrefill) {
        if (window.localStorage.getItem(CAMPAIGN_ACTIVE_KEY)) {
          restoreNormalDraft();
        } else {
          migrateLegacyOnamLeak();
        }
        return;
      }

      const campaignAlreadyActive = Boolean(window.localStorage.getItem(CAMPAIGN_ACTIVE_KEY));

      if (!campaignAlreadyActive) {
        const normalDraft = window.localStorage.getItem(DRAFT_KEY);
        window.localStorage.setItem(CAMPAIGN_BACKUP_KEY, normalDraft ?? NO_DRAFT_SENTINEL);

        // Resume an earlier campaign draft if one exists. Otherwise start the
        // campaign clean instead of merging a normal letter into an Onam one.
        const previousCampaignDraft = window.localStorage.getItem(CAMPAIGN_DRAFT_KEY);
        if (previousCampaignDraft) {
          window.localStorage.setItem(DRAFT_KEY, previousCampaignDraft);
        } else {
          window.localStorage.removeItem(DRAFT_KEY);
        }
      }

      window.localStorage.setItem(CAMPAIGN_ACTIVE_KEY, campaign || "campaign");

      const existingRaw = window.localStorage.getItem(DRAFT_KEY);
      const next: Record<string, unknown> = { ...parseDraft(existingRaw) };

      if (occasion) next.occasion = occasion;
      if (heading) next.heading = heading;
      if (starter) next.letter = starter;
      if (format) next.format = format;

      if (opensAtValue) {
        const opensAt = new Date(opensAtValue);
        const timestamp = opensAt.getTime();
        const now = Date.now();
        if (
          Number.isFinite(timestamp)
          && timestamp >= now + MIN_DELIVERY_MS
          && timestamp <= now + MAX_DELIVERY_MS
        ) {
          // Campaign links carry an absolute opening instant. Convert that
          // instant to the visitor's local form fields so createSecureLetter()
          // converts it back to the same UTC moment when the letter is posted.
          next.arrivalDate = localDateInput(opensAt);
          next.arrivalTime = localTimeInput(opensAt);
          next.arrivalPreset = "custom";
        }
      }

      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      window.localStorage.setItem(CAMPAIGN_DRAFT_KEY, JSON.stringify(next));
    } catch (error) {
      console.error("Campaign creator prefill could not be applied:", error);
    } finally {
      setPrefillReady(true);
    }
  }, []);

  if (!prefillReady) return null;

  return (
    <div data-nosnippet>
      <RecipientArrivalNotificationUpgrade />
      <StableLetterCreator />
      <TurnstilePostingGuard />
      <SenderGrowthPrompt />
    </div>
  );
}
