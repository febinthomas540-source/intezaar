"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PIXEL_ID = "1358227923087265";
const CONSENT_KEY = "intezaar:marketing-consent:v1";

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

  useEffect(() => {
    if (privateRecipient) return;
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (saved === "accepted" || saved === "declined") setConsent(saved);
    } catch {
      // Consent remains unset when browser storage is unavailable.
    }
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

      {consent === null ? (
        <aside
          role="dialog"
          aria-label="Advertising measurement choice"
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            left: 16,
            zIndex: 1000,
            maxWidth: 560,
            margin: "0 auto",
            padding: "16px 18px",
            border: "1px solid rgba(117,62,44,.25)",
            borderRadius: 16,
            background: "#fff8ed",
            color: "#432a20",
            boxShadow: "0 18px 55px rgba(40,22,15,.22)",
          }}
        >
          <strong style={{ display: "block", fontFamily: "Georgia,serif", fontSize: 18 }}>Help us understand what works</strong>
          <p style={{ margin: "7px 0 13px", fontSize: 13, lineHeight: 1.5 }}>
            Intezaar can use Meta advertising measurement to understand visits and letter-creation steps. It is optional and does not include the contents of your private letter.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => choose("accepted")} style={{ border: 0, borderRadius: 999, padding: "10px 15px", background: "#8f2f24", color: "#fff8ef", fontWeight: 800 }}>
              Allow measurement
            </button>
            <button type="button" onClick={() => choose("declined")} style={{ border: "1px solid rgba(82,49,36,.24)", borderRadius: 999, padding: "10px 15px", background: "transparent", color: "#4a3026", fontWeight: 800 }}>
              No thanks
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
