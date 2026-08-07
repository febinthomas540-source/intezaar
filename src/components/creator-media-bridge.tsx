"use client";

import { useEffect } from "react";

export type CapturedMediaKind = "photo" | "voice" | "video";

export type CapturedPhotoLayout = {
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

export type CapturedMedia = {
  id: string;
  kind: CapturedMediaKind;
  file: File;
  name: string;
  mimeType: string;
  size: number;
  lastModified: number;
  caption: string;
  photoLayout?: CapturedPhotoLayout;
};

type PendingFile = {
  kind: CapturedMediaKind;
  file: File;
};

type MediaRecord = CapturedMedia & {
  objectUrl: string;
};

let latestMedia: CapturedMedia[] = [];

export function getCapturedMedia() {
  return latestMedia.slice();
}

function numberFromPercent(value: string, fallback: number) {
  const parsed = Number.parseFloat(value.replace("%", ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function photoLayout(image: HTMLImageElement): CapturedPhotoLayout {
  const figure = image.closest<HTMLElement>(".free-photo-item");
  const frame = image.closest<HTMLElement>(".free-photo-frame");
  const position = image.style.objectPosition.split(/\s+/);
  const scaleMatch = image.style.transform.match(/scale\(([^)]+)\)/);
  const zIndex = Number.parseFloat(figure?.style.zIndex || "1");
  const aspectRatio = Number.parseFloat(frame?.style.aspectRatio || "1.333333");

  return {
    fit: image.style.objectFit === "contain" ? "contain" : "cover",
    zoom: scaleMatch ? Number.parseFloat(scaleMatch[1]) || 1 : 1,
    cropX: numberFromPercent(position[0] || "50", 50),
    cropY: numberFromPercent(position[1] || "50", 50),
    x: numberFromPercent(figure?.style.left || "50", 50),
    y: numberFromPercent(figure?.style.top || "50", 50),
    width: numberFromPercent(figure?.style.width || "60", 60),
    aspectRatio: Number.isFinite(aspectRatio) ? aspectRatio : 4 / 3,
    zIndex: Number.isFinite(zIndex) ? zIndex : 1,
  };
}

function uniqueBySource<T extends HTMLImageElement | HTMLMediaElement>(elements: T[]) {
  const seen = new Set<string>();
  return elements.filter((element) => {
    const source = element.currentSrc || element.src;
    if (!source.startsWith("blob:") || seen.has(source)) return false;
    seen.add(source);
    return true;
  });
}

function kindFromInput(input: HTMLInputElement): CapturedMediaKind | null {
  if (input.accept.includes("image")) return "photo";
  if (input.accept.includes("audio")) return "voice";
  if (input.accept.includes("video")) return "video";
  return null;
}

export function CreatorMediaBridge() {
  useEffect(() => {
    const pending: PendingFile[] = [];
    const records = new Map<string, MediaRecord>();
    let frame = 0;

    const snapshot = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const personalise = document.querySelector(".creation-personalise-layout");
        if (!personalise) return;

        const photos = uniqueBySource(
          Array.from(document.querySelectorAll<HTMLImageElement>(".free-photo-item img[src^='blob:']")),
        );
        const voices = uniqueBySource(
          Array.from(document.querySelectorAll<HTMLAudioElement>(".media-item-audio audio[src^='blob:']")),
        );
        const videos = uniqueBySource(
          Array.from(document.querySelectorAll<HTMLVideoElement>(".media-item-video video[src^='blob:']")),
        );

        const active: MediaRecord[] = [];

        const assign = (
          kind: CapturedMediaKind,
          element: HTMLImageElement | HTMLMediaElement,
        ) => {
          const objectUrl = element.currentSrc || element.src;
          let record = records.get(objectUrl);

          if (!record) {
            const pendingIndex = pending.findIndex((item) => item.kind === kind);
            if (pendingIndex < 0) return;
            const [{ file }] = pending.splice(pendingIndex, 1);
            record = {
              id: crypto.randomUUID(),
              kind,
              file,
              name: file.name || `${kind}-${Date.now()}`,
              mimeType: file.type || "application/octet-stream",
              size: file.size,
              lastModified: file.lastModified,
              caption: "",
              objectUrl,
            };
            records.set(objectUrl, record);
          }

          if (kind === "photo" && element instanceof HTMLImageElement) {
            const figure = element.closest<HTMLElement>(".free-photo-item");
            record.caption = figure?.querySelector("figcaption")?.textContent?.trim() || "";
            record.photoLayout = photoLayout(element);
          }

          if (kind === "voice") {
            const article = element.closest<HTMLElement>(".media-item-audio");
            record.caption = article?.querySelector<HTMLInputElement>("input")?.value.trim() || "";
          }

          if (kind === "video") {
            const article = element.closest<HTMLElement>(".media-item-video");
            record.caption = article?.querySelector<HTMLInputElement>("input")?.value.trim() || "";
          }

          active.push(record);
        };

        photos.forEach((element) => assign("photo", element));
        voices.forEach((element) => assign("voice", element));
        videos.forEach((element) => assign("video", element));

        const activeUrls = new Set(active.map((item) => item.objectUrl));
        for (const objectUrl of records.keys()) {
          if (!activeUrls.has(objectUrl)) records.delete(objectUrl);
        }

        latestMedia = active.map(({ objectUrl: _objectUrl, ...item }) => item);
      });
    };

    const handleChange = (event: Event) => {
      const input = event.target instanceof HTMLInputElement ? event.target : null;
      if (!input || input.type !== "file") return;
      const kind = kindFromInput(input);
      if (!kind) return;

      Array.from(input.files || []).forEach((file) => pending.push({ kind, file }));
      snapshot();
    };

    const handleInput = (event: Event) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest(".creation-personalise-layout")) snapshot();
    };

    document.addEventListener("change", handleChange, true);
    document.addEventListener("input", handleInput, true);

    const observer = new MutationObserver(snapshot);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "src"],
    });
    snapshot();

    return () => {
      document.removeEventListener("change", handleChange, true);
      document.removeEventListener("input", handleInput, true);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      latestMedia = [];
    };
  }, []);

  return null;
}
