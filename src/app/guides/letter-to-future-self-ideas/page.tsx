import type { Metadata } from "next";
import { IntentGuide } from "@/components/intent-guide";

export const metadata: Metadata = {
  title: "What to Write in a Letter to Your Future Self",
  description: "Practical prompts and ideas for writing a meaningful letter to your future self, from memories and questions to hopes and promises.",
  alternates: { canonical: "/guides/letter-to-future-self-ideas" },
  keywords: ["what to write in a letter to future self", "future self letter ideas", "future me letter prompts", "letter to myself ideas"],
};

export default function FutureSelfIdeasGuide() {
  return (
    <IntentGuide
      eyebrow="Guide · Future-self letters"
      title="What should you write in a letter to your future self?"
      intro="The best future-self letters are not predictions. They are snapshots of who you are now, written for someone who happens to be you later."
      ctaLabel="Write my future-self letter"
      ctaHref="/future-self/write"
      sections={[
        {
          title: "Start with what is true today",
          paragraphs: [
            "Begin with details your future self may otherwise forget: where you are living, what your days feel like, what you are excited about, and what is taking up too much space in your head.",
            "Ordinary details often become the most meaningful part later because they preserve a version of your life that will eventually feel distant.",
          ],
          bullets: [
            "What does a normal day look like for me right now?",
            "Who matters most to me at this point in my life?",
            "What am I currently trying to change or protect?",
            "What tiny thing is making me happy lately?",
          ],
        },
        {
          title: "Ask your future self questions",
          paragraphs: [
            "Questions create a conversation across time. You do not need to know the answer now. The point is to leave a marker for what mattered enough to wonder about.",
          ],
          bullets: [
            "Did the thing I was scared of turn out the way I imagined?",
            "What did I learn about myself this year?",
            "Am I still chasing the same goal?",
            "What did I finally let go of?",
          ],
        },
        {
          title: "Write encouragement that sounds like you",
          paragraphs: [
            "Avoid trying to sound inspirational if that is not how you normally speak. A future-self letter feels stronger when the reassurance sounds recognisably like your own voice.",
            "You can remind future you what you have already survived, what values you want to keep, or what you hope you will be kinder to yourself about by then.",
          ],
        },
        {
          title: "Include one thing you want to remember",
          paragraphs: [
            "It could be a person, a place, a sentence someone said, a song you keep replaying, a family moment, or a feeling you know will not last forever. Future letters become especially powerful when they carry one concrete memory instead of only big goals.",
          ],
        },
      ]}
    />
  );
}
