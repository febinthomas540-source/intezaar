import type { Metadata } from "next";
import Link from "next/link";
import { HeroJourney } from "@/components/hero-journey";
import { LetterOpening } from "@/components/letter-opening";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "Intezaar — A letter that travels by train",
    description: "Write a private letter, let it travel for 3, 5 or 7 days, and open it when it arrives.",
  },
};

const steps = [
  ["01", "Write and seal the letter", "Write the main letter first. Add up to three photographs, voice notes or a short video only when they belong inside it."],
  ["02", "Choose how long it travels", "Pick a simple 3, 5 or 7-day postal journey. The recipient sees a sealed envelope and a few meaningful station updates."],
  ["03", "Let it arrive", "On the final day the letter is delivered. They break the seal, read it and can keep a printable copy afterwards."],
];

const journeyLengths = [
  ["3 days", "A short route for birthdays, apologies and words that should not wait too long."],
  ["5 days", "The balanced Intezaar journey: enough time to feel the distance without becoming a task."],
  ["7 days", "A slower passage for anniversaries, farewells and letters carrying more weight."],
];

const routeUpdates = [
  ["Posted", "Your sealed letter enters the Intezaar mail route."],
  ["Now at Mathura", "A quiet station update shows that the letter is moving, without asking the recipient to do anything."],
  ["Crossing the Konkan", "Rain, distance and railway atmosphere make the wait visible."],
  ["Arriving tomorrow", "The seal remains closed until the chosen arrival day."],
];

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroJourney />

      <section id="how-it-works" className="section experience-section">
        <div className="section-heading">
          <p className="eyebrow">How Intezaar works</p>
          <h2>One letter.<br />Three simple steps.</h2>
          <p>
            Intezaar is not a memory journal or a daily game. It is a private digital letter that takes a short Indian mail journey before it can be opened.
          </p>
        </div>
        <div className="moment-grid">
          {steps.map(([number, title, copy]) => (
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
          <p className="eyebrow">Choose the pace</p>
          <h2>Three journeys.<br />No complicated timeline.</h2>
          <p>The recipient never has to return every day. They can check the route occasionally, or simply come back when the letter arrives.</p>
        </div>
        <div className="route-schedule-card">
          <div className="route-schedule-head">
            <div><small>Available postal journeys</small><strong>3 · 5 · 7 days</strong></div>
            <span>Illustrative route, not live GPS tracking</span>
          </div>
          <div className="route-schedule-grid">
            {journeyLengths.map(([title, copy], index) => (
              <article className="schedule-stop" key={title}>
                <span>0{index + 1}</span>
                <p><strong>{title}</strong><br />{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section india-section">
        <div className="india-copy">
          <p className="eyebrow">The Indian mail atmosphere</p>
          <h2>Post boxes, sorting marks, night trains and monsoon platforms.</h2>
          <p>
            The journey is a cinematic interpretation of Indian post and rail. It gives the waiting a place and rhythm while the letter remains the main object.
          </p>
          <Link href="/journey/demo" className="text-link">Follow the demo letter →</Link>
        </div>
        <div className="route-list">
          {routeUpdates.map(([title, copy], index) => (
            <article key={title} className="route-list-item">
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <LetterOpening />

      <section className="final-cta">
        <div className="final-cta-stamp">POSTED WITH PATIENCE</div>
        <p className="eyebrow">Write it today. Let it arrive later.</p>
        <h2>Some letters should<br />take the long way.</h2>
        <Link href="/create" className="button button-primary">Write a letter</Link>
      </section>

      <footer className="site-footer">
        <div className="brand-mark"><span className="brand-seal">I</span><span>Intezaar</span></div>
        <p>A private digital letter delivered through a cinematic Indian mail journey.</p>
        <span>India · 2026</span>
      </footer>
    </main>
  );
}
