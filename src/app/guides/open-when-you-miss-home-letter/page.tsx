import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "Open When You Miss Home Letter Ideas",
  description: "What to write in an open-when-you-miss-home letter for a partner, friend or family member living away, with personal prompts and examples.",
  alternates: { canonical: "/guides/open-when-you-miss-home-letter" },
  keywords: ["open when you miss home letter", "homesick letter ideas", "letter for someone who misses home", "open when homesick"],
};

export default function MissHomeLetterGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · Missing home"
      title="What to write in an ‘open when you miss home’ letter."
      intro="Homesickness is rarely about one place. It can be a kitchen smell, a familiar voice, a road you used to complain about, or the feeling of being known without explaining yourself. Write to those details."
      ctaLabel="Write an open-when letter"
      ctaHref="/open-when"
      relatedLinks={[
        { href: "/guides/open-when-letter-ideas", label: "More Open When letter ideas" },
        { href: "/guides/letter-to-parents-while-living-abroad", label: "Writing to parents while living abroad" },
      ]}
      sections={[
        {
          title: "Start with the version of home only you know",
          paragraphs: [
            "Avoid beginning with a generic promise that everything will be fine. Instead, name something concrete: the sound from the street outside their old room, the person who always asks whether they have eaten, the tea they make differently from everyone else, or the family habit they pretend to find annoying.",
            "Specific details make the letter feel like a small piece of home rather than a motivational message copied from anywhere.",
          ],
          bullets: [
            "‘If you are opening this because home feels far away tonight, I want to bring one small part of it back to you.’",
            "‘I can already imagine the exact thing you are missing today.’",
            "‘You know that ordinary evening at home we never thought was special? I keep thinking about it too.’",
          ],
        },
        {
          title: "Give them a memory they can step into",
          paragraphs: [
            "Choose one scene and describe it slowly. A Sunday lunch, a rainy bus ride, a festival morning, a sibling argument that became funny later, or the way everyone sits in the same places at home can work better than listing ten memories.",
            "The point is not nostalgia for its own sake. It is to remind the recipient that distance has not erased their place in the life they came from.",
          ],
        },
        {
          title: "Say what has not changed",
          paragraphs: [
            "Living away can make ordinary relationships feel uncertain. Use the letter to name what remains stable: who is waiting to hear from them, what they are still part of, and which relationships do not need constant contact to stay real.",
          ],
          bullets: [
            "A small family update they would smile at.",
            "A private joke that still works across time zones.",
            "A reminder of the next thing you plan to do together.",
            "One sentence that tells them they do not have to perform being ‘fine’ for you.",
          ],
        },
        {
          title: "End with something immediate and doable",
          paragraphs: [
            "A homesick moment can feel enormous. Finish with something small: make the tea you both like, call when they are ready, put on the song from that old drive, or look at one photograph you have attached to the letter.",
            "If you schedule the letter for a particular difficult day, keep the opening moment realistic. Intezaar can hold the message until the chosen time, but the words should still sound like you when they arrive.",
          ],
        },
      ]}
    />
  );
}
