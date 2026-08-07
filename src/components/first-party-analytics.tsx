"use client";

import Script from "next/script";

declare global {
  interface Window {
    va?: (...args: unknown[]) => void;
    vaq?: unknown[][];
  }
}

export function trackFirstPartyEvent(name: "StartWriting" | "ReachedArrival" | "LetterPosted") {
  if (typeof window === "undefined") return;
  window.va?.("event", { name });
}

export function FirstPartyAnalytics() {
  return (
    <>
      <Script id="vercel-analytics-queue" strategy="afterInteractive">
        {`window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};`}
      </Script>
      <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
    </>
  );
}
