import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "How to Write a Letter to Your Parents While Living Abroad",
  description: "Ideas for writing a meaningful letter to your parents while living abroad, including gratitude, ordinary memories and what distance has made you notice.",
  alternates: { canonical: "/guides/letter-to-parents-while-living-abroad" },
  keywords: ["letter to parents living abroad", "letter to parents from abroad", "what to write to parents when living away", "emotional letter to parents"],
};

export default function LetterToParentsAbroadGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · Living abroad"
      title="A letter to your parents when life has taken you far from home."
      intro="Distance changes what you notice. Things that once felt ordinary can become the details you miss most. A letter is a good place to say those things without waiting for the perfect phone call."
      ctaLabel="Write a letter home"
      ctaHref="/create"
      showReflectionNote={false}
      relatedLinks={[
        { href: "/guides/onam-letter-for-family-abroad", label: "Onam letter ideas for family" },
        { href: "/guides/open-when-you-miss-home-letter", label: "Open when you miss home" },
      ]}
      sections={[
        {
          title: "Do not start with gratitude as an obligation",
          paragraphs: [
            "A letter to parents does not need to begin with a grand thank-you. Start with something current: what made you think of home this week, a habit you have inherited from them, or a moment abroad when you suddenly understood something they used to say.",
            "That gives the gratitude a real reason to appear rather than making the letter sound ceremonial.",
          ],
        },
        {
          title: "Name the ordinary things distance changed",
          paragraphs: [
            "You may miss things you barely noticed while you lived at home. Mention them. The sound of someone moving around early in the morning, food appearing without discussion, being asked where you are going, or sitting together without needing an activity can carry more emotional weight than abstract statements about family.",
          ],
          bullets: [
            "A routine you used to take for granted.",
            "A piece of advice that makes more sense now.",
            "Something about your parents you recognise in yourself.",
            "A small thing you wish you had thanked them for earlier.",
          ],
        },
        {
          title: "Tell them about the life they cannot see",
          paragraphs: [
            "Parents often receive edited updates: work is fine, food is fine, everything is fine. A letter can hold the quieter version. Describe what your week actually feels like, what you are learning, what has become easier, and what still feels unfamiliar.",
            "You do not have to turn the letter into a confession. One or two honest details can make the distance feel smaller.",
          ],
        },
        {
          title: "End with the next ordinary moment together",
          paragraphs: [
            "Instead of ending only with ‘I miss you,’ name what you want to do the next time you are home: sit in the kitchen, go on the familiar drive, eat something specific, visit someone together, or simply have tea without looking at the clock.",
            "That future ordinary moment gives the letter somewhere to land.",
          ],
        },
      ]}
    />
  );
}
