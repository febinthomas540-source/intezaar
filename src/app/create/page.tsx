"use client";

import { useEffect, useState } from "react";
import { SenderGrowthPrompt } from "@/components/sender-growth-prompt";
import { StableLetterCreator } from "@/components/stable-letter-creator";
import { TurnstilePostingGuard } from "@/components/turnstile-posting-guard";
import { MAX_DELIVERY_MS, MIN_DELIVERY_MS } from "@/lib/letter-rules";
import "../photo-adjustment.css";
import "../seal-post.css";
import "../mobile-creator-polish.css";
import "../turnstile-posting.css";
import "../registered-delivery.css";
import "../delivery-presets.css";

const DRAFT_KEY = "intezaar:create-draft:v3";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function localDateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function localTimeInput(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function CreatePage() {
  const [prefillReady, setPrefillReady] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const occasion = params.get("occasion")?.trim().slice(0, 100) || "";
      const opensAtValue = params.get("opensAt")?.trim() || "";
      const hasCampaignPrefill = Boolean(occasion || opensAtValue);

      if (hasCampaignPrefill) {
        const existingRaw = window.localStorage.getItem(DRAFT_KEY);
        const existing = existingRaw ? JSON.parse(existingRaw) as Record<string, unknown> : {};
        const next: Record<string, unknown> = { ...existing };

        if (occasion) next.occasion = occasion;

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
      }
    } catch (error) {
      console.error("Campaign creator prefill could not be applied:", error);
    } finally {
      setPrefillReady(true);
    }
  }, []);

  if (!prefillReady) return null;

  return (
    <>
      <StableLetterCreator />
      <TurnstilePostingGuard />
      <SenderGrowthPrompt />
    </>
  );
}
