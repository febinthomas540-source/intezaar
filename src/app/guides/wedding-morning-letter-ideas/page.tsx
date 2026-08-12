import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "Wedding Morning Letter Ideas",
  description: "What to write in a wedding-morning letter for your partner, with prompts for memories, promises and the moment before the ceremony begins.",
  alternates: { canonical: "/guides/wedding-morning-letter-ideas" },
  keywords: ["wedding morning letter ideas", "letter to bride on wedding morning", "letter to groom on wedding morning", "wedding day letter to partner"],
};

export default function WeddingMorningLetterGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · Wedding morning"
      title="What to write in a letter for the morning of your wedding."
      intro="A wedding-day letter does not need to sound ceremonial. It should sound like the person your partner already knows — only a little more deliberate because of when they are reading it."
      ctaLabel="Write a wedding letter"
      ctaHref="/create?occasion=Wedding"
      showReflectionNote={false}
      relatedLinks={[
        { href: "/guides/meaningful-letter-ideas-for-partner", label: "Meaningful letter ideas for your partner" },
        { href: "/guides/birthday-letter-long-distance-relationship", label: "Long-distance birthday letter ideas" },
      ]}
      sections={[
        {
          title: "Write to the person, not the event",
          paragraphs: [
            "The wedding is the setting, but your partner is the subject. Start with something you recognise about them: how they might be feeling that morning, the expression you expect to see later, or the small habit that has followed you through the relationship.",
            "That immediately makes the letter feel private rather than like a speech that could belong to any couple.",
          ],
        },
        {
          title: "Choose one memory from before the wedding existed",
          paragraphs: [
            "Go back to a moment when marriage was not yet the obvious destination. It might be the first time you realised you trusted them, the day they quietly showed up for you, or an ordinary evening that later became important in hindsight.",
          ],
          bullets: [
            "The first detail you noticed about them.",
            "A moment when the relationship became serious without anyone announcing it.",
            "A difficult period you are proud you came through together.",
            "An ordinary memory you hope marriage never makes you take for granted.",
          ],
        },
        {
          title: "Make promises small enough to keep",
          paragraphs: [
            "Big vows belong naturally to a wedding, but a private letter can hold smaller promises: how you want to behave on bad days, what you want to protect in the relationship, and the ordinary things you want to keep choosing.",
            "Specific promises are more moving than grand ones because your partner can imagine living inside them.",
          ],
        },
        {
          title: "End at the exact moment ahead",
          paragraphs: [
            "Bring the letter back to today. Tell them what you are looking forward to in the next few hours: seeing them, hearing their voice, holding their hand, or finally having a quiet moment after everyone else goes home.",
            "If you schedule the letter to open that morning, share the private link before the day becomes busy. The timing should add calm, not create another task for either of you.",
          ],
        },
      ]}
    />
  );
}
