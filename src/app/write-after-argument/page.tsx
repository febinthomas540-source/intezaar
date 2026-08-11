import type { Metadata } from "next";
import { IntentLanding } from "@/components/intent-landing";

export const metadata: Metadata = {
  title: "Write Now, Send Later After an Argument",
  description: "Write a private letter after an argument, give the words some distance, and decide later whether to send them with Intezaar.",
  alternates: { canonical: "/write-after-argument" },
  keywords: ["write after argument", "send message later after argument", "letter after a fight", "cool down before sending message"],
};

export default function WriteAfterArgumentPage() {
  return (
    <IntentLanding
      eyebrow="Write now. Decide later."
      title="Put a little time between the feeling and the sending."
      intro="When everything feels immediate, a letter can slow the moment down. Write what you need to say, then come back to it before deciding whether it should be posted."
      primaryLabel="Write it privately"
      examplesTitle="Questions that can make the letter clearer"
      examples={[
        "What am I actually asking for beneath the anger?",
        "What happened, and what story am I adding to it?",
        "Which sentence would I regret sending exactly as it is now?",
        "What would I want this person to understand tomorrow?",
      ]}
      steps={[
        { title: "Write the first version", copy: "Get the immediate words out without making the first draft the final message." },
        { title: "Come back later", copy: "Read it again after some distance and remove anything that no longer says what you mean." },
        { title: "Choose whether to post", copy: "If it still feels worth sharing, seal it and choose when the recipient can open it." },
      ]}
      reflectionTitle="Distance can change the shape of a message."
      reflectionCopy="Intezaar does not tell you what to feel or whether a relationship should continue. It simply gives you a slower format for words that may benefit from not being sent immediately."
      related={[
        { href: "/unsent-letter", title: "Private unsent letter", copy: "Write without committing to sending anything." },
        { href: "/open-when", title: "Open when…", copy: "Write for a future moment instead of the immediate one." },
        { href: "/future-self", title: "Future-self letter", copy: "Leave a record of what this period felt like for later you." },
      ]}
    />
  );
}
