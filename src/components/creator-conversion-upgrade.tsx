"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __intezaarTurnstileToken?: string;
  }
}

const MOBILE_QUERY = "(max-width: 720px)";

type OptionalKind = "route" | "notification";

function setNodeText(node: Element | null, value: string) {
  if (node && node.textContent !== value) node.textContent = value;
}

function prepareMobilePreview() {
  if (!window.matchMedia(MOBILE_QUERY).matches) return;
  const details = document.querySelector<HTMLDetailsElement>(".creation-preview-disclosure");
  if (!details || details.dataset.conversionPrepared === "true") return;

  // Personalising is optional. On a small screen, do not make a full rendered
  // preview sit between the visitor and the next step unless they ask to see it.
  details.dataset.conversionPrepared = "true";
  details.open = false;
}

function optionalState(panel: HTMLElement, kind: OptionalKind) {
  return panel.dataset[kind === "route" ? "mobileRouteOpen" : "mobileNotificationOpen"] === "true";
}

function setOptionalState(panel: HTMLElement, kind: OptionalKind, open: boolean) {
  const key = kind === "route" ? "mobileRouteOpen" : "mobileNotificationOpen";
  const value = String(open);
  if (panel.dataset[key] !== value) panel.dataset[key] = value;
}

function makeOptionalToggle(
  panel: HTMLElement,
  target: HTMLElement,
  kind: OptionalKind,
  closedLabel: string,
  openLabel: string,
  hint: string,
) {
  const selector = `[data-mobile-optional-toggle="${kind}"]`;
  let button = panel.querySelector<HTMLButtonElement>(selector);

  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-optional-toggle";
    button.dataset.mobileOptionalToggle = kind;

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    const note = document.createElement("small");
    const icon = document.createElement("i");
    copy.append(title, note);
    button.append(copy, icon);
    target.before(button);

    button.addEventListener("click", () => {
      setOptionalState(panel, kind, !optionalState(panel, kind));
      window.dispatchEvent(new Event("intezaar:creator-optional-change"));
    });
  }

  const open = optionalState(panel, kind);
  const title = button.querySelector("strong");
  const note = button.querySelector("small");
  const icon = button.querySelector("i");
  setNodeText(title, open ? openLabel : closedLabel);
  setNodeText(note, hint);
  setNodeText(icon, open ? "−" : "+");
  if (button.getAttribute("aria-expanded") !== String(open)) {
    button.setAttribute("aria-expanded", String(open));
  }
  target.classList.toggle("mobile-optional-collapsed", !open);

  return open;
}

function prepareMobileOptionals() {
  if (!window.matchMedia(MOBILE_QUERY).matches) return;
  const panel = document.querySelector<HTMLElement>(".creation-panel .arrival-postal-grid")?.closest<HTMLElement>(".creation-panel");
  if (!panel) return;

  const route = panel.querySelector<HTMLElement>(".postal-route-card");
  if (route) {
    makeOptionalToggle(
      panel,
      route,
      "route",
      "Add route details",
      "Hide route details",
      "Optional · for the cinematic journey",
    );
  }

  const notification = panel.querySelector<HTMLElement>(".registered-delivery-option");
  if (notification) {
    const emailInput = notification.querySelector<HTMLInputElement>("input[type='email']");
    const verificationChoice = panel.querySelector<HTMLInputElement>(".recipient-verification-choice input[type='checkbox']");
    const hasExistingChoice = Boolean(emailInput?.value.trim()) || verificationChoice?.checked === true;
    if (hasExistingChoice && panel.dataset.mobileNotificationOpen === undefined) {
      setOptionalState(panel, "notification", true);
    }

    const open = makeOptionalToggle(
      panel,
      notification,
      "notification",
      "Add email notification",
      "Hide email options",
      "Optional · opening-time email and extra privacy",
    );

    const verificationMount = panel.querySelector<HTMLElement>(".recipient-verification-mount");
    verificationMount?.classList.toggle("mobile-optional-collapsed", !open);
  }
}

function currentCreatorStage() {
  if (document.querySelector(".creation-share-panel.posted-share-panel")) return "share";
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".creation-stepper button"));
  const activeIndex = buttons.findIndex((button) => button.classList.contains("active"));
  return activeIndex >= 0 ? `step-${activeIndex + 1}` : "";
}

function scrollCurrentStepIntoView() {
  if (!window.matchMedia(MOBILE_QUERY).matches) return;

  const target = document.querySelector<HTMLElement>(
    ".creation-panel, .creation-share-panel.posted-share-panel",
  );
  if (!target) return;

  const stepper = document.querySelector<HTMLElement>(".creation-stepper");
  const stickyOffset = (stepper?.offsetHeight || 0) + 10;
  const top = target.getBoundingClientRect().top + window.scrollY - stickyOffset;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotion ? "auto" : "smooth",
  });
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
    let stepScrollTimer: number | null = null;
    let securePostCompleted = false;
    let previousStage = "";

    const inspect = () => {
      prepareMobilePreview();
      prepareMobileOptionals();

      const stage = currentCreatorStage();
      if (stage && stage !== previousStage) {
        if (previousStage) {
          if (stepScrollTimer !== null) window.clearTimeout(stepScrollTimer);
          // Let React paint the new panel first, then place its heading directly
          // below the sticky progress bar instead of preserving the old scroll depth.
          stepScrollTimer = window.setTimeout(scrollCurrentStepIntoView, 40);
        }
        previousStage = stage;
      }

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
      attributeFilter: ["class", "disabled", "value", "checked"],
    });

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const onViewportChange = () => {
      prepareMobilePreview();
      prepareMobileOptionals();
    };
    const onOptionalChange = () => prepareMobileOptionals();
    mediaQuery.addEventListener?.("change", onViewportChange);
    window.addEventListener("intezaar:creator-optional-change", onOptionalChange);
    inspect();

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener?.("change", onViewportChange);
      window.removeEventListener("intezaar:creator-optional-change", onOptionalChange);
      if (autoFinishTimer !== null) window.clearTimeout(autoFinishTimer);
      if (stepScrollTimer !== null) window.clearTimeout(stepScrollTimer);
    };
  }, []);

  return null;
}
