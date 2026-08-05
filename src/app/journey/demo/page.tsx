import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { RaahiJourneyDemo } from "@/components/raahi-journey-demo";

export const metadata: Metadata = {
  title: "See Raahi’s Memory Journey",
  description: "Preview how one photograph, postcard, voice note, keepsake and final letter arrive across five daily landings.",
  robots: { index: false, follow: false },
};

export default function JourneyDemoPage() {
  return (
    <main className="raahi-demo-page">
      <Navigation />
      <RaahiJourneyDemo />
    </main>
  );
}
