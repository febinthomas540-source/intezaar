"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const REGISTERED_KEY = "intezaar:recipient-verification:v1";

declare global {
  interface Window {
    __intezaarTurnstileToken?: string;
  }
}

function readRegisteredChoice() {
  try {
    return window.sessionStorage.getItem(REGISTERED_KEY) === "true";
  } catch {
    return false;
  }
}

function setLabelText(label: HTMLLabelElement, value: string) {
  const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
  if (textNode) textNode.textContent = value;
}

export function RecipientArrivalNotificationUpgrade() {
  const [registeredDelivery, setRegisteredDelivery] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const registeredRef = useRef(false);

  useEffect(() => {
    const saved = readRegisteredChoice();
    registeredRef.current = saved;
    setRegisteredDelivery(saved);
  }, []);

  useEffect(() => {
    registeredRef.current = registeredDelivery;
    try {
      window.sessionStorage.setItem(REGISTERED_KEY, String(registeredDelivery));
    } catch {
      // The choice still applies for this page session.
    }
  }, [registeredDelivery]);

  useEffect(() => {
    let mount: HTMLDivElement | null = null;
    let activeSection: HTMLElement | null = null;

    const upgrade = () => {
      const section = document.querySelector<HTMLElement>(".registered-delivery-option");
      if (!section) {
        if (mount) {
          mount.remove();
          mount = null;
          setPortalTarget(null);
        }
        activeSection = null;
        return;
      }

      activeSection = section;
      section.classList.add("recipient-notification-option");

      const headingWrap = section.querySelector<HTMLElement>(":scope > div");
      const eyebrow = headingWrap?.querySelector<HTMLElement>("span");
      const heading = headingWrap?.querySelector<HTMLElement>("h3");
      const copy = headingWrap?.querySelector<HTMLElement>("p");
      const emailLabel = section.querySelector<HTMLLabelElement>(":scope > label");
      const emailInput = emailLabel?.querySelector<HTMLInputElement>("input[type='email']");
      const status = section.querySelector<HTMLElement>(":scope > small");

      if (eyebrow) eyebrow.textContent = "Arrival notification";
      if (heading) heading.textContent = "Tell them when the seal can be opened";
      if (copy) {
        copy.textContent = "Add their email and Intezaar will send a delivery notice now and one arrival notification when the chosen opening moment is reached. The emails never contain the letter, private media or decryption key.";
      }
      if (emailLabel) setLabelText(emailLabel, "Recipient email (optional) ");

      if (status) {
        const hasEmail = Boolean(emailInput?.value.trim());
        status.textContent = hasEmail
          ? "Two service emails: one after posting, one when the letter becomes openable."
          : "No email added — you can still share the complete private link manually.";
        status.dataset.active = String(hasEmail);
      }

      if (!mount || !mount.isConnected || activeSection !== section) {
        mount?.remove();
        mount = document.createElement("div");
        mount.className = "recipient-verification-mount";
        section.after(mount);
        setPortalTarget(mount);
      }
    };

    const observer = new MutationObserver(upgrade);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    document.addEventListener("input", upgrade, true);
    upgrade();

    return () => {
      observer.disconnect();
      document.removeEventListener("input", upgrade, true);
      mount?.remove();
      setPortalTarget(null);
    };
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const rawUrl = input instanceof Request ? input.url : input.toString();
      const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
      const url = new URL(rawUrl, window.location.origin);

      if (url.origin === window.location.origin && url.pathname === "/api/letters" && method === "POST") {
        const bodyText = typeof init?.body === "string" ? init.body : "";
        let body: Record<string, unknown>;
        try {
          body = bodyText ? JSON.parse(bodyText) as Record<string, unknown> : {};
        } catch {
          return originalFetch(input, init);
        }

        body.registeredDelivery = registeredRef.current;

        const headers = new Headers(input instanceof Request ? input.headers : undefined);
        if (init?.headers) {
          new Headers(init.headers).forEach((value, key) => headers.set(key, value));
        }

        // Normally Turnstile wraps this fetch after this bridge and supplies the
        // token. This fallback keeps the route robust if effect ordering changes.
        let resetLocally = false;
        if (!headers.get("x-intezaar-turnstile-token") && window.__intezaarTurnstileToken) {
          headers.set("x-intezaar-turnstile-token", window.__intezaarTurnstileToken);
          resetLocally = true;
        }

        try {
          return await originalFetch("/api/letters/notification-create", {
            ...init,
            method: "POST",
            headers,
            body: JSON.stringify(body),
          });
        } finally {
          if (resetLocally) window.dispatchEvent(new Event("intezaar:turnstile-reset"));
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    const rewritePostedSummary = () => {
      const panel = document.querySelector<HTMLElement>(".creation-share-panel.posted-share-panel");
      if (!panel) return;
      const paragraphs = panel.querySelectorAll<HTMLParagraphElement>(":scope > p");
      const summary = paragraphs.length > 1 ? paragraphs[1] : null;
      if (!summary) return;

      const email = document.querySelector<HTMLInputElement>(".registered-delivery-option input[type='email']")?.value.trim();
      if (registeredRef.current && email) {
        summary.textContent = "Arrival email is scheduled and Registered Intezaar Mail is enabled. The recipient will verify with a one-time code before the encrypted letter is released.";
      } else if (email) {
        summary.textContent = "Intezaar will email the recipient when the letter becomes openable. Share the complete private link with them too — the email does not contain the decryption key.";
      }
    };

    const observer = new MutationObserver(rewritePostedSummary);
    observer.observe(document.body, { childList: true, subtree: true });
    rewritePostedSummary();
    return () => observer.disconnect();
  }, []);

  return portalTarget ? createPortal(
    <section className="recipient-verification-choice" aria-label="Optional recipient verification">
      <label>
        <input
          type="checkbox"
          checked={registeredDelivery}
          onChange={(event) => setRegisteredDelivery(event.target.checked)}
        />
        <span>
          <strong>Require a one-time code before opening</strong>
          <small>Optional extra privacy · Registered Intezaar Mail</small>
        </span>
      </label>
      <p>
        Leave this off for normal notification-only delivery. Turn it on only if you want the recipient to verify their email before sender details, encrypted letter data or private-media URLs are released.
      </p>
    </section>,
    portalTarget,
  ) : null;
}
