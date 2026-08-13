"use client";

export type E2EEPhotoLayout = {
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

export type E2EEPrivateMediaItem = {
  id: string;
  kind: "photo" | "voice" | "video";
  name: string;
  mimeType: string;
  size: number;
  caption: string;
  iv: string;
  photoLayout?: E2EEPhotoLayout;
};

export type E2EEPayload = {
  version: 3;
  heading: string;
  message: string;
  closing: string;
  media: E2EEPrivateMediaItem[];
};

export type E2EEEnvelope = {
  version: 3;
  ciphertext: string;
  iv: string;
  authTag: string;
};

type EncryptedResult = {
  envelope: E2EEEnvelope;
  keyBase64: string;
  urlKey: string;
};

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return window.btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function bytesToBase64Url(bytes: Uint8Array) {
  return bytesToBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("The private decryption key is invalid.");
  const standard = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = standard + "=".repeat((4 - (standard.length % 4)) % 4);
  return base64ToBytes(padded);
}

function requiredCrypto() {
  if (!window.crypto?.subtle) {
    throw new Error("This browser cannot provide end-to-end encryption. Try a current browser.");
  }
  return window.crypto;
}

export function randomE2EEIvBase64() {
  const crypto = requiredCrypto();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return bytesToBase64(iv);
}

export function keyBase64FromUrlKey(urlKey: string) {
  const key = base64UrlToBytes(urlKey);
  if (key.length !== 32) throw new Error("The private decryption key is invalid.");
  return bytesToBase64(key);
}

export function readE2EEKeyFromHash(hash = window.location.hash) {
  try {
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    const value = params.get("k")?.trim() || "";
    if (!value) return null;
    return base64UrlToBytes(value).length === 32 ? value : null;
  } catch {
    return null;
  }
}

export async function e2eeOpenProofFromUrlKey(urlKey: string) {
  const crypto = requiredCrypto();
  const rawKey = base64UrlToBytes(urlKey);
  if (rawKey.length !== 32) throw new Error("The private decryption key is invalid.");

  // This is a one-way commitment to the random 256-bit E2EE key, not the key
  // itself. Intezaar stores only this digest so a keyless delivery token cannot
  // forge a successful-decryption/opened receipt later.
  const context = new TextEncoder().encode("intezaar-open-proof-v1:");
  const source = new Uint8Array(context.length + rawKey.length);
  source.set(context, 0);
  source.set(rawKey, context.length);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", source));
  return bytesToBase64Url(digest);
}

function validatePayload(value: unknown): E2EEPayload {
  if (!value || typeof value !== "object") throw new Error("The encrypted letter payload is invalid.");
  const payload = value as Partial<E2EEPayload>;
  if (
    payload.version !== 3 ||
    typeof payload.heading !== "string" ||
    typeof payload.message !== "string" ||
    typeof payload.closing !== "string" ||
    !Array.isArray(payload.media)
  ) {
    throw new Error("The encrypted letter payload is invalid.");
  }

  for (const raw of payload.media) {
    if (!raw || typeof raw !== "object") throw new Error("The encrypted media manifest is invalid.");
    const item = raw as Partial<E2EEPrivateMediaItem>;
    if (
      typeof item.id !== "string" ||
      (item.kind !== "photo" && item.kind !== "voice" && item.kind !== "video") ||
      typeof item.name !== "string" ||
      typeof item.mimeType !== "string" ||
      typeof item.size !== "number" ||
      typeof item.caption !== "string" ||
      typeof item.iv !== "string"
    ) {
      throw new Error("The encrypted media manifest is invalid.");
    }
  }

  return payload as E2EEPayload;
}

export async function encryptE2EEPayload(payload: E2EEPayload): Promise<EncryptedResult> {
  const crypto = requiredCrypto();
  const rawKey = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const sealed = new Uint8Array(await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    plaintext,
  ));

  if (sealed.length < 17) throw new Error("The letter could not be encrypted.");
  const tagStart = sealed.length - 16;

  return {
    envelope: {
      version: 3,
      ciphertext: bytesToBase64(sealed.slice(0, tagStart)),
      iv: bytesToBase64(iv),
      authTag: bytesToBase64(sealed.slice(tagStart)),
    },
    keyBase64: bytesToBase64(rawKey),
    urlKey: bytesToBase64Url(rawKey),
  };
}

export async function decryptE2EEPayload(envelope: E2EEEnvelope, urlKey: string) {
  const crypto = requiredCrypto();
  if (envelope.version !== 3) throw new Error("Unsupported encrypted-letter version.");

  const rawKey = base64UrlToBytes(urlKey);
  const iv = base64ToBytes(envelope.iv);
  const ciphertext = base64ToBytes(envelope.ciphertext);
  const authTag = base64ToBytes(envelope.authTag);
  if (rawKey.length !== 32 || iv.length !== 12 || authTag.length !== 16) {
    throw new Error("The private decryption data is invalid.");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );
  const sealed = new Uint8Array(ciphertext.length + authTag.length);
  sealed.set(ciphertext, 0);
  sealed.set(authTag, ciphertext.length);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    sealed,
  );

  return validatePayload(JSON.parse(new TextDecoder().decode(plaintext)) as unknown);
}
