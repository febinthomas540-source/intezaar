import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "Open When Letter Ideas",
  description: "Meaningful open-when letter ideas for partners, friends and family, with prompts for difficult days, milestones and everyday moments.",
  alternates: { canonical: "/guides/open-when-letter-ideas" },
  keywords: ["open when letter ideas", "open when letters for boyfriend", "open when letters for girlfriend", "open when you miss me letter"],
};

export default function OpenWhenIdeasGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · Open-when letters"
      title="Open-when letter ideas that feel personal, not generic."
      intro="The best open-when letters are written for a specific emotional moment. The more clearly you picture that moment, the more personal the letter becomes."
      ctaLabel="Write an open-when letter"
      ctaHref="/open-when"
      relatedLinks={[
        { href: "/guides/open-when-you-miss-home-letter", label: "Open when you miss home" },
        { href: "/guides/meaningful-letter-ideas-for-partner", label: "Meaningful letter ideas for a partner" },
      ]}
      sections={[
        {
          title: "For difficult days",
          paragraphs: [
            "These letters work best when they do not try to solve everything. Write the kind of message you would want to leave beside someone: specific, warm and grounded in what you know about them.",
          ],
          bullets: [
            "Open when you feel alone.",
            "Open when you are doubting yourself.",
            "Open when today has been exhausting.",
            "Open when you miss home.",
            "Open when you need to hear something kind from me.",
          ],
        },
        {
          title: "For milestones",
          paragraphs: [
            "A future milestone gives the letter a built-in sense of anticipation. Write before the event happens, when you can only imagine how the recipient may feel when they finally reach it.",
          ],
          bullets: [
            "Open after your first day at the new job.",
            "Open when you graduate.",
            "Open when you move into your new place.",
            "Open when you finally get the answer you have been waiting for.",
            "Open on your next birthday.",
          ],
        },
        {
          title: "For relationships and distance",
          paragraphs: [
            "When someone is far away, a timed letter can carry more intention than another instant message. Mention shared memories, private jokes and the small details that make the relationship recognisable.",
          ],
          bullets: [
            "Open when you miss me.",
            "Open when you cannot sleep.",
            "Open when we have had a difficult week.",
            "Open when you need reminding why I chose you.",
          ],
        },
        {
          title: "What to put inside",
          paragraphs: [
            "Start with one sentence that names the moment: ‘If you are opening this, I imagine today feels…’. Then add something only you could say — a memory, a reassurance, a photograph, or one promise you genuinely mean.",
            "Keep the letter smaller than the feeling. You do not need to explain the whole relationship. You are writing for one future moment, not every possible one.",
          ],
        },
      ]}
    />
  );
}
