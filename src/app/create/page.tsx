"use client";

import { useEffect, useState } from "react";
import { SimpleLetterCreator } from "@/components/simple-letter-creator";
import { TurnstilePostingGuard } from "@/components/turnstile-posting-guard";
import { MAX_DELIVERY_MS, MIN_DELIVERY_MS } from "@/lib/letter-rules";
import "../turnstile-posting.css";

const DRAFT_KEY = "intezaar:create-draft:v3";
const ONAM_CAMPAIGN_ID = "onam2026";
const LEGACY_MALAYALAM_ONAM_CAMPAIGN_ID = "onam2026-malayalam";
const ONAM_DRAFT_KEY = "intezaar:create-onam2026-draft:v1";
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

const LEGACY_ONAM_STARTER_PREFIXES = [
  "ഈ ഓണത്തിന് വീട്ടിൽ നിങ്ങളോടൊപ്പം ഇരിക്കാൻ കഴിയാത്തതിന്റെ കുറവ്",
  "ദൂരെയിരുന്ന് ഹൃദയം നിറഞ്ഞ ഓണാശംസകൾ.",
  "ഓണം വരുമ്പോഴെല്ലാം പഴയ വീട്ടുവിശേഷങ്ങളും ബാല്യകാല ഓർമ്മകളും",
  "ഈ ഓണം നമുക്ക് വേറെ വേറെ സ്ഥലങ്ങളിലായിരിക്കുന്നു.",
  "ചില ദിവസങ്ങളിൽ ദൂരം സാധാരണ പോലെ തോന്നും.",
  "ഈ ഓണത്തിന് ഞാൻ വീട്ടിൽ ഇല്ലെങ്കിലും",
  "ദൂരെയിരുന്ന് എല്ലാവർക്കും ഹൃദയം നിറഞ്ഞ ഓണാശംസകൾ.",
  "ഓണം വന്നാൽ വീട്ടിലെ പഴയ ഓർമ്മകൾ",
  "ഈ ഓണം അല്പം വ്യത്യസ്തമാണ്",
  "ചില ദിവസങ്ങളിൽ ദൂരം പതിവുപോലെ തോന്നും.",
  "I may be away from home this Onam",
  "Happy Onam from far away.",
  "Onam always brings back memories of home",
  "This Onam feels a little different",
  "There are days when distance feels ordinary",
];

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
  const letter = typeof draft.letter === "string" ? draft.letter.trim() : "";

  if (LEGACY_ONAM_STARTER_PREFIXES.some((prefix) => letter.startsWith(prefix))) {
    return true;
  }

  if (draft.occasion !== "Celebration" || draft.format !== "festival") return false;
  if (typeof draft.arrivalDate !== "string" || typeof draft.arrivalTime !== "string") return false;

  const timestamp = new Date(`${draft.arrivalDate}T${draft.arrivalTime}:00`).getTime();
  return Number.isFinite(timestamp) && Math.abs(timestamp - THIRUVONAM_OPEN_UTC) < 60_000;
}

function restoreNormalDraft() {
  const onamRaw = window.localStorage.getItem(DRAFT_KEY);
  if (onamRaw) window.localStorage.setItem(ONAM_DRAFT_KEY, onamRaw);

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

  if (current) window.localStorage.setItem(ONAM_DRAFT_KEY, current);
  window.localStorage.removeItem(DRAFT_KEY);
}

function applyPrefill(
  base: Record<string, unknown>,
  occasion: string,
  heading: string,
  starter: string,
  format: string,
  opensAtValue: string,
) {
  const next: Record<string, unknown> = { ...base };

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
      next.arrivalDate = localDateInput(opensAt);
      next.arrivalTime = localTimeInput(opensAt);
      next.arrivalPreset = "custom";
    }
  }

  return next;
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
      const hasPrefill = Boolean(occasion || opensAtValue || heading || starter || format);
      const isOnamCampaign = campaign === ONAM_CAMPAIGN_ID || campaign === LEGACY_MALAYALAM_ONAM_CAMPAIGN_ID;
      const activeCampaign = window.localStorage.getItem(CAMPAIGN_ACTIVE_KEY);

      if (!isOnamCampaign && activeCampaign === ONAM_CAMPAIGN_ID) {
        restoreNormalDraft();
      }

      if (!isOnamCampaign) {
        migrateLegacyOnamLeak();
        if (!hasPrefill) return;

        const existing = parseDraft(window.localStorage.getItem(DRAFT_KEY));
        const next = applyPrefill(existing, occasion, heading, starter, format, opensAtValue);
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
        return;
      }

      const onamAlreadyActive = window.localStorage.getItem(CAMPAIGN_ACTIVE_KEY) === ONAM_CAMPAIGN_ID;

      if (!onamAlreadyActive) {
        const normalDraft = window.localStorage.getItem(DRAFT_KEY);
        window.localStorage.setItem(CAMPAIGN_BACKUP_KEY, normalDraft ?? NO_DRAFT_SENTINEL);

        const previousOnamDraft = window.localStorage.getItem(ONAM_DRAFT_KEY);
        if (previousOnamDraft) {
          window.localStorage.setItem(DRAFT_KEY, previousOnamDraft);
        } else {
          window.localStorage.removeItem(DRAFT_KEY);
        }
      }

      window.localStorage.setItem(CAMPAIGN_ACTIVE_KEY, ONAM_CAMPAIGN_ID);

      const existing = parseDraft(window.localStorage.getItem(DRAFT_KEY));
      const next = applyPrefill(existing, occasion, heading, starter, format, opensAtValue);
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      window.localStorage.setItem(ONAM_DRAFT_KEY, JSON.stringify(next));
    } catch (error) {
      console.error("Campaign creator prefill could not be applied:", error);
    } finally {
      setPrefillReady(true);
    }
  }, []);

  if (!prefillReady) return null;

  return (
    <div data-nosnippet>
      <SimpleLetterCreator />
      <TurnstilePostingGuard />
    </div>
  );
}
