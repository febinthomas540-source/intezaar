"use client";

import { CreatorMediaBridge } from "@/components/creator-media-bridge";
import { CreatorShareBridge } from "@/components/creator-share-bridge";
import { MediaUploadLimitGuard } from "@/components/media-upload-limit-guard";
import { StableLetterCreator } from "@/components/stable-letter-creator";
import { TurnstilePostingGuard } from "@/components/turnstile-posting-guard";
import "../photo-adjustment.css";
import "../seal-post.css";
import "../mobile-creator-polish.css";
import "../turnstile-posting.css";
import "../registered-delivery.css";
import "../delivery-presets.css";

export default function CreatePage() {
  return (
    <>
      <StableLetterCreator />
      <MediaUploadLimitGuard />
      <CreatorMediaBridge />
      <CreatorShareBridge />
      <TurnstilePostingGuard />
    </>
  );
}
