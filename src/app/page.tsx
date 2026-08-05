import Link from "next/link";
import { HeroJourney } from "@/components/hero-journey";
import { LetterOpening } from "@/components/letter-opening";
import { Navigation } from "@/components/navigation";

const moments = [
  ["01", "Remember", "Give the journey the details ordinary messages lose: a nickname, a rainy evening, a bad photograph, a song only two people understand."],
  ["02", "Return", "Each visit reveals one quiet piece of the past—a postcard, a handwritten line, a voice fragment or a memory trace from the road."],
  ["03", "Receive", "At the chosen second, the recipient breaks the seal. The journey, postcards and private memories remain together as something worth keeping."],
];

const returnHooks = [
  ["01", "A memory trace", "Not a generic notification. One intimate clue that makes the recipient wonder which moment the sender remembered."],
  ["02", "A postcard from Arin", "The postman writes from each region with small observations about distance, rain, leaving and finding a way home."],
  ["03", "A fragment to keep", "A photograph corner, seven seconds of a voice, an unfinished sentence or a private name appears slowly in the memory box."],
];

const routes = [
  ["Delhi → Kerala", "Midnight conversations, old railway tea, monsoon windows and a final return beside the backwaters."],
  ["Mumbai → Himachal", "A rain-soaked photograph travels upward into pine mist, cold air and the memory of a first winter together."],
  ["Kochi → London", "Backwaters, airport night and cloud crossing carry a piece of home toward someone living far away."],
];

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroJourney />

      <section id="experience" className="section experience-section">
        <div className="section-heading">
          <p className="eyebrow">The emotional engine</p>
          <h2>The wait is not empty time.<br />It is the memory returning.</h2>
          <p>
            Intezaar is not a game the recipient must finish. It is a slow emotional journey that
            gives them a reason to come back: another trace, another place and another piece of a
            shared past moving closer.
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

      <section className="section experience-section">
        <div className="section-heading">
          <p className="eyebrow">Why someone returns tomorrow</p>
          <h2>Not points. Not streaks.<br />Something personal is still on its way.</h2>
          <p>
            Every return should feel like opening an old drawer and finding one more thing you had
            forgotten. Missing a day never punishes the recipient; the journey simply waits for them.
          </p>
        </div>
        <div className="moment-grid">
          {returnHooks.map(([number, title, copy]) => (
            <article className="moment-card" key={title}>
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
            Routes are storybook interpretations built from regional scenes—not fake GPS. Each city
            adds atmosphere, while the sender’s real memories remain the heart of the journey.
          </p>
          <Link href="/journey/demo" className="text-link">Follow a memory from Delhi to Kerala →</Link>
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
        <p className="eyebrow">Send back something they thought was gone</p>
        <h2>Make someone remember<br />before they even open it.</h2>
        <Link href="/create" className="button button-primary">Create a memory journey</Link>
      </section>

      <footer className="site-footer">
        <div className="brand-mark"><span className="brand-seal">I</span><span>Intezaar</span></div>
        <p>A private emotional journey where memories travel before the letter arrives.</p>
        <span>Working product identity · 2026</span>
      </footer>
    </main>
  );
}
