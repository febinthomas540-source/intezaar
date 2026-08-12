"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __intezaarTurnstileToken?: string;
  }
}

const MOBILE_QUERY = "(max-width: 720px)";

function prepareMobilePreview() {
  if (!window.matchMedia(MOBILE_QUERY).matches) return;
  const details = document.querySelector<HTMLDetailsElement>(".creation-preview-disclosure");
  if (!details || details.dataset.conversionPrepared === "true") return;

  // Personalising is optional. On a small screen, do not make a full rendered
  // preview sit between the visitor and the next step unless they ask to see it.
  details.dataset.conversionPrepared = "true";
  details.open = false;
}

function findSecurePostButton(panel: HTMLElement) {
  return Array.from(panel.querySelectorAll<HTMLButtonElement>(".nostalgia-form-actions button"))
    .find((button) => {
      const label = button.textContent?.trim() || "";
      return label === "Continue to share"
        || label === "Retry encrypted media upload"
        || label === "Try secure posting again";
    });
}

export function CreatorConversionUpgrade() {
  useEffect(() => {
    let autoFinishTimer: number | null = null;
    let securePostCompleted = false;

    const inspect = () => {
      prepareMobilePreview();

      if (document.querySelector(".creation-share-panel.posted-share-panel")) {
        securePostCompleted = true;
        return;
      }
      if (securePostCompleted) return;

      const panel = document.querySelector<HTMLElement>(".post-panel");
      if (!panel || panel.dataset.autoSecurePostAttempted === "true") return;
      if (!panel.querySelector(".post-posted")) return;

      const button = findSecurePostButton(panel);
      if (!button || button.disabled) return;

      // Production posting remains fail-closed. Wait for the existing
      // Turnstile guard to hold a valid one-time token before automatically
      // completing the real encrypted POST.
      if (!window.__intezaarTurnstileToken) return;

      panel.dataset.autoSecurePostAttempted = "true";
      autoFinishTimer = window.setTimeout(() => {
        if (button.isConnected && !button.disabled) button.click();
      }, 120);
    };

    const observer = new MutationObserver(inspect);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class", "disabled"],
    });

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const onViewportChange = () => prepareMobilePreview();
    mediaQuery.addEventListener?.("change", onViewportChange);
    inspect();

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener?.("change", onViewportChange);
      if (autoFinishTimer !== null) window.clearTimeout(autoFinishTimer);
    };
  }, []);

  return null;
}
