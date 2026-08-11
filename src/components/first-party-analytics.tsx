"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type FunnelEvent = "StartWriting" | "ReachedArrival" | "LetterPosted";

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

    const inspect = () => {
      const text = document.body.innerText.toLowerCase();
      if (text.includes("choose when it should arrive")) fireOnce("ReachedArrival");
      if (text.includes("your letter is on its way") || text.includes("private recipient link")) {
        fireOnce("LetterPosted");
      }
    };

    document.addEventListener("focusin", onFocus);
    const observer = new MutationObserver(inspect);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    inspect();

    return () => {
      document.removeEventListener("focusin", onFocus);
      observer.disconnect();
    };
  }, [pathname, privateRecipient]);

  if (privateRecipient) return null;

  return (
    <Analytics
      beforeSend={(event: BeforeSendEvent) => {
        try {
          const url = new URL(event.url);
          url.search = "";
          url.hash = "";
          return { ...event, url: url.toString() };
        } catch {
          return null;
        }
      }}
    />
  );
}
