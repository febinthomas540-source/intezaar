import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "How to Write an Unsent Letter",
  description: "A practical guide to writing an unsent letter when you need to put difficult words somewhere without sending them immediately.",
  alternates: { canonical: "/guides/how-to-write-an-unsent-letter" },
  keywords: ["how to write an unsent letter", "write a letter I will not send", "unsent letter exercise", "private letter to process feelings"],
};

export default function UnsentLetterGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · Unsent letters"
      title="How to write a letter you do not have to send."
      intro="An unsent letter gives the words somewhere to exist before you decide whether another person should ever receive them."
      ctaLabel="Write a private unsent letter"
      ctaHref="/unsent-letter"
      sections={[
        {
          title: "Write the first version without editing the emotion",
          paragraphs: [
            "Start with what you actually want to say, not what sounds reasonable. The first draft is for getting the shape of the feeling onto the page.",
            "You can make decisions about tone, fairness and whether anything should be shared later. Those decisions do not need to happen in the same minute as the writing.",
          ],
        },
        {
          title: "Separate facts from interpretations",
          paragraphs: [
            "If the letter is about conflict, it can help to distinguish what happened from what you think it meant. That often makes the writing clearer without asking you to deny how the situation felt.",
          ],
          bullets: [
            "What happened that I can describe plainly?",
            "What did I assume or fear because of it?",
            "What did I need in that moment?",
            "What do I wish I had been able to say?",
          ],
        },
        {
          title: "Do not make sending the goal",
          paragraphs: [
            "An unsent letter can stay unsent. The value is in having a place to put the words. If you later decide that part of it deserves to become a message, you can write a new version rather than treating the first draft as something that must be delivered.",
          ],
        },
        {
          title: "Come back when the temperature is lower",
          paragraphs: [
            "Time changes what stands out. When you reread later, notice which sentences still feel important and which ones were mainly carrying the intensity of the moment.",
          ],
        },
      ]}
    />
  );
}
