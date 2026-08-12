import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "Meaningful Letter Ideas for Your Partner",
  description: "Meaningful letter ideas for a boyfriend, girlfriend or partner, with prompts for memories, appreciation, distance and future plans.",
  alternates: { canonical: "/guides/meaningful-letter-ideas-for-partner" },
  keywords: ["meaningful letter ideas for boyfriend", "meaningful letter ideas for girlfriend", "what to write in a love letter", "letter ideas for partner"],
};

export default function MeaningfulPartnerLetterGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · For your partner"
      title="Meaningful letter ideas when ‘I love you’ is not enough."
      intro="A strong relationship letter does not need more adjectives. It needs evidence: moments, habits, changes and small observations that show the recipient exactly what you mean."
      ctaLabel="Write a private letter"
      ctaHref="/create"
      showReflectionNote={false}
      relatedLinks={[
        { href: "/guides/birthday-letter-long-distance-relationship", label: "Long-distance birthday letter ideas" },
        { href: "/guides/wedding-morning-letter-ideas", label: "Wedding-morning letter ideas" },
        { href: "/guides/open-when-letter-ideas", label: "Open When letter ideas" },
      ]}
      sections={[
        {
          title: "Write the proof behind the feeling",
          paragraphs: [
            "Instead of writing ‘you always support me,’ remember a time they supported you when it was inconvenient. Instead of ‘you make me happy,’ describe the ordinary version of happiness they create: a message at the right time, a routine you share, the way they make a difficult place easier to be in.",
            "The evidence makes the affection believable because nobody else could have chosen exactly the same examples.",
          ],
        },
        {
          title: "Notice what changed because of them",
          paragraphs: [
            "Relationships alter us gradually. Think about what you now understand, enjoy, attempt or care about because this person entered your life. It does not need to be dramatic. Perhaps you are calmer in one situation, more adventurous, less embarrassed by something, or more willing to imagine a certain future.",
          ],
          bullets: [
            "A small habit you picked up from them.",
            "A belief they made you reconsider.",
            "Something you now look forward to because of the relationship.",
            "A part of yourself you feel safer showing them.",
          ],
        },
        {
          title: "Include one imperfect memory",
          paragraphs: [
            "Not every meaningful memory needs to be romantic. A missed train, a terrible meal, an awkward first meeting, getting lost, an argument you later understood differently, or a boring afternoon can say more about a real relationship than a perfect date.",
            "Choose a memory that demonstrates how you are together rather than how you want the relationship to look from outside.",
          ],
        },
        {
          title: "End with a future that is concrete",
          paragraphs: [
            "You do not need to promise forever to write about the future. Mention something you genuinely want: another trip, a quiet weekend, meeting after work, celebrating a milestone, or simply continuing one routine you already love.",
            "If the letter is meant for a specific future moment, choose the opening time before you write the final paragraph. Knowing when they will read it can change what deserves to be said.",
          ],
        },
      ]}
    />
  );
}
