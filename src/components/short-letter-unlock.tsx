"use client";

import { useEffect } from "react";

/**
 * Keeps the first-step continue button aligned with Intezaar's intended rule:
 * sender, recipient and any non-empty letter are enough to continue.
 *
 * This sits beside the creator so the public beta can accept very short notes
 * without changing the rest of the creation flow.
 */
export function ShortLetterUnlock() {
  useEffect(() => {
    let frame = 0;

    const sync = () => {
      const panel = document.querySelector<HTMLElement>(".creation-write-panel");
      if (!panel) return;

      const identityInputs = panel.querySelectorAll<HTMLInputElement>(
        ".nostalgia-form-grid:first-of-type input",
      );
      const sender = identityInputs[0]?.value.trim() ?? "";
      const recipient = identityInputs[1]?.value.trim() ?? "";
      const message = panel.querySelector<HTMLTextAreaElement>("textarea")?.value.trim() ?? "";
      const continueButton = Array.from(panel.querySelectorAll<HTMLButtonElement>("button")).find(
        (button) => button.textContent?.trim() === "Continue to personalise",
      );

      if (!continueButton) return;

      const shouldDisable = !(sender && recipient && message);
      if (continueButton.disabled !== shouldDisable) {
        continueButton.disabled = shouldDisable;
      }
      continueButton.setAttribute("aria-disabled", String(shouldDisable));
    };

    const scheduleSync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(sync);
    };

    document.addEventListener("input", scheduleSync, true);
    const observer = new MutationObserver(scheduleSync);
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleSync();

    return () => {
      document.removeEventListener("input", scheduleSync, true);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
