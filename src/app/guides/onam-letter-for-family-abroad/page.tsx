import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "Onam Letter Ideas for Family When You Live Abroad",
  description: "What to write in an Onam letter to family in Kerala when you live abroad, with prompts about home, distance, memories and Thiruvonam morning.",
  alternates: { canonical: "/guides/onam-letter-for-family-abroad" },
  keywords: ["Onam letter to family", "Onam message for family abroad", "Onam wishes from abroad", "letter home for Onam"],
};

export default function OnamFamilyLetterGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · Onam away from home"
      title="What to write home when you cannot be there for Onam."
      intro="When you live away from Kerala, Onam can make ordinary distance feel unusually visible. A private letter gives you room to say more than a festival greeting without turning the moment into a long speech."
      ctaLabel="Write your Onam letter"
      ctaHref="/onam"
      showReflectionNote={false}
      relatedLinks={[
        { href: "/guides/letter-to-parents-while-living-abroad", label: "A letter to parents while living abroad" },
        { href: "/guides/open-when-you-miss-home-letter", label: "Open when you miss home" },
      ]}
      sections={[
        {
          title: "Start with what you can picture from far away",
          paragraphs: [
            "Write the scene you imagine at home: who wakes first, what is being prepared, the flowers, the arguments over small details, the clothes laid out, or the person who always takes charge of breakfast. You do not need to explain Onam to the people who share it with you.",
            "The value is in showing them that you can still see the morning even when you are not physically inside it.",
          ],
        },
        {
          title: "Say what you miss without making the whole letter sad",
          paragraphs: [
            "It is natural to say that you wish you were there. Then move into what the distance has made you appreciate more clearly. It might be your mother's way of asking the same question three times, your father's quiet festival routine, siblings arriving late, or the house becoming temporarily crowded again.",
          ],
          bullets: [
            "One tiny Onam detail you miss more than expected.",
            "One family habit that makes you laugh from a distance.",
            "One older Onam memory you still replay.",
            "One thing you want everyone at home to know this year.",
          ],
        },
        {
          title: "Write separately to the people inside the group",
          paragraphs: [
            "Even if the letter is addressed to the whole family, one or two sentences for specific people make it feel intimate. Mention the person who has been carrying more responsibility, the relative you have not called enough, or the younger adult whose life has changed since you last celebrated together.",
            "Avoid turning the letter into a list of greetings. Choose the people for whom you genuinely have something specific to say.",
          ],
        },
        {
          title: "Let the ending belong to Thiruvonam morning",
          paragraphs: [
            "Finish with a simple image of connection across time zones: you waking elsewhere while the house in Kerala is already alive, everyone reading the same words on the same festival morning, or the next Onam you hope to spend together.",
            "Intezaar's Onam 2026 page is built specifically around this moment, with the letter scheduled to open on Thiruvonam morning in Kerala.",
          ],
        },
      ]}
    />
  );
}
