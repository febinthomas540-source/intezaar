"use client";

import Link from "next/link";
import { useState } from "react";

const memories = [
  {
    day: "Day 1",
    kind: "Photograph",
    title: "The evening the rain kept you there",
    copy: "The first image opens immediately. Everything after it is still only a shape behind glass.",
  },
  {
    day: "Day 2",
    kind: "Written memory",
    title: "A sentence copied from an old notebook",
    copy: "Yesterday remains visible. The second memory arrives without replacing what came before it.",
  },
  {
    day: "Day 3",
    kind: "Voice note",
    title: "Seven seconds of rain and laughter",
    copy: "A familiar voice enters the journey quietly and remains available after the day has passed.",
  },
  {
    day: "Day 4",
    kind: "Keepsake",
    title: "The ticket neither of you threw away",
    copy: "A date, object or small physical detail gives the journey a life outside the screen.",
  },
  {
    day: "Final day",
    kind: "Sealed letter",
    title: "The words that needed everything else to arrive first",
    copy: "Only after the earlier memories are understood does the complete letter open.",
  },
];

export function RaahiJourneyDemo() {
  const [active, setActive] = useState(0);
  const memory = memories[active];

  return (
    <section className="nostalgia-demo">
      <header className="nostalgia-demo-header">
        <p className="nostalgia-eyebrow">A complete five-day example</p>
        <h1>See how the meaning changes as more of the story arrives.</h1>
        <p>
          This preview lets you move through every day. A real recipient would only see the memories that have already opened.
        </p>
      </header>

      <div className="nostalgia-demo-layout">
        <div className={`nostalgia-demo-scene scene-${active + 1}`}>
          <article className="nostalgia-demo-sheet">
            <small>{memory.day} · {memory.kind}</small>
            <h2>{memory.title}</h2>
            <p>{memory.copy}</p>
            {active === 0 ? (
              <img
                className="nostalgia-demo-photo"
                src="https://images.pexels.com/photos/15814837/pexels-photo-15814837.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="A warm old room holding photographs and window light"
              />
            ) : null}
            {active === 2 ? <div className="nostalgia-demo-wave">▂ ▅ ▃ ▆ ▂ ▇ ▃ ▅ ▂ ▆</div> : null}
            {active === 4 ? <div className="nostalgia-demo-letter">For the person who waited</div> : null}
          </article>
        </div>

        <nav className="nostalgia-demo-timeline" aria-label="Preview each day">
          {memories.map((item, index) => (
            <button key={item.day} type="button" className={index === active ? "active" : ""} onClick={() => setActive(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.day}</strong>
              <small>{item.kind}</small>
            </button>
          ))}
        </nav>
      </div>

      <footer className="nostalgia-demo-footer">
        <div>
          <p className="nostalgia-eyebrow">The real rule</p>
          <h2>The recipient cannot skip ahead.</h2>
          <p>The next memory opens only when its countdown ends.</p>
        </div>
        <Link href="/create" className="nostalgia-button nostalgia-button-primary">Create your own journey</Link>
      </footer>
    </section>
  );
}
