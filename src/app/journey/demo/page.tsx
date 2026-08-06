import type { Metadata } from "next";
import { PostalLetterPrototype } from "@/components/postal-letter-prototype";

export const metadata: Metadata = {
  title: "Experience the Indian Mail Journey",
  description: "Preview a sealed letter travelling from Delhi to Kochi by a cinematic post-and-rail route before it can be opened.",
  robots: { index: false, follow: false },
  openGraph: {
    url: "/journey/demo",
    title: "Experience an Intezaar postal journey",
    description: "Follow a sealed demo letter through a cinematic Indian post-and-rail route before arrival.",
  },
};

export default function JourneyDemoPage() {
  return (
    <PostalLetterPrototype
      recipient="Ananya"
      sender="Arjun"
      occasion="Just because"
      format="airmail"
      openingTime="20:00"
      previewDay={2}
      duration={5}
      fromCity="Delhi"
      toCity="Kochi"
      demoMode
    />
  );
}
