import type { Metadata } from "next";
import { FutureSelfCreator } from "@/components/future-self-creator";
import { TurnstilePostingGuard } from "@/components/turnstile-posting-guard";

export const metadata: Metadata = {
  title: "Write to Future Me",
  description: "Write a private letter to a later version of yourself, choose when it can be opened, seal it and let it wait.",
  robots: { index: false, follow: false },
};

export default function FutureSelfWritePage() {
  return (
    <>
      <FutureSelfCreator />
      <TurnstilePostingGuard />
    </>
  );
}
