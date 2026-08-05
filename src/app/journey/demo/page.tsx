import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { JourneyGame } from "@/components/journey-game";

export default function JourneyDemoPage() {
  return (
    <main className="journey-page">
      <Navigation />
      <JourneyGame />
      <div className="journey-next">
        <Link href="/create" className="button button-primary">
          Create a journey like this
        </Link>
      </div>
    </main>
  );
}
