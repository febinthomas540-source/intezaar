"use client";

import { useEffect } from "react";

const DRAFT_KEY = "intezaar:create-draft:v3";

type SharePayload = {
  version: 1;
  heading: string;
  message: string;
  closing: string;
};

function encodePayload(payload: SharePayload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function readEnhancedUrl(rawUrl: string) {
  let draft: Record<string, unknown> = {};
  try {
    draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "{}") as Record<string, unknown>;
  } catch {
    draft = {};
  }

  const message = typeof draft.letter === "string" ? draft.letter.trim() : "";
  if (!message) return new URL(rawUrl, window.location.origin).toString();

  const payload: SharePayload = {
    version: 1,
    heading: typeof draft.heading === "string" ? draft.heading.trim() : "",
    message,
    closing: typeof draft.closing === "string" ? draft.closing.trim() : "",
  };

  const url = new URL(rawUrl, window.location.origin);
  url.hash = `letter=${encodePayload(payload)}`;
  return url.toString();
}

export function CreatorShareBridge() {
  useEffect(() => {
    let frame = 0;

    const syncLinks = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const code = document.querySelector<HTMLElement>(".share-link-box code");
        if (code?.textContent?.trim()) {
          const enhanced = readEnhancedUrl(code.textContent.trim());
          if (code.textContent !== enhanced) code.textContent = enhanced;
        }

        document.querySelectorAll<HTMLAnchorElement>('a[href*="/receive/demo"]').forEach((anchor) => {
          const current = anchor.getAttribute("href");
          if (!current) return;
          const enhanced = readEnhancedUrl(current);
          if (anchor.href !== enhanced) anchor.href = enhanced;
        });
      });
    };

    const handleClick = async (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest<HTMLButtonElement>("button");
      if (!button) return;

      const copyButton = button.closest(".share-link-box") && button.textContent?.trim().toLowerCase().includes("copy");
      const shareButton = button.textContent?.trim() === "Share letter link";
      if (!copyButton && !shareButton) return;

      const code = document.querySelector<HTMLElement>(".share-link-box code");
      const rawUrl = code?.textContent?.trim();
      if (!rawUrl) return;
      const enhancedUrl = readEnhancedUrl(rawUrl);

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (shareButton && navigator.share) {
        try {
          await navigator.share({
            title: "A private Intezaar letter",
            text: "A private letter has been posted for you.",
            url: enhancedUrl,
          });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }

      await navigator.clipboard?.writeText(enhancedUrl);
      const previous = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = previous;
      }, 1600);
    };

    document.addEventListener("click", handleClick, true);
    const observer = new MutationObserver(syncLinks);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    syncLinks();

    return () => {
      document.removeEventListener("click", handleClick, true);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
