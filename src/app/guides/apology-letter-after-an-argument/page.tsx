import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "How to Write an Apology Letter After an Argument",
  description: "A practical guide to writing an apology letter after an argument without making excuses, escalating the conflict or forcing an immediate response.",
  alternates: { canonical: "/guides/apology-letter-after-an-argument" },
  keywords: ["apology letter after argument", "how to write apology after fight", "apology letter to partner after argument", "what to say after an argument"],
};

export default function ApologyAfterArgumentGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · After an argument"
      title="How to write an apology letter after an argument."
      intro="The useful part of an apology is not how emotional it sounds. It is whether the other person can understand what you are taking responsibility for, what you understand about the impact, and what you intend to do differently."
      ctaLabel="Write after the argument"
      ctaHref="/write-after-argument"
      relatedLinks={[
        { href: "/guides/how-to-write-an-unsent-letter", label: "How to write an unsent letter first" },
        { href: "/guides/meaningful-letter-ideas-for-partner", label: "Meaningful letter ideas for a partner" },
      ]}
      sections={[
        {
          title: "Separate the apology from your defence",
          paragraphs: [
            "If the sentence starts with ‘I am sorry, but…’, you are probably still arguing. Write the explanation in a separate draft if you need to, then return to the apology and ask what you can own without requiring the other person to agree with your entire version of events.",
            "You can acknowledge context later. Responsibility should be understandable before the context arrives.",
          ],
        },
        {
          title: "Name the behaviour, not your identity",
          paragraphs: [
            "‘I am a terrible person’ can make the recipient feel responsible for reassuring you. Be more specific: you interrupted them, dismissed something important, raised your voice, made an unfair assumption, or said something designed to hurt.",
          ],
          bullets: [
            "What did I actually do or say?",
            "What impact might that have had on them?",
            "What part am I responsible for even if I still disagree about other parts?",
            "What would I do differently if the same moment happened again?",
          ],
        },
        {
          title: "Do not demand forgiveness inside the apology",
          paragraphs: [
            "An apology can invite conversation, but it should not set a deadline for forgiveness. Avoid phrases that turn the letter into pressure: ‘please answer me now’, ‘you have to understand’, or ‘I said sorry, so we should move on.’",
            "A calmer ending can say that you are available to talk when they are ready, and that you understand they may need space.",
          ],
        },
        {
          title: "Use time before sending if the argument is still active",
          paragraphs: [
            "If you are still rewriting the argument in your head, first write a private unsent version containing everything. Then come back later and decide what belongs in the message another person should actually receive.",
            "Intezaar's after-an-argument flow is designed around that pause: write now, create distance, and let the message arrive later instead of sending at the emotional peak.",
          ],
        },
      ]}
    />
  );
}
