"use client";

import { CreatorMediaBridge } from "@/components/creator-media-bridge";
import { CreatorShareBridge } from "@/components/creator-share-bridge";
import { LetterCreator } from "@/components/letter-creator";
import { MediaUploadLimitGuard } from "@/components/media-upload-limit-guard";
import { RegisteredDeliveryCreatorNote } from "@/components/registered-delivery-creator-note";
import { ShortLetterUnlock } from "@/components/short-letter-unlock";
import { SpeedPostArrivalBridge } from "@/components/speed-post-arrival-bridge";
import { TurnstilePostingGuard } from "@/components/turnstile-posting-guard";
import "../photo-adjustment.css";
import "../seal-post.css";
import "../mobile-creator-polish.css";
import "../turnstile-posting.css";
import "../registered-delivery.css";
import "../speed-post.css";

export default function CreatePage() {
  return (
    <>
      <LetterCreator />
      <ShortLetterUnlock />
      <MediaUploadLimitGuard />
      <CreatorMediaBridge />
      <CreatorShareBridge />
      <RegisteredDeliveryCreatorNote />
      <SpeedPostArrivalBridge />
      <TurnstilePostingGuard />
    </>
  );
}
