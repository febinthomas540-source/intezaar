import type { Metadata } from "next";
import { IntentLanding } from "@/components/intent-landing";

export const metadata: Metadata = {
  title: "Write a Letter to Your Future Self",
  description: "Write a private letter to your future self, choose when it can be opened, seal it and let the moment arrive later with Intezaar.",
  alternates: { canonical: "/future-self" },
  keywords: ["write a letter to my future self", "future self letter", "letter to future me", "write to future self"],
};

export default function FutureSelfPage() {
  return (
    <IntentLanding
      eyebrow="A letter to future you"
      title="Write something your future self should hear."
      intro="A thought, a promise, a memory, a question. Write it while it belongs to today, then leave it sealed for a later version of you."
      primaryLabel="Write to future me"
      primaryHref="/future-self/write"
      examplesTitle="What could you leave for future you?"
      examples={[
        "What do I hope I will remember about this season of my life?",
        "What am I afraid of today — and what do I hope changed?",
        "What would make me proud when I read this later?",
        "What small detail about today do I never want to forget?",
      ]}
      steps={[
        { title: "Write from today", copy: "Use the dedicated Future Me studio: your name, your reason, your words, and a few prompts if you need a beginning." },
        { title: "Choose a later moment", copy: "Pick when the letter should come back to you. During public beta, Future Me letters can wait for up to 30 days." },
        { title: "Seal it for yourself", copy: "The Future Me studio uses its own night-and-time-capsule theme, then posts through the same private Intezaar letter system." },
      ]}
      reflectionTitle="Reflection does not have to be a journal habit."
      reflectionCopy="Sometimes one letter is enough. Future-self writing can simply be a way to notice what you are carrying now and give those words somewhere to wait."
      related={[
        { href: "/open-when", title: "Open when…", copy: "Write for a particular future feeling or moment." },
        { href: "/unsent-letter", title: "Private unsent letter", copy: "Write something before deciding whether it should be sent." },
        { href: "/guides/letter-to-future-self-ideas", title: "Future-self writing ideas", copy: "Prompts for when the blank page feels difficult." },
      ]}
    />
  );
}
