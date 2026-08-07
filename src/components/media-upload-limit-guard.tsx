"use client";

import { useEffect } from "react";
import { getCapturedMedia, type CapturedMediaKind } from "@/components/creator-media-bridge";
import {
  MAX_MEDIA_ITEMS,
  MAX_TOTAL_MEDIA_BYTES,
  MEDIA_LIMIT_BYTES,
  mediaLimitLabel,
} from "@/lib/letter-rules";

function mediaKind(input: HTMLInputElement): CapturedMediaKind | null {
  if (input.accept.includes("image")) return "photo";
  if (input.accept.includes("audio")) return "voice";
  if (input.accept.includes("video")) return "video";
  return null;
}

function kindLabel(kind: CapturedMediaKind) {
  if (kind === "photo") return "photo";
  if (kind === "voice") return "voice note";
  return "video";
}

function validMime(kind: CapturedMediaKind, type: string) {
  if (!type) return false;
  if (kind === "photo") return type.startsWith("image/");
  if (kind === "voice") return type.startsWith("audio/");
  return type.startsWith("video/");
}

function showMediaError(message: string) {
  const studio = document.querySelector<HTMLElement>(".compact-media-studio");
  if (!studio) return;

  let error = studio.querySelector<HTMLElement>("[data-media-limit-error='true']");
  if (!error) {
    error = document.createElement("p");
    error.className = "media-error";
    error.dataset.mediaLimitError = "true";
    error.setAttribute("role", "alert");
    studio.querySelector(".media-choice-row")?.after(error);
  }
  error.textContent = message;
}

function clearMediaError() {
  document.querySelector("[data-media-limit-error='true']")?.remove();
}

function rejectSelection(event: Event, input: HTMLInputElement, message: string) {
  event.preventDefault();
  event.stopImmediatePropagation();
  input.value = "";
  showMediaError(message);
}

export function MediaUploadLimitGuard() {
  useEffect(() => {
    const handleChange = (event: Event) => {
      const input = event.target instanceof HTMLInputElement ? event.target : null;
      if (!input || input.type !== "file") return;

      const kind = mediaKind(input);
      if (!kind) return;

      const files = Array.from(input.files || []);
      if (!files.length) return;

      const existing = getCapturedMedia();
      const slotsLeft = Math.max(0, MAX_MEDIA_ITEMS - existing.length);
      const selected = files.slice(0, kind === "video" ? Math.min(1, slotsLeft) : slotsLeft);
      if (!selected.length) return;

      const wrongType = selected.find((file) => !validMime(kind, file.type));
      if (wrongType) {
        rejectSelection(event, input, `Choose a valid ${kindLabel(kind)} file.`);
        return;
      }

      const limit = MEDIA_LIMIT_BYTES[kind];
      const oversized = selected.find((file) => file.size > limit);
      if (oversized) {
        rejectSelection(
          event,
          input,
          `The ${kindLabel(kind)} must be ${mediaLimitLabel(kind)} or smaller.`,
        );
        return;
      }

      const existingBytes = existing.reduce((total, item) => total + item.size, 0);
      const selectedBytes = selected.reduce((total, file) => total + file.size, 0);
      if (existingBytes + selectedBytes > MAX_TOTAL_MEDIA_BYTES) {
        rejectSelection(
          event,
          input,
          "Private media can be no more than 30 MB in total per letter.",
        );
        return;
      }

      clearMediaError();
    };

    document.addEventListener("change", handleChange, true);
    return () => {
      document.removeEventListener("change", handleChange, true);
      clearMediaError();
    };
  }, []);

  return null;
}
