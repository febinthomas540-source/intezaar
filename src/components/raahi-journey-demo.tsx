"use client";

import Link from "next/link";
import { useState } from "react";
import { RaahiBird } from "./raahi-bird";

const landings = [
  {
    day: "Day 1",
    place: "The first rooftop",
    kind: "Photograph",
    title: "The evening the rain kept us there",
    copy: "Raahi leaves the first photograph clipped beneath a red ribbon. The rest of the journey remains hidden in cloud.",
  },
  {
    day: "Day 2",
    place: "The old clock tower",
    kind: "Postcard",
    title: "A sentence copied from an old notebook",
    copy: "The next landing opens after the countdown. Yesterday’s memory remains visible above it.",
  },
  {
    day: "Day 3",
    place: "The monsoon tree",
    kind: "Voice note",
    title: "Seven seconds of rain and laughter",
    copy: "A small illustrated radio holds the sender’s voice. The memory can be replayed after it is delivered.",
  },
  {
    day: "Day 4",
    place: "The riverside wall",
    kind: "Keepsake",
    title: "The ticket neither of you threw away",
    copy: "A ticket, screenshot, date or private phrase becomes a physical object inside the illustrated world.",
  },
  {
    day: "Final day",
    place: "The warm window",
    kind: "Sealed letter",
    title: "The words Raahi carried all the way home",
    copy: "The final envelope opens only after every earlier memory has arrived. Then the complete A4 keepsake becomes available.",
  },
];

export function RaahiJourneyDemo() {
  const [active, setActive] = useState(0);
  const landing = landings[active];

  return (
    <section className="raahi-demo-shell">
      <div className="raahi-demo-intro">
        <p className="raahi-kicker">A five-day example</p>
        <h1>Follow Raahi from the first memory to the final letter.</h1>
        <p>
          This is how the recipient’s journey unfolds. One landing becomes clear each day while the places ahead remain covered by cloud.
        </p>
      </div>

      <div className="raahi-demo-stage">
        <svg className="raahi-demo-path" viewBox="0 0 1100 560" preserveAspectRatio="none" aria-hidden="true">
          <path d="M80 440 C220 75 420 90 520 315 C620 520 785 470 1025 105" />
        </svg>
        <div className="raahi-demo-sun" />
        <div className="raahi-demo-cloud cloud-one" />
        <div className="raahi-demo-cloud cloud-two" />
        <RaahiBird className="raahi-demo-bird" label="Raahi carrying a sealed letter" />

        <div className="raahi-demo-memory">
          <span>{landing.kind}</span>
          <small>{landing.day} · {landing.place}</small>
          <h2>{landing.title}</h2>
          <p>{landing.copy}</p>
          {active === 0 ? (
            <figure>
              <img src="/demo-memory-photo.svg" alt="Sample illustrated photograph from a rainy evening" />
              <figcaption>“Neither of us wanted the bus to come.”</figcaption>
            </figure>
          ) : null}
          {active === 2 ? <div className="raahi-demo-wave">▂ ▅ ▃ ▆ ▂ ▇ ▃ ▅ ▂ ▆</div> : null}
          {active === 4 ? <div className="raahi-demo-envelope"><i />For Ananya</div> : null}
        </div>
      </div>

      <div className="raahi-demo-days" aria-label="Preview each landing">
        {landings.map((item, index) => (
          <button
            key={item.day}
            type="button"
            className={index === active ? "active" : ""}
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.day}</strong>
            <small>{item.kind}</small>
          </button>
        ))}
      </div>

      <div className="raahi-demo-note">
        <div>
          <span>Real recipient rule</span>
          <strong>Only the current landing opens.</strong>
          <p>The preview buttons exist here only to explain the complete product.</p>
        </div>
        <Link href="/create" className="raahi-button raahi-button-primary">Create a journey</Link>
      </div>
    </section>
  );
}
