"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
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
const protectedCreatePaths = new Set([
  "/api/letters",
  "/api/letters/notification-create",
]);

function statusCopy(status: Status) {
  if (status === "ready") return "Security check complete";
  if (status === "expired") return "Security check expired — checking again";
  if (status === "error") return "Security check could not load";
  return "Preparing secure posting";
}

function blockedResponse() {
  return new Response(
    JSON.stringify({ error: "Complete the secure posting check and try again." }),
    {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
}

export function TurnstilePostingGuard() {
  const [scriptReady, setScriptReady] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [widgetNode, setWidgetNode] = useState<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [challengeVersion, setChallengeVersion] = useState(0);
  const widgetId = useRef<string | null>(null);

  const captureWidgetNode = useCallback((node: HTMLDivElement | null) => {
    setWidgetNode(node);
  }, []);

  useEffect(() => {
    if (!siteKey) return;

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const rawUrl = input instanceof Request ? input.url : input.toString();
      const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
      const url = new URL(rawUrl, window.location.origin);

      if (
        url.origin === window.location.origin
        && protectedCreatePaths.has(url.pathname)
        && method === "POST"
      ) {
        const token = window.__intezaarTurnstileToken;
        if (!token) return blockedResponse();

        const headers = new Headers(input instanceof Request ? input.headers : undefined);
        if (init?.headers) {
          new Headers(init.headers).forEach((value, key) => headers.set(key, value));
        }
        headers.set("x-intezaar-turnstile-token", token);

        try {
          return await originalFetch(input, { ...init, headers });
        } finally {
          window.dispatchEvent(new Event("intezaar:turnstile-reset"));
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

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
    if (!siteKey || !scriptReady || !portalTarget || !widgetNode || !window.turnstile) {
      return;
    }

    // The posting animation can replace the actions area. A completed token is
    // still valid, so keep it instead of forcing the visitor through a second check.
    if (window.__intezaarTurnstileToken) {
      setStatus("ready");
      return;
    }

    setStatus("loading");
    const renderedId = window.turnstile.render(widgetNode, {
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
    widgetId.current = renderedId;

    return () => {
      if (window.turnstile) {
        try {
          window.turnstile.remove(renderedId);
        } catch {
          // The old container may already have been removed by the creator UI.
        }
      }
      if (widgetId.current === renderedId) widgetId.current = null;
    };
  }, [portalTarget, widgetNode, scriptReady, challengeVersion]);

  useEffect(() => {
    if (!siteKey) return;

    const syncSecurePostingButtons = () => {
      const blocked = status !== "ready";
      document.querySelectorAll<HTMLButtonElement>("[data-secure-posting-submit='true']").forEach((button) => {
        button.disabled = blocked;
        button.setAttribute("aria-disabled", String(blocked));
        if (blocked) {
          button.title = status === "error"
            ? "The secure posting check could not load. Refresh the page and try again."
            : "Waiting for the secure posting check to complete.";
        } else {
          button.removeAttribute("title");
        }
      });
    };

    const observer = new MutationObserver(syncSecurePostingButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    syncSecurePostingButtons();

    return () => observer.disconnect();
  }, [status]);

  useEffect(() => {
    const reset = () => {
      window.__intezaarTurnstileToken = undefined;
      setStatus("loading");

      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetId.current);
          return;
        } catch {
          widgetId.current = null;
        }
      }

      // When the approved widget was removed during the animation, trigger a
      // fresh render only after its one-time token has actually been consumed.
      setChallengeVersion((version) => version + 1);
    };

    window.addEventListener("intezaar:turnstile-reset", reset);
    return () => window.removeEventListener("intezaar:turnstile-reset", reset);
  }, []);

  useEffect(() => () => {
    window.__intezaarTurnstileToken = undefined;
  }, []);

  if (!siteKey) return null;

  return (
    <>
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onReady={() => setScriptReady(true)}
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
          <div className="secure-turnstile-widget" ref={captureWidgetNode} />
        </section>,
        portalTarget,
      ) : null}
    </>
  );
}
