"use client";

import { CreatorShareBridge } from "@/components/creator-share-bridge";
import { LetterCreator } from "@/components/letter-creator";
import { ShortLetterUnlock } from "@/components/short-letter-unlock";
import "../photo-adjustment.css";
import "../seal-post.css";
import "../mobile-creator-polish.css";

export default function CreatePage() {
  return (
    <>
      <LetterCreator />
      <ShortLetterUnlock />
      <CreatorShareBridge />
    </>
  );
}
