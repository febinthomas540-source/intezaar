"use client";

import { LetterCreator } from "@/components/letter-creator";
import { ShortLetterUnlock } from "@/components/short-letter-unlock";
import "../photo-adjustment.css";
import "../seal-post.css";

export default function CreatePage() {
  return (
    <>
      <LetterCreator />
      <ShortLetterUnlock />
    </>
  );
}
