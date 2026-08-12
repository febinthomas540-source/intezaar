"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type FunnelEvent =
  | "StartWriting"
  | "ReachedPersonalise"
  | "ReachedArrival"
  | "ReachedSeal"
  | "ReachedPost"
  | "PostAttempt"
  | "SecurePostAttempt"
  | "LetterPosted";

const SAFE_ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function trackFirstPartyEvent(name: FunnelEvent) {
  track(name);
}

export function FirstPartyAnalytics() {
  const pathname = usePathname();
  const privateRecipient = pathname.startsWith("/receive/");

  useEffect(() => {
    if (privateRecipient || pathname !== "/create") return;

    const sent = new Set<FunnelEvent>();
    const fireOnce = (name: FunnelEvent) => {
      if (sent.has(name)) return;
      sent.add(name);
      trackFirstPartyEvent(name);
    };

    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select")) fireOnce("StartWriting");
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button");
      const label = button?.textContent?.trim() || "";

      if (label === "Post the letter") fireOnce("PostAttempt");
      if (
        label === "Continue to share"
        || label === "Retry encrypted media upload"
        || label === "Try secure posting again"
      ) {
        fireOnce("SecurePostAttempt");
      }
    };

    const inspect = () => {
      const text = document.body.innerText.toLowerCase();
      if (text.includes("personalise it")) fireOnce("ReachedPersonalise");
      if (text.includes("choose when it should arrive")) fireOnce("ReachedArrival");
      if (text.includes("seal the letter")) fireOnce("ReachedSeal");
      if (text.includes("post your letter") || text.includes("final collection")) fireOnce("ReachedPost");
      if (text.includes("your letter is on its way") || text.includes("private recipient link")) {
        fireOnce("LetterPosted");
      }
    };

    document.addEventListener("focusin", onFocus);
    document.addEventListener("click", onClick, true);
    const observer = new MutationObserver(inspect);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    inspect();

    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("click", onClick, true);
      observer.disconnect();
    };
  }, [pathname, privateRecipient]);

  if (privateRecipient) return null;

  return (
    <Analytics
      beforeSend={(event: BeforeSendEvent) => {
        try {
          const original = new URL(event.url);
          const safeUrl = new URL(original.origin + original.pathname);

          // Keep only campaign attribution. Creator template parameters can
          // contain personal starter text, so everything else is stripped.
          for (const key of SAFE_ATTRIBUTION_PARAMS) {
            const value = original.searchParams.get(key);
            if (value) safeUrl.searchParams.set(key, value.slice(0, 160));
          }

          return { ...event, url: safeUrl.toString() };
        } catch {
          return null;
        }
      }}
    />
  );
}
