"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PIXEL_ID = "1358227923087265";
const CONSENT_KEY = "intezaar:marketing-consent:v1";
const PROMPT_DELAY_MS = 20_000;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function track(event: string) {
  window.fbq?.("trackCustom", event);
}

export function MetaPixel() {
  const pathname = usePathname();
  const privateRecipient = pathname.startsWith("/receive/");
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (privateRecipient) return;

    let timer: number | undefined;
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (saved === "accepted" || saved === "declined") {
        setConsent(saved);
        setShowPrompt(false);
        return;
      }
    } catch {
      // Consent remains unset when browser storage is unavailable.
    }

    timer = window.setTimeout(() => setShowPrompt(true), PROMPT_DELAY_MS);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [privateRecipient]);

  useEffect(() => {
    if (privateRecipient || consent !== "accepted" || !window.fbq) return;
    window.fbq("track", "PageView");
  }, [pathname, consent, privateRecipient]);

  useEffect(() => {
    if (privateRecipient || consent !== "accepted" || pathname !== "/create") return;

    const sent = new Set<string>();
    const fireOnce = (name: string) => {
      if (sent.has(name)) return;
      sent.add(name);
      track(name);
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
  }, [consent, pathname, privateRecipient]);

  function choose(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // The choice still applies for the current page.
    }
    setConsent(value);
    setShowPrompt(false);
  }

  if (privateRecipient) return null;

  return (
    <>
      {consent === "accepted" ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} alt="" />
          </noscript>
        </>
      ) : null}

      {consent === null && showPrompt ? (
        <aside
          role="dialog"
          aria-label="Optional advertising measurement"
          style={{
            position: "fixed",
            right: 14,
            bottom: 14,
            zIndex: 1000,
            width: "min(360px, calc(100vw - 28px))",
            padding: "13px 14px",
            border: "1px solid rgba(117,62,44,.22)",
            borderRadius: 8,
            background: "rgba(255,248,237,.98)",
            color: "#432a20",
            boxShadow: "0 12px 34px rgba(40,22,15,.16)",
          }}
        >
          <strong style={{ display: "block", fontSize: 14, fontWeight: 750 }}>Optional measurement</strong>
          <p style={{ margin: "5px 0 10px", fontSize: 12, lineHeight: 1.45 }}>
            Allow Meta advertising measurement to help us understand visits and creation steps. It does not include private letter contents, and it is never loaded on recipient pages.
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <button type="button" onClick={() => choose("accepted")} style={{ border: 0, borderRadius: 5, padding: "8px 11px", background: "#8f2f24", color: "#fff8ef", fontSize: 12, fontWeight: 750 }}>
              Allow
            </button>
            <button type="button" onClick={() => choose("declined")} style={{ border: "1px solid rgba(82,49,36,.24)", borderRadius: 5, padding: "8px 11px", background: "transparent", color: "#4a3026", fontSize: 12, fontWeight: 750 }}>
              No thanks
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
