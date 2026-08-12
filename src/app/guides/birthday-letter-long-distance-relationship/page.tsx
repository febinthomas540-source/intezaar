import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "Birthday Letter Ideas for a Long-Distance Relationship",
  description: "What to write in a birthday letter for a long-distance boyfriend, girlfriend or partner, with prompts that feel personal instead of generic.",
  alternates: { canonical: "/guides/birthday-letter-long-distance-relationship" },
  keywords: ["birthday letter long distance relationship", "birthday letter for boyfriend long distance", "birthday letter for girlfriend long distance", "long distance birthday message ideas"],
};

export default function LongDistanceBirthdayGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · Long-distance birthday"
      title="A birthday letter for the person you cannot be beside."
      intro="Distance makes birthday messages easy to overcompensate for. The strongest letter is usually not the longest one — it is the one full of details that could only have come from you."
      ctaLabel="Write a birthday letter"
      ctaHref="/create?occasion=Birthday"
      showReflectionNote={false}
      relatedLinks={[
        { href: "/guides/meaningful-letter-ideas-for-partner", label: "Meaningful letter ideas for a partner" },
        { href: "/guides/open-when-you-miss-home-letter", label: "Open when you miss home" },
      ]}
      sections={[
        {
          title: "Begin with the distance, then move past it",
          paragraphs: [
            "It is okay to say that you wish you were there. Say it once, sincerely, then let the rest of the letter be about them rather than the miles between you.",
            "A useful opening names the birthday itself: what you imagine they are doing when they read the letter, what you hope the morning feels like, or the tiny ritual you would have shared if you were together.",
          ],
        },
        {
          title: "Write about the year they have actually lived",
          paragraphs: [
            "Birthday letters become memorable when they notice growth. Think about what changed for your partner over the past year: a new job, a hard decision, a habit they built, a fear they faced, or something ordinary they kept doing even when nobody applauded it.",
          ],
          bullets: [
            "One thing you are proud of them for.",
            "One moment this year when they surprised you.",
            "One quality you appreciate more now than a year ago.",
            "One thing you hope becomes easier for them in the year ahead.",
          ],
        },
        {
          title: "Add a memory with texture",
          paragraphs: [
            "Instead of saying ‘I miss our memories,’ choose one. Mention the place, what happened, what they said, and why it still returns to you. The more ordinary the detail, the more believable the affection often feels.",
            "A photo or short voice note can work well here, especially if it adds something the written letter cannot. Media should support the letter rather than replace it.",
          ],
        },
        {
          title: "Give them something to look forward to",
          paragraphs: [
            "End in the future tense. Name the next meal, airport arrival, lazy Sunday, trip or simple ordinary day you want to have together. A long-distance birthday letter should not only look backward — it should make the relationship feel like it is still moving toward something.",
            "If you want the letter to feel tied to the birthday itself, choose the opening time carefully and send the private link ahead of time so the wait becomes part of the gift.",
          ],
        },
      ]}
    />
  );
}
