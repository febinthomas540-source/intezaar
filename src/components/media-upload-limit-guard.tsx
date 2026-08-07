"use client";

import { useEffect } from "react";

const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

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

export function MediaUploadLimitGuard() {
  useEffect(() => {
    const handleChange = (event: Event) => {
      const input = event.target instanceof HTMLInputElement ? event.target : null;
      if (!input || input.type !== "file" || !input.accept.includes("video")) return;

      const file = input.files?.[0];
      if (!file) return;

      if (file.size > MAX_VIDEO_BYTES) {
        event.preventDefault();
        event.stopImmediatePropagation();
        input.value = "";
        showMediaError("The video must be 25 MB or smaller.");
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
