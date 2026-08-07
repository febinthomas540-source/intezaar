"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type TurnstileOptions = {
  sitekey: string;
  action: string;
  theme: "light" | "dark" | "auto";
  size: "normal" | "flexible" | "compact";
  appearance: "always" | "execute" | "interaction-only";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __intezaarTurnstileToken?: string;
  }
}

type Status = "loading" | "ready" | "expired" | "error";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

function statusCopy(status: Status) {
  if (status === "ready") return "Security check complete";
  if (status === "expired") return "Security check expired — checking again";
  if (status === "error") return "Security check could not load";
  return "Preparing secure posting";
}

export function TurnstilePostingGuard() {
  const [scriptReady, setScriptReady] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const widgetContainer = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;

    let mount: HTMLDivElement | null = null;

    const syncMount = () => {
      const actions = document.querySelector<HTMLElement>(".post-panel .nostalgia-form-actions");

      if (actions && (!mount || !mount.isConnected)) {
        mount = document.createElement("div");
        mount.className = "turnstile-posting-mount";
        actions.before(mount);
        setPortalTarget(mount);
      } else if (!actions && mount) {
        mount.remove();
        mount = null;
        setPortalTarget(null);
      }
    };

    const observer = new MutationObserver(syncMount);
    observer.observe(document.body, { childList: true, subtree: true });
    syncMount();

    return () => {
      observer.disconnect();
      mount?.remove();
      setPortalTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!siteKey || !scriptReady || !portalTarget || !widgetContainer.current || !window.turnstile) {
      return;
    }

    setStatus("loading");
    window.__intezaarTurnstileToken = undefined;

    widgetId.current = window.turnstile.render(widgetContainer.current, {
      sitekey: siteKey,
      action: "post_letter",
      theme: "light",
      size: "flexible",
      appearance: "always",
      callback: (token) => {
        window.__intezaarTurnstileToken = token;
        setStatus("ready");
      },
      "expired-callback": () => {
        window.__intezaarTurnstileToken = undefined;
        setStatus("expired");
      },
      "error-callback": () => {
        window.__intezaarTurnstileToken = undefined;
        setStatus("error");
      },
    });

    return () => {
      window.__intezaarTurnstileToken = undefined;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = null;
    };
  }, [portalTarget, scriptReady]);

  useEffect(() => {
    const reset = () => {
      window.__intezaarTurnstileToken = undefined;
      setStatus("loading");
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current);
      }
    };

    window.addEventListener("intezaar:turnstile-reset", reset);
    return () => window.removeEventListener("intezaar:turnstile-reset", reset);
  }, []);

  if (!siteKey) return null;

  return (
    <>
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => setStatus("error")}
      />

      {portalTarget ? createPortal(
        <section className={`secure-posting-check secure-posting-${status}`} aria-live="polite">
          <div className="secure-posting-copy">
            <span className="secure-posting-dot" aria-hidden="true" />
            <div>
              <small>SECURE POSTING CHECK</small>
              <strong>{statusCopy(status)}</strong>
              <p>Cloudflare helps stop automated spam before this private letter is stored or emailed.</p>
            </div>
          </div>
          <div className="secure-turnstile-widget" ref={widgetContainer} />
        </section>,
        portalTarget,
      ) : null}
    </>
  );
}
