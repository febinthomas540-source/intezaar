import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { RaahiJourneyDemo } from "@/components/raahi-journey-demo";

export const metadata: Metadata = {
  title: "Experience a Memory Journey",
  description: "Preview how photographs, written memories, voice notes, keepsakes and a final sealed letter arrive over several days.",
  robots: { index: false, follow: false },
};

export default function JourneyDemoPage() {
  return (
    <main className="nostalgia-demo-page">
      <Navigation />
      <RaahiJourneyDemo />
    </main>
  );
}
