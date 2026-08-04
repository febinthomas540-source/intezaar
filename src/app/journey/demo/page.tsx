"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { JourneyStageCard } from "@/components/journey-stage";
import { LetterOpening } from "@/components/letter-opening";
import { demoJourney } from "@/lib/journey";

export default function JourneyDemoPage() {
  const [index, setIndex] = useState(1);
  const stage = useMemo(() => demoJourney[index], [index]);

  return (
    <main className="journey-page">
      <Navigation />
      <section className="journey-demo-head">
        <div>
          <p className="eyebrow">Private journey · For Ananya</p>
          <h1>A letter is travelling<br />from Delhi to Kerala.</h1>
        </div>
        <div className="journey-countdown"><span>Arriving in</span><strong>3 sleeps</strong><small>17 August · 12:00 AM</small></div>
      </section>

      <section className="journey-demo-body">
        <JourneyStageCard stage={stage} />
        <aside className="journey-timeline">
          <div className="timeline-heading"><span>Journey chapters</span><strong>{stage.progress}%</strong></div>
          <div className="progress-line"><i style={{ width: `${stage.progress}%` }} /></div>
          {demoJourney.map((item, itemIndex) => (
            <button
              key={item.id}
              onClick={() => setIndex(itemIndex)}
              className={itemIndex === index ? "active" : ""}
            >
              <span>{itemIndex + 1}</span>
              <div><strong>{item.region}</strong><small>{item.eyebrow.replace(/Day \d · /, "")}</small></div>
            </button>
          ))}
          <div className="daily-clue">
            <span>Today’s trace</span>
            <p>“The paper carries a faint scent of rain.”</p>
            <small>Come back tomorrow for another trace.</small>
          </div>
        </aside>
      </section>

      <div className="demo-divider"><span>Preview the final arrival</span></div>
      <LetterOpening />
      <div className="journey-next"><Link href="/create" className="button button-primary">Create a journey like this</Link></div>
    </main>
  );
}
