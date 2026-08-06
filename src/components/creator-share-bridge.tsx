"use client";

import { useEffect } from "react";

const DRAFT_KEY = "intezaar:create-draft:v3";
const CONTACT_KEY = "intezaar:create-contacts:v1";
const POSTED_KEY = "intezaar:last-secure-letter:v1";

type Draft = {
  sender?: string;
  senderEmail?: string;
  recipient?: string;
  recipientEmail?: string;
  occasion?: string;
  heading?: string;
  letter?: string;
  closing?: string;
  format?: string;
  fromCity?: string;
  toCity?: string;
  arrivalDate?: string;
  arrivalTime?: string;
};

type EmailDelivery = {
  attempted: boolean;
  sent: boolean;
  recipient?: string;
  message: string;
  emailId?: string;
};

type SecureLetterResult = {
  recipientUrl: string;
  manageToken: string;
  opensAt: string;
  emailDelivery?: EmailDelivery;
};

type SavedSecureLetter = SecureLetterResult & {
  fingerprint: string;
};

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function readDraft(): Draft {
  const draft = readJson<Draft>(DRAFT_KEY, {});
  const contacts = readJson<Pick<Draft, "senderEmail" | "recipientEmail">>(CONTACT_KEY, {});
  return { ...draft, ...contacts };
}

function saveContacts(senderEmail: string, recipientEmail: string) {
  try {
    window.localStorage.setItem(CONTACT_KEY, JSON.stringify({ senderEmail, recipientEmail }));
  } catch {
    // Email fields still work for the current page when local storage is unavailable.
  }
}

function draftFingerprint(draft: Draft) {
  const source = JSON.stringify([
    draft.sender,
    draft.senderEmail,
    draft.recipient,
    draft.recipientEmail,
    draft.occasion,
    draft.heading,
    draft.letter,
    draft.closing,
    draft.format,
    draft.fromCity,
    draft.toCity,
    draft.arrivalDate,
    draft.arrivalTime,
  ]);

  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function readSavedLetter(fingerprint: string): SavedSecureLetter | null {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(POSTED_KEY) || "null") as SavedSecureLetter | null;
    return saved?.fingerprint === fingerprint ? saved : null;
  } catch {
    return null;
  }
}

function saveSecureLetter(result: SecureLetterResult, fingerprint: string) {
  const saved: SavedSecureLetter = { ...result, fingerprint };
  try {
    window.sessionStorage.setItem(POSTED_KEY, JSON.stringify(saved));
    window.localStorage.setItem(
      "intezaar:last-manage-token:v1",
      JSON.stringify({
        recipientUrl: result.recipientUrl,
        manageToken: result.manageToken,
        opensAt: result.opensAt,
      }),
    );
  } catch {
    // The recipient URL still works even when browser storage is unavailable.
  }
}

function createEmailInput(labelText: string, placeholder: string, value: string) {
  const label = document.createElement("label");
  label.append(document.createTextNode(labelText));

  const input = document.createElement("input");
  input.type = "email";
  input.inputMode = "email";
  input.autocomplete = "email";
  input.maxLength = 254;
  input.placeholder = placeholder;
  input.value = value;
  label.append(input);

  return { label, input };
}

function ensureEmailFields() {
  const panel = document.querySelector<HTMLElement>(".creation-write-panel");
  if (!panel || panel.querySelector('[data-intezaar-email-fields="true"]')) return;

  const firstGrid = panel.querySelector<HTMLElement>(".nostalgia-form-grid");
  if (!firstGrid) return;

  const contacts = readJson<Pick<Draft, "senderEmail" | "recipientEmail">>(CONTACT_KEY, {});
  const grid = document.createElement("div");
  grid.className = "nostalgia-form-grid secure-email-grid";
  grid.dataset.intezaarEmailFields = "true";

  const sender = createEmailInput(
    "Your email (optional)",
    "For future delivery updates",
    contacts.senderEmail || "",
  );
  const recipient = createEmailInput(
    "Recipient email (optional)",
    "Send the private link automatically",
    contacts.recipientEmail || "",
  );

  const sync = () => saveContacts(sender.input.value.trim(), recipient.input.value.trim());
  sender.input.addEventListener("input", sync);
  recipient.input.addEventListener("input", sync);

  grid.append(sender.label, recipient.label);
  firstGrid.after(grid);
}

function createOpensAt(draft: Draft) {
  const date = typeof draft.arrivalDate === "string" ? draft.arrivalDate : "";
  const time = typeof draft.arrivalTime === "string" ? draft.arrivalTime : "20:00";
  const localMoment = new Date(`${date}T${time}:00`);
  if (!date || !Number.isFinite(localMoment.getTime())) {
    throw new Error("Choose a valid arrival date and time before posting.");
  }
  return localMoment.toISOString();
}

async function createSecureLetter(draft: Draft): Promise<SecureLetterResult> {
  const response = await fetch("/api/letters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      senderName: draft.sender,
      senderEmail: draft.senderEmail,
      recipientName: draft.recipient,
      recipientEmail: draft.recipientEmail,
      occasion: draft.occasion,
      format: draft.format,
      fromCity: draft.fromCity,
      toCity: draft.toCity,
      heading: draft.heading,
      message: draft.letter,
      closing: draft.closing,
      opensAt: createOpensAt(draft),
      timezoneOffset: new Date().getTimezoneOffset(),
    }),
  });

  const result = await response.json() as Partial<SecureLetterResult> & { error?: string };
  if (!response.ok || !result.recipientUrl || !result.manageToken || !result.opensAt) {
    throw new Error(result.error || "The letter could not be stored securely.");
  }

  return result as SecureLetterResult;
}

function showCreationError(message: string) {
  const actions = document.querySelector<HTMLElement>(".post-panel .nostalgia-form-actions");
  if (!actions) return;
  let error = actions.parentElement?.querySelector<HTMLElement>(".secure-letter-error");
  if (!error) {
    error = document.createElement("p");
    error.className = "secure-letter-error media-error";
    error.setAttribute("role", "alert");
    actions.before(error);
  }
  error.textContent = message;
}

function clearCreationError() {
  document.querySelector(".secure-letter-error")?.remove();
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const field = document.createElement("textarea");
  field.value = value;
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

export function CreatorShareBridge() {
  useEffect(() => {
    let frame = 0;
    let secureUrl = "";
    let secureResult: SecureLetterResult | null = null;
    let creating = false;
    let allowContinue = false;

    const syncShareScreen = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        ensureEmailFields();
        if (!secureUrl) return;

        const code = document.querySelector<HTMLElement>(".share-link-box code");
        if (code && code.textContent !== secureUrl) code.textContent = secureUrl;

        const previewLinks = Array.from(
          document.querySelectorAll<HTMLAnchorElement>('a[href*="/receive/demo"]'),
        );
        if (previewLinks[0]) {
          previewLinks[0].href = secureUrl;
          previewLinks[0].textContent = "Open recipient link";
        }
        if (previewLinks[1]) previewLinks[1].style.display = "none";

        const note = document.querySelector<HTMLElement>(".prototype-transfer-note");
        if (note) {
          const deliveryMessage = secureResult?.emailDelivery?.message;
          note.textContent = deliveryMessage
            ? `${deliveryMessage} Your letter text is encrypted behind a private token. Photos, voice notes and videos remain browser-only during this beta.`
            : "Your letter text is encrypted behind a private token. Photos, voice notes and videos remain browser-only during this beta.";
          note.dataset.emailSent = String(Boolean(secureResult?.emailDelivery?.sent));
        }
      });
    };

    const openShareStep = (button: HTMLButtonElement) => {
      allowContinue = true;
      button.disabled = false;
      button.textContent = "Continue to share";
      button.click();
      window.setTimeout(() => {
        allowContinue = false;
        syncShareScreen();
      }, 0);
    };

    const handleClick = async (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest<HTMLButtonElement>("button");
      if (!button) return;

      const label = button.textContent?.trim() || "";
      const continueButton = label === "Continue to share" || label === "Securing your letter…";

      if (continueButton && !allowContinue) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (creating) return;

        clearCreationError();
        const draft = readDraft();
        const fingerprint = draftFingerprint(draft);
        const saved = readSavedLetter(fingerprint);

        if (saved) {
          secureUrl = saved.recipientUrl;
          secureResult = saved;
          openShareStep(button);
          return;
        }

        creating = true;
        button.disabled = true;
        button.textContent = "Securing your letter…";

        try {
          const result = await createSecureLetter(draft);
          secureUrl = result.recipientUrl;
          secureResult = result;
          saveSecureLetter(result, fingerprint);
          openShareStep(button);
        } catch (error) {
          const message = error instanceof Error ? error.message : "The letter could not be stored securely.";
          showCreationError(message);
          button.disabled = false;
          button.textContent = "Try secure posting again";
        } finally {
          creating = false;
        }
        return;
      }

      if (label === "Try secure posting again") {
        button.textContent = "Continue to share";
        button.click();
        return;
      }

      const copyButton = Boolean(button.closest(".share-link-box")) && label.toLowerCase().includes("copy");
      const shareButton = label === "Share letter link";
      if (!copyButton && !shareButton) return;

      const code = document.querySelector<HTMLElement>(".share-link-box code");
      const url = secureUrl || code?.textContent?.trim();
      if (!url) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (shareButton && navigator.share) {
        try {
          await navigator.share({
            title: "A private Intezaar letter",
            text: "A private letter has been posted for you.",
            url,
          });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }

      await copyText(url);
      const previous = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = previous;
      }, 1600);
    };

    document.addEventListener("click", handleClick, true);
    const observer = new MutationObserver(syncShareScreen);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    syncShareScreen();

    return () => {
      document.removeEventListener("click", handleClick, true);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
