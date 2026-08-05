import Link from "next/link";
import { HeroJourney } from "@/components/hero-journey";
import { LetterOpening } from "@/components/letter-opening";
import { Navigation } from "@/components/navigation";

const moments = [
  ["01", "Write", "Seal one memory."],
  ["02", "Travel", "Watch it cross India."],
  ["03", "Arrive", "Open it on the chosen day."],
];

const routeStops = [
  "New Delhi",
  "Mathura",
  "Jaipur",
  "Ahmedabad",
  "Mumbai",
  "Konkan Coast",
  "Mangaluru",
  "Kozhikode",
  "Kottayam",
  "Alappuzha",
];

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroJourney />

      <section id="experience" className="section experience-section">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Write. Wait.<br />Let it arrive.</h2>
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

      <section className="section schedule-section">
        <div className="section-heading schedule-heading">
          <p className="eyebrow">Intezaar Mail</p>
          <h2>Delhi to Kerala.<br />Ten stops. One letter.</h2>
        </div>
        <div className="route-schedule-card">
          <div className="route-schedule-head">
            <div>
              <small>ROUTE SHEET</small>
              <strong>Southbound memory mail</strong>
            </div>
            <Link href="/journey/demo" className="text-link">Follow the route →</Link>
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
        <p className="eyebrow">Send something worth waiting for</p>
        <h2>Post a memory.<br />Let it come home.</h2>
        <Link href="/create" className="button button-primary">Write the letter</Link>
      </section>

      <footer className="site-footer">
        <div className="brand-mark"><span className="brand-seal">I</span><span>Intezaar</span></div>
        <p>Letters that travel before they arrive.</p>
        <span>India · 2026</span>
      </footer>
    </main>
  );
}
