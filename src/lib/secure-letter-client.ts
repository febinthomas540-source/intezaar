"use client";

import { createClient } from "@supabase/supabase-js";
import type { LetterFormat, PhotoPatch } from "@/components/letter-preview";
import { MAX_DELIVERY_MS, MIN_DELIVERY_MS } from "@/lib/letter-rules";

const POSTED_KEY = "intezaar:last-secure-letter:v1";
const DRAFT_KEY = "intezaar:create-draft:v3";
const LEGACY_CONTACT_KEY = "intezaar:create-contacts:v1";
const MEDIA_BUCKET = "letter-media";

export type SecureDraft = {
  sender: string;
  recipient: string;
  recipientEmail: string;
  occasion: string;
  heading: string;
  letter: string;
  closing: string;
  format: LetterFormat;
  fromCity: string;
  toCity: string;
  arrivalDate: string;
  arrivalTime: string;
};

export type SecureMediaItem = {
  id: string;
  kind: "photo" | "voice" | "video";
  file: File;
  name: string;
  mimeType: string;
  size: number;
  lastModified: number;
  caption: string;
  photoLayout?: PhotoPatch & {
    fit: "cover" | "contain";
    zoom: number;
    cropX: number;
    cropY: number;
    x: number;
    y: number;
    width: number;
    aspectRatio: number;
    zIndex: number;
  };
};

export type EmailDelivery = {
  attempted: boolean;
  sent: boolean;
  recipient?: string;
  message: string;
  emailId?: string;
};

export type MediaUploadPlan = {
  key: string;
  items: Array<{
    id: string;
    path: string;
    iv: string;
    token: string;
  }>;
};

export type SecureLetterResult = {
  recipientUrl: string;
  manageToken: string;
  opensAt: string;
  emailDelivery?: EmailDelivery;
  mediaUpload?: MediaUploadPlan | null;
  mediaReady?: boolean;
  mediaCount?: number;
};

export type SavedSecureLetter = Omit<SecureLetterResult, "mediaUpload"> & {
  fingerprint: string;
};

export function draftFingerprint(draft: SecureDraft, media: SecureMediaItem[]) {
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

export function readSavedLetter(fingerprint: string): SavedSecureLetter | null {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(POSTED_KEY) || "null") as SavedSecureLetter | null;
    return saved?.fingerprint === fingerprint ? saved : null;
  } catch {
    return null;
  }
}

export function saveSecureLetter(result: SecureLetterResult, fingerprint: string) {
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

    // Once the encrypted letter has been stored successfully, do not leave the
    // plaintext draft or recipient email sitting in persistent browser storage.
    window.localStorage.removeItem(DRAFT_KEY);
    window.localStorage.removeItem(LEGACY_CONTACT_KEY);
  } catch {
    // The private recipient URL still works when browser storage is unavailable.
  }
}

function createOpensAt(draft: SecureDraft) {
  const localMoment = new Date(`${draft.arrivalDate}T${draft.arrivalTime}:00`);
  if (!draft.arrivalDate || !Number.isFinite(localMoment.getTime())) {
    throw new Error("Choose a valid arrival date and time before posting.");
  }

  const now = Date.now();
  if (localMoment.getTime() < now + MIN_DELIVERY_MS) {
    throw new Error("The arrival time is now too close. Go back to Arrival and choose a time at least 12 hours from now.");
  }
  if (localMoment.getTime() > now + MAX_DELIVERY_MS) {
    throw new Error("The arrival time is now outside the 30-day window. Go back to Arrival and choose a nearer date.");
  }

  return localMoment.toISOString();
}

function mediaDescriptor(media: SecureMediaItem[]) {
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

export async function createSecureLetter(
  draft: SecureDraft,
  media: SecureMediaItem[],
): Promise<SecureLetterResult> {
  const opensAt = createOpensAt(draft);
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
      opensAt,
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

export async function encryptAndUploadMedia(
  plan: MediaUploadPlan,
  media: SecureMediaItem[],
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

export async function completeMediaUpload(
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

  return {
    ...result,
    mediaReady: true,
    mediaCount: completion.mediaCount || itemIds.length,
    emailDelivery: completion.emailDelivery,
    mediaUpload: null,
  } satisfies SecureLetterResult;
}
