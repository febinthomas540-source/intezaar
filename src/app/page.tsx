import Link from "next/link";
import { HeroJourney } from "@/components/hero-journey";
import { LetterOpening } from "@/components/letter-opening";
import { Navigation } from "@/components/navigation";

const moments = [
  ["01", "Drop it in the post box", "The message begins like a real letter: destination chosen, date stamped, emotions sealed inside paper and wax."],
  ["02", "Follow the railway mail", "The recipient returns for station updates, postmarks, inland-letter fragments, familiar sounds and a moving Indian train."],
  ["03", "Open what finally arrived", "At the promised moment, the letter settles, the seal breaks and the words feel worth the wait."],
];

const worldCards = [
  ["Red post box", "A recognisable Indian postal symbol anchors the whole experience—from the homepage to the final delivery."],
  ["Railway mail route", "Journey chapters borrow the rhythm of Indian train travel: platforms, timetables, chai, signals and changing landscapes."],
  ["Paper memory objects", "Inland letters, bus tickets, old SMS screens, postmarks and labels make the nostalgia feel tangible rather than generic."],
];

const routeStops = [
  "New Delhi Sorting Office",
  "Mathura Junction",
  "Jaipur Mail Exchange",
  "Ahmedabad RMS",
  "Mumbai Central",
  "Konkan Coastal Line",
  "Mangaluru Harbour",
  "Kozhikode Head Post Office",
  "Kottayam Night Mail",
  "Alappuzha Arrival",
];

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroJourney />

      <section id="experience" className="section experience-section">
        <div className="section-heading">
          <p className="eyebrow">The core ritual</p>
          <h2>Not a greeting card.<br />A letter carried by post and rail.</h2>
          <p>
            Intezaar should feel like India Post and Indian Railways quietly protecting something personal.
            The website is built around station nostalgia, sealed paper, red post boxes and the emotional
            patience of waiting for a letter to reach home.
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

      <section className="section india-section postal-world-section">
        <div className="india-copy">
          <p className="eyebrow">The Intezaar world</p>
          <h2>Indian post box, inland paper, station boards and mail trains.</h2>
          <p>
            The whole visual system now follows one idea: a memory dropped into a red post box and carried
            across India. Every page should feel tactile, slightly worn, warm and rooted in familiar postal and railway culture.
          </p>
          <Link href="/journey/demo" className="text-link">See the full postal route →</Link>
        </div>
        <div className="route-list world-list">
          {worldCards.map(([title, copy], index) => (
            <article key={title} className="route-list-item">
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section schedule-section">
        <div className="section-heading schedule-heading">
          <p className="eyebrow">Railway schedule of memory</p>
          <h2>The journey should feel scheduled, stamped and real.</h2>
        </div>
        <div className="route-schedule-card">
          <div className="route-schedule-head">
            <div>
              <small>INTEZAAR MAIL · ROUTE SHEET</small>
              <strong>Dispatch schedule: Delhi to Kerala</strong>
            </div>
            <span>Post &amp; Memories / RMS</span>
          </div>
          <div className="route-schedule-grid">
            {routeStops.map((stop, index) => (
              <div key={stop} className="schedule-stop">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{stop}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LetterOpening />

      <section className="final-cta postal-cta">
        <div className="final-cta-stamp">POSTED · SEALED · ARRIVING</div>
        <p className="eyebrow">The first memory can leave today</p>
        <h2>Make it feel like<br />it came by post.</h2>
        <p className="final-cta-copy">
          Build a private, nostalgic letter journey with Indian post box warmth, railway movement and the slow beauty of waiting.
        </p>
        <Link href="/create" className="button button-primary">Write the first letter</Link>
      </section>

      <footer className="site-footer">
        <div className="brand-mark"><span className="brand-seal">I</span><span>Intezaar</span></div>
        <p>A nostalgic Indian postal world where letters travel by rail before they arrive.</p>
        <span>Working product identity · post box and railway theme · 2026</span>
      </footer>
    </main>
  );
}
