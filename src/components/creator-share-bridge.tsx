"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import {
  getCapturedMedia,
  type CapturedMedia,
} from "@/components/creator-media-bridge";

const DRAFT_KEY = "intezaar:create-draft:v3";
const POSTED_KEY = "intezaar:last-secure-letter:v1";
const MEDIA_BUCKET = "letter-media";

type Draft = {
  sender?: string;
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

type MediaUploadPlan = {
  key: string;
  items: Array<{
    id: string;
    path: string;
    iv: string;
    token: string;
  }>;
};

type SecureLetterResult = {
  recipientUrl: string;
  manageToken: string;
  opensAt: string;
  emailDelivery?: EmailDelivery;
  mediaUpload?: MediaUploadPlan | null;
  mediaReady?: boolean;
  mediaCount?: number;
};

type SavedSecureLetter = Omit<SecureLetterResult, "mediaUpload"> & {
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
  return readJson<Draft>(DRAFT_KEY, {});
}

function draftFingerprint(draft: Draft, media: CapturedMedia[]) {
  const source = JSON.stringify([
    draft.sender,
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
    media.map((item) => [
      item.id,
      item.kind,
      item.name,
      item.size,
      item.lastModified,
      item.caption,
      item.photoLayout,
    ]),
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
  const { mediaUpload: _mediaUpload, ...safeResult } = result;
  const saved: SavedSecureLetter = { ...safeResult, fingerprint };
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

function mediaDescriptor(media: CapturedMedia[]) {
  return media.map((item) => ({
    id: item.id,
    kind: item.kind,
    name: item.name,
    mimeType: item.mimeType,
    size: item.size,
    caption: item.caption,
    photoLayout: item.photoLayout,
  }));
}

async function createSecureLetter(
  draft: Draft,
  media: CapturedMedia[],
): Promise<SecureLetterResult> {
  const response = await fetch("/api/letters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      senderName: draft.sender,
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
      media: mediaDescriptor(media),
    }),
  });

  const result = await response.json() as Partial<SecureLetterResult> & { error?: string };
  if (!response.ok || !result.recipientUrl || !result.manageToken || !result.opensAt) {
    throw new Error(result.error || "The letter could not be stored securely.");
  }

  return result as SecureLetterResult;
}

function bytesFromBase64(value: string) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function browserStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) throw new Error("Private media storage is not configured.");

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function encryptAndUploadMedia(
  plan: MediaUploadPlan,
  media: CapturedMedia[],
  onProgress: (completed: number, total: number) => void,
) {
  if (!window.crypto?.subtle) {
    throw new Error("This browser cannot encrypt private media. Try a current browser.");
  }

  const rawKey = bytesFromBase64(plan.key);
  const encryptionKey = await window.crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  const storage = browserStorageClient().storage.from(MEDIA_BUCKET);
  let completed = 0;

  for (const target of plan.items) {
    const source = media.find((item) => item.id === target.id);
    if (!source || !target.token) throw new Error("A selected media item is no longer available.");

    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: bytesFromBase64(target.iv) },
      encryptionKey,
      await source.file.arrayBuffer(),
    );
    const encryptedBlob = new Blob([encrypted], { type: "application/octet-stream" });
    const { error } = await storage.uploadToSignedUrl(
      target.path,
      target.token,
      encryptedBlob,
      {
        contentType: "application/octet-stream",
        cacheControl: "0",
      },
    );

    if (error) throw new Error(`Could not upload ${source.name}: ${error.message}`);
    completed += 1;
    onProgress(completed, plan.items.length);
  }
}

async function completeMediaUpload(
  result: SecureLetterResult,
  itemIds: string[],
) {
  const response = await fetch("/api/letters/media/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      manageToken: result.manageToken,
      recipientUrl: result.recipientUrl,
      itemIds,
    }),
  });
  const completion = await response.json() as {
    error?: string;
    mediaReady?: boolean;
    mediaCount?: number;
    emailDelivery?: EmailDelivery;
  };

  if (!response.ok || !completion.mediaReady) {
    throw new Error(completion.error || "The encrypted media could not be completed.");
  }

  result.mediaReady = true;
  result.mediaCount = completion.mediaCount || itemIds.length;
  result.emailDelivery = completion.emailDelivery;
  result.mediaUpload = null;
  return result;
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
    let pendingResult: SecureLetterResult | null = null;
    let pendingMedia: CapturedMedia[] = [];
    let pendingFingerprint = "";

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
          const deliveryMessage = secureResult?.emailDelivery?.message;
          const mediaMessage = secureResult?.mediaReady
            ? `${secureResult.mediaCount || 0} media item${secureResult.mediaCount === 1 ? "" : "s"} encrypted and stored privately.`
            : "Your letter text is encrypted behind a private token.";
          note.textContent = deliveryMessage
            ? `${deliveryMessage} ${mediaMessage}`
            : mediaMessage;
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

    const finishMediaAndOpen = async (
      result: SecureLetterResult,
      media: CapturedMedia[],
      fingerprint: string,
      button: HTMLButtonElement,
    ) => {
      if (result.mediaUpload?.items.length) {
        pendingResult = result;
        pendingMedia = media;
        pendingFingerprint = fingerprint;
        button.textContent = `Encrypting media 0 of ${result.mediaUpload.items.length}…`;

        await encryptAndUploadMedia(result.mediaUpload, media, (completed, total) => {
          button.textContent = `Encrypting media ${completed} of ${total}…`;
        });
        button.textContent = "Confirming private media…";
        await completeMediaUpload(result, result.mediaUpload.items.map((item) => item.id));
      }

      pendingResult = null;
      pendingMedia = [];
      pendingFingerprint = "";
      secureUrl = result.recipientUrl;
      secureResult = result;
      saveSecureLetter(result, fingerprint);
      openShareStep(button);
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
        const media = getCapturedMedia();
        const fingerprint = draftFingerprint(draft, media);
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
          const result = await createSecureLetter(draft, media);
          await finishMediaAndOpen(result, media, fingerprint, button);
        } catch (error) {
          const message = error instanceof Error ? error.message : "The letter could not be stored securely.";
          showCreationError(message);
          button.disabled = false;
          button.textContent = pendingResult ? "Retry encrypted media upload" : "Try secure posting again";
        } finally {
          creating = false;
        }
        return;
      }

      if (label === "Retry encrypted media upload" && pendingResult) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (creating) return;
        creating = true;
        button.disabled = true;
        clearCreationError();
        try {
          await finishMediaAndOpen(pendingResult, pendingMedia, pendingFingerprint, button);
        } catch (error) {
          const message = error instanceof Error ? error.message : "The encrypted media could not be uploaded.";
          showCreationError(message);
          button.disabled = false;
          button.textContent = "Retry encrypted media upload";
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
