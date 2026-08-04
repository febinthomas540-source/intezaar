import Link from "next/link";
import { HeroJourney } from "@/components/hero-journey";
import { LetterOpening } from "@/components/letter-opening";
import { Navigation } from "@/components/navigation";

const moments = [
  ["01", "Write", "Choose the moment, place and feeling. Your words become an object with a destination."],
  ["02", "Watch it travel", "Every return reveals a new region, weather, clue or mark collected along the journey."],
  ["03", "Let it arrive", "At the chosen second, the recipient breaks the seal and unfolds something worth keeping."],
];

const routes = [
  ["Delhi → Kerala", "City light, desert warmth, coastal rain and backwater arrival."],
  ["Mumbai → Himachal", "Monsoon streets rising into pine mist and mountain cold."],
  ["Kochi → London", "Backwaters, airport night, cloud crossing and a distant doorstep."],
];

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroJourney />

      <section id="experience" className="section experience-section">
        <div className="section-heading">
          <p className="eyebrow">The emotional engine</p>
          <h2>The wait is not empty time.<br />It is the gift beginning.</h2>
          <p>
            Every interaction is designed around anticipation: not when the message is written,
            but what the recipient feels before they are allowed to read it.
          </p>
        </div>
        <div className="moment-grid">
          {moments.map(([number, title, copy]) => (
            <article className="moment-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section india-section">
        <div className="india-copy">
          <p className="eyebrow">A living India journey library</p>
          <h2>Heat, rain, distance and memory become part of the letter.</h2>
          <p>
            Routes are storybook interpretations built from reusable regional scenes—not fake GPS.
            The platform combines origin, destination, season and occasion into a visual travel story.
          </p>
          <Link href="/journey/demo" className="text-link">Walk through Delhi to Kerala →</Link>
        </div>
        <div className="route-list">
          {routes.map(([title, copy], index) => (
            <article key={title} className="route-list-item">
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <LetterOpening />

      <section className="final-cta">
        <div className="final-cta-stamp">04 · 08 · 26</div>
        <p className="eyebrow">The first journey begins here</p>
        <h2>Make someone wait<br />for something beautiful.</h2>
        <Link href="/create" className="button button-primary">Write the first letter</Link>
      </section>

      <footer className="site-footer">
        <div className="brand-mark"><span className="brand-seal">I</span><span>Intezaar</span></div>
        <p>An emotional delivery platform where messages travel before they arrive.</p>
        <span>Working product identity · 2026</span>
      </footer>
    </main>
  );
}
