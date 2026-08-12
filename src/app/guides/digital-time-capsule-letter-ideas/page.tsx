import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "Digital Time Capsule Letter Ideas",
  description: "Ideas for creating a digital time capsule letter with memories, predictions, photos and questions for a future milestone.",
  alternates: { canonical: "/guides/digital-time-capsule-letter-ideas" },
  keywords: ["digital time capsule ideas", "time capsule letter ideas", "what to put in a digital time capsule", "future letter time capsule"],
};

export default function DigitalTimeCapsuleGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · Digital time capsule"
      title="What to put in a digital time capsule letter."
      intro="A useful time capsule preserves the ordinary present, not just major achievements. The things that feel too normal to record today are often exactly what becomes interesting later."
      ctaLabel="Create a time-capsule letter"
      ctaHref="/create"
      showReflectionNote={false}
      relatedLinks={[
        { href: "/guides/letter-to-future-self-ideas", label: "Letter to your future self ideas" },
        { href: "/future-self", label: "Write directly to your future self" },
      ]}
      sections={[
        {
          title: "Record what an ordinary day looks like",
          paragraphs: [
            "Start with details you assume you will remember: where you live, what your room looks like, what you eat often, who you speak to most, the journey you make every week, and what currently takes up too much space in your mind.",
            "Major milestones will already leave records. Ordinary life is what disappears quietly.",
          ],
        },
        {
          title: "Include predictions you are willing to get wrong",
          paragraphs: [
            "Predictions make a time capsule playful because future you gets to compare expectation with reality. Avoid trying to sound profound. Guess what will change in your work, relationships, routines, technology, neighbourhood or personal priorities.",
          ],
          bullets: [
            "Where do I think I will be living?",
            "Who do I expect will still be part of my weekly life?",
            "What problem feels enormous now that may become irrelevant?",
            "What habit do I think I will finally have changed?",
            "What am I convinced I will never change my mind about?",
          ],
        },
        {
          title: "Add evidence of the present",
          paragraphs: [
            "One photograph, a short voice note or a small piece of video can carry details that text misses: your voice, the background noise in a room, the way people look before a life change, or a place that may not look the same later.",
            "Choose media for documentary value rather than quantity. A time capsule becomes stronger when every item has a reason to be there.",
          ],
        },
        {
          title: "Ask questions instead of only giving advice",
          paragraphs: [
            "Future letters often become lectures to a person who does not exist yet. Questions are usually more interesting: Did this work out? Are you still afraid of that? Did you stay close to this person? What mattered less than expected? What did I misunderstand?",
            "The gap between those questions and the future answers is the real time capsule.",
          ],
        },
      ]}
    />
  );
}
