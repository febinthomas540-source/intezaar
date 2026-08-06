"use client";

import { useEffect } from "react";

const DRAFT_KEY = "intezaar:create-draft:v3";
const POSTED_KEY = "intezaar:last-secure-letter:v1";

type Draft = {
  sender?: string;
  recipient?: string;
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

type SecureLetterResult = {
  recipientUrl: string;
  manageToken: string;
  opensAt: string;
};

type SavedSecureLetter = SecureLetterResult & {
  fingerprint: string;
};

function readDraft(): Draft {
  try {
    return JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "{}") as Draft;
  } catch {
    return {};
  }
}

function draftFingerprint(draft: Draft) {
  const source = JSON.stringify([
    draft.sender,
    draft.recipient,
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
      recipientName: draft.recipient,
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
    let creating = false;
    let allowContinue = false;

    const syncShareScreen = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
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
          note.textContent = "Your letter text is encrypted and stored behind a private token. Photos, voice notes and videos remain browser-only during this beta.";
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
          openShareStep(button);
          return;
        }

        creating = true;
        button.disabled = true;
        button.textContent = "Securing your letter…";

        try {
          const result = await createSecureLetter(draft);
          secureUrl = result.recipientUrl;
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

    return () => {
      document.removeEventListener("click", handleClick, true);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
