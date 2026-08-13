"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// NEXT_PUBLIC_META_PIXEL_ID is the production configuration point. Keep the
// existing beta pixel as a temporary fallback so current measurement does not
// disappear before the Vercel environment variable is added.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "1358227923087265";
const CONSENT_KEY = "intezaar:marketing-consent:v1";
const PENDING_LEAD_KEY = "intezaar:meta-pending-lead:v1";
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

function flushPendingLead() {
  if (!window.fbq) return false;

  try {
    const raw = window.sessionStorage.getItem(PENDING_LEAD_KEY);
    if (!raw) return true;
    const payload = JSON.parse(raw) as Record<string, unknown>;
    window.fbq("track", "Lead", payload);
    window.sessionStorage.removeItem(PENDING_LEAD_KEY);
  } catch {
    // Measurement must never interfere with navigation or letter creation.
  }

  return true;
}

export function MetaPixel() {
  const pathname = usePathname();
  const privateRecipient = pathname.startsWith("/receive/");
  // Creator URLs can contain campaign prefills such as heading/starter text.
  // Third-party pixels must never see those URLs, even after marketing consent.
  const sensitiveRoute = privateRecipient || pathname === "/create";
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (sensitiveRoute) return;

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
  }, [sensitiveRoute]);

  useEffect(() => {
    if (sensitiveRoute || consent !== "accepted") return;

    let attempts = 0;
    const tryMeasurement = () => {
      if (window.fbq) {
        window.fbq("track", "PageView");
        flushPendingLead();
        return true;
      }
      attempts += 1;
      return false;
    };

    if (tryMeasurement()) return;
    const timer = window.setInterval(() => {
      if (tryMeasurement() || attempts >= 20) window.clearInterval(timer);
    }, 250);
    return () => window.clearInterval(timer);
  }, [pathname, consent, sensitiveRoute]);

  useEffect(() => {
    if (sensitiveRoute || consent !== "accepted" || pathname !== "/create") return;

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
  }, [consent, pathname, sensitiveRoute]);

  function choose(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // The choice still applies for the current page.
    }
    setConsent(value);
    setShowPrompt(false);
  }

  if (sensitiveRoute) return null;

  return (
    <>
      {consent === "accepted" ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');`}
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
            Allow Meta advertising measurement to help us understand public-site visits. It does not include private letter contents, and it is never loaded on the creator or recipient pages.
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
