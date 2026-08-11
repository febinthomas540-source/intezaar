import type { Metadata } from "next";
import { IntentLanding } from "@/components/intent-landing";

export const metadata: Metadata = {
  title: "Open When Letters",
  description: "Create a private open-when letter for someone you care about and choose the moment it can be opened with Intezaar.",
  alternates: { canonical: "/open-when" },
  keywords: ["open when letters", "open when letter ideas", "open when you miss me", "letters for hard days"],
};

export default function OpenWhenPage() {
  return (
    <IntentLanding
      eyebrow="Open when…"
      title="Write a letter for a moment they have not reached yet."
      intro="For the day they miss you, doubt themselves, celebrate something huge or simply need to hear your voice in words."
      primaryLabel="Write an open-when letter"
      examplesTitle="A few moments worth writing for"
      examples={[
        "Open when you miss home.",
        "Open when you need reminding that I believe in you.",
        "Open when you finally get the news you have been waiting for.",
        "Open when today feels heavier than usual.",
      ]}
      steps={[
        { title: "Choose the moment", copy: "Start with the feeling or occasion you want the letter to meet." },
        { title: "Write only for that moment", copy: "Keep the letter specific, personal and grounded in what you would want them to hear then." },
        { title: "Seal and share", copy: "Post it privately and share the recipient link so the envelope can wait for its opening time." },
      ]}
      reflectionTitle="Supportive words can wait without pretending to be treatment."
      reflectionCopy="An open-when letter can be a personal gesture of care, encouragement or memory. Intezaar keeps that gesture private and timed, without making clinical claims about what the letter will do."
      related={[
        { href: "/future-self", title: "Future-self letter", copy: "Leave something for your own future moment." },
        { href: "/write-after-argument", title: "Write after an argument", copy: "Create some distance before you decide to send." },
        { href: "/guides/open-when-letter-ideas", title: "Open-when letter ideas", copy: "A practical list of prompts and occasions." },
      ]}
    />
  );
}
