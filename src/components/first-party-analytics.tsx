"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    va?: (...args: unknown[]) => void;
    vaq?: unknown[][];
  }
}

function trackFirstPartyEvent(name: "StartWriting" | "ReachedArrival" | "LetterPosted") {
  window.va?.("event", { name });
}

export function FirstPartyAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/create") return;

    const sent = new Set<string>();
    const fireOnce = (name: "StartWriting" | "ReachedArrival" | "LetterPosted") => {
      if (sent.has(name)) return;
      sent.add(name);
      trackFirstPartyEvent(name);
    };

    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select")) fireOnce("StartWriting");
    };

    const inspect = () => {
      const text = document.body.innerText.toLowerCase();
      if (text.includes("choose when it should arrive")) fireOnce("ReachedArrival");
      if (text.includes("your letter is on its way") || text.includes("private recipient link")) fireOnce("LetterPosted");
    };

    document.addEventListener("focusin", onFocus);
    const observer = new MutationObserver(inspect);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    inspect();

    return () => {
      document.removeEventListener("focusin", onFocus);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <>
      <Script id="vercel-analytics-queue" strategy="afterInteractive">
        {`window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};`}
      </Script>
      <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
    </>
  );
}
