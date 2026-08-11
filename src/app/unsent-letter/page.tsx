import type { Metadata } from "next";
import { IntentLanding } from "@/components/intent-landing";

export const metadata: Metadata = {
  title: "Write a Private Unsent Letter",
  description: "Write a private unsent letter before deciding whether it should be posted. Put the words somewhere first with Intezaar.",
  alternates: { canonical: "/unsent-letter" },
  keywords: ["write an unsent letter", "private unsent letter", "letter I will not send", "write feelings in a letter"],
};

export default function UnsentLetterPage() {
  return (
    <IntentLanding
      eyebrow="A private unsent letter"
      title="You can write the words before you decide what to do with them."
      intro="Not every feeling needs an immediate recipient. Write the letter first. Read it back later. Then decide whether it belongs with you or should ever be posted."
      primaryLabel="Write the letter"
      examplesTitle="Write the version you do not need to send yet"
      examples={[
        "What do I wish I could say without being interrupted?",
        "What part of this situation is actually hurting me?",
        "What do I want them to understand — not just react to?",
        "If I never send this, what did I still need to put into words?",
      ]}
      steps={[
        { title: "Write without performing", copy: "Put down the honest version first, knowing you do not have to send it immediately." },
        { title: "Give it distance", copy: "Leave the draft alone for a while and return when the feeling is less immediate." },
        { title: "Choose deliberately", copy: "Edit it, keep it for yourself, or post it later if sending still feels right." },
      ]}
      reflectionTitle="Writing can be useful even when sending is not the goal."
      reflectionCopy="Intezaar gives the letter a slower rhythm. The point is not to force a conversation; it is to create enough space for you to decide what the words are for."
      related={[
        { href: "/write-after-argument", title: "After an argument", copy: "Use time between the first reaction and the final message." },
        { href: "/future-self", title: "Future-self letter", copy: "Turn today's thoughts into something for later you." },
        { href: "/open-when", title: "Open when…", copy: "Write supportive words for a future moment." },
      ]}
    />
  );
}
