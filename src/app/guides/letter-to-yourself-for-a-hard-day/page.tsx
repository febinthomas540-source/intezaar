import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "Write a Letter to Yourself for a Hard Day",
  description: "Gentle prompts for writing a private letter to yourself for a difficult day, without turning reflective writing into therapy or medical advice.",
  alternates: { canonical: "/guides/letter-to-yourself-for-a-hard-day" },
  keywords: ["letter to myself for a hard day", "write a letter to myself", "letter to future me difficult day", "self reflection letter prompts"],
};

export default function HardDayLetterGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · A letter to yourself"
      title="Write something for a day when you may need your own voice."
      intro="A letter for a hard day does not need to fix anything. It can simply preserve perspective, memory and kindness from a steadier moment."
      ctaLabel="Write to future me"
      ctaHref="/future-self/write"
      sections={[
        {
          title: "Write from a day when you can see more clearly",
          paragraphs: [
            "The useful contrast is between the moment you write and the moment you eventually read. Write down what you know when things feel more ordinary, especially the truths you tend to forget when a day becomes difficult.",
          ],
          bullets: [
            "What usually passes, even when it feels permanent in the moment?",
            "Who can I contact when I do not want to be alone with my thoughts?",
            "What small routine tends to make the next hour easier?",
            "What would I want a close friend to remind me of?",
          ],
        },
        {
          title: "Use your normal voice",
          paragraphs: [
            "You do not need inspirational language. A sentence that sounds recognisably like you can feel more believable later than a paragraph of generic encouragement.",
          ],
        },
        {
          title: "Include something concrete",
          paragraphs: [
            "Mention a place you like, a person you trust, a meal, a walk, a song, a photograph or a small plan. Concrete details can make the letter feel anchored in your actual life rather than in abstract advice.",
          ],
        },
        {
          title: "Keep the purpose modest",
          paragraphs: [
            "This kind of letter is reflective writing, not treatment or crisis support. If a future moment involves immediate danger, urgent medical concerns or a risk of harm, use appropriate real-time support rather than relying on a scheduled letter.",
          ],
        },
      ]}
    />
  );
}
