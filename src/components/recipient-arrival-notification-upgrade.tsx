"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

declare global {
  interface Window {
    __intezaarTurnstileToken?: string;
  }
}

function setText(node: HTMLElement | null | undefined, value: string) {
  if (node && node.textContent !== value) node.textContent = value;
}

function setLabelText(label: HTMLLabelElement, value: string) {
  const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
  if (textNode && textNode.textContent !== value) textNode.textContent = value;
}

export function RecipientArrivalNotificationUpgrade() {
  const [registeredDelivery, setRegisteredDelivery] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const registeredRef = useRef(false);
  const recipientEmailRef = useRef("");

  useEffect(() => {
    registeredRef.current = registeredDelivery;
  }, [registeredDelivery]);

  useEffect(() => {
    let mount: HTMLDivElement | null = null;

    const upgrade = () => {
      const section = document.querySelector<HTMLElement>(".registered-delivery-option");
      if (!section) {
        if (mount) {
          mount.remove();
          mount = null;
          setPortalTarget(null);
        }
        return;
      }

      section.classList.add("recipient-notification-option");

      const headingWrap = section.querySelector<HTMLElement>(":scope > div");
      const eyebrow = headingWrap?.querySelector<HTMLElement>("span");
      const heading = headingWrap?.querySelector<HTMLElement>("h3");
      const copy = headingWrap?.querySelector<HTMLElement>("p");
      const emailLabel = section.querySelector<HTMLLabelElement>(":scope > label");
      const emailInput = emailLabel?.querySelector<HTMLInputElement>("input[type='email']");
      const status = section.querySelector<HTMLElement>(":scope > small");

      setText(eyebrow, "Optional notification");
      setText(heading, "Send them email reminders");
      setText(
        copy,
        "Add their email for an instant delivery email with a return button, plus another email when the letter becomes openable. The private letter and decryption key are never emailed.",
      );
      if (emailLabel) setLabelText(emailLabel, "Recipient email (optional) ");

      const email = emailInput?.value.trim() || "";
      recipientEmailRef.current = email;
      if (status) {
        const statusCopy = email
          ? "Email reminders on · after they use the complete private link once, reminder buttons can bring them back on that browser."
          : "Skip this if you prefer to share the private link yourself.";
        setText(status, statusCopy);
        status.dataset.active = String(Boolean(email));
      }

      if (!mount || !mount.isConnected) {
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

      const email = recipientEmailRef.current;
      if (registeredRef.current && email) {
        setText(
          summary,
          "Email reminders are scheduled and Registered Intezaar Mail is enabled. Share the complete private link once; later reminder buttons can return the recipient on the same browser, and they will verify with a one-time code before the encrypted letter is released.",
        );
      } else if (email) {
        setText(
          summary,
          "Email reminders are scheduled. Share the complete private link once; after the recipient opens it on their browser, future email buttons can bring them back without emailing the decryption key.",
        );
      }
    };

    const observer = new MutationObserver(rewritePostedSummary);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
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
          <small>Extra privacy · optional</small>
        </span>
      </label>
      <p>
        Off by default. Turn this on only if you want the recipient to verify their email before the encrypted letter is released.
      </p>
    </section>,
    portalTarget,
  ) : null;
}
