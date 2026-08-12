"use client";

import { useEffect } from "react";
import { readE2EEKeyFromHash } from "@/lib/letter-e2ee";

const STORAGE_PREFIX = "intezaar:recipient-link-key:v1:";
const MAX_KEY_AGE_MS = 125 * 24 * 60 * 60 * 1000;

type SavedKey = {
  key: string;
  savedAt: number;
};

function recipientTokenFromPath(pathname: string) {
  const match = pathname.match(/^\/receive\/([A-Za-z0-9_-]{40,60})\/?$/);
  return match?.[1] || "";
}

function readSavedKey(storageKey: string) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Partial<SavedKey>;
    const key = typeof saved.key === "string" ? saved.key : "";
    const savedAt = typeof saved.savedAt === "number" ? saved.savedAt : Number.NaN;
    const validKey = readE2EEKeyFromHash(`#k=${key}`);

    if (!validKey || !Number.isFinite(savedAt) || Date.now() - savedAt > MAX_KEY_AGE_MS) {
      window.localStorage.removeItem(storageKey);
      return null;
    }

    return validKey;
  } catch {
    return null;
  }
}

export function RecipientLinkRecovery() {
  useEffect(() => {
    const token = recipientTokenFromPath(window.location.pathname);
    if (!token) return;

    const storageKey = `${STORAGE_PREFIX}${token}`;
    const currentKey = readE2EEKeyFromHash();

    if (currentKey) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({
          key: currentKey,
          savedAt: Date.now(),
        } satisfies SavedKey));
      } catch {
        // Link recovery is a convenience only; the complete private link still works.
      }
      return;
    }

    const savedKey = readSavedKey(storageKey);
    if (!savedKey) return;

    // URL fragments are browser-only and are not sent in the HTTP request.
    // Restoring the saved key here lets a keyless email reminder return to the
    // same encrypted letter on a browser that has already received the full link.
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    hash.set("k", savedKey);
    window.location.replace(`${window.location.pathname}${window.location.search}#${hash.toString()}`);
  }, []);

  return null;
}
