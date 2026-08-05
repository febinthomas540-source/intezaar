import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { RainGlass } from "@/components/rain-glass";

const journeyCards = [
  {
    day: "Day 1 · Open now",
    className: "clarity-day-one",
    title: "A quiet beginning",
    copy: "The first photograph and its private caption are ready immediately.",
    status: "Opened",
  },
  {
    day: "Day 2 · Tomorrow",
    className: "clarity-day-two clarity-locked",
    title: "The next memory",
    copy: "It remains softened behind glass until tomorrow at midnight.",
    status: "18h 42m 36s",
  },
  {
    day: "Day 3 · In 2 days",
    className: "clarity-day-three clarity-locked",
    title: "A voice, just for you",
    copy: "A short recording arrives in the sender’s own voice.",
    status: "Voice note",
  },
  {
    day: "Day 4 · In 3 days",
    className: "clarity-day-four clarity-locked",
    title: "A moment, captured",
    copy: "Another photograph, old message or keepsake comes into focus.",
    status: "Still hidden",
  },
  {
    day: "Final day",
    className: "clarity-day-final",
    title: "The final letter",
    copy: "The complete letter opens only when every earlier memory has arrived.",
    status: "Sealed",
  },
  {
    day: "Your keepsake",
    className: "clarity-day-pdf",
    title: "Yours to keep, forever",
    copy: "The entire journey becomes a clean A4 memory book and poster.",
    status: "A4 PDF",
  },
];

export default function Home() {
  return (
    <main className="clarity-site">
      <Navigation />

      <section className="clarity-hero">
        <RainGlass intensity="medium" className="clarity-hero-rain" />
        <div className="clarity-moon" aria-hidden="true" />
        <div className="clarity-hero-copy">
          <p className="clarity-eyebrow">A private memory journey</p>
          <h1>Some memories should not arrive <em>instantly.</em></h1>
          <p className="clarity-lead">
            You upload the photographs, notes, voice messages and final letter. They receive one memory each day—until your full letter arrives.
          </p>
          <div className="clarity-actions">
            <Link href="/create" className="clarity-button clarity-button-light">Create a journey <span>→</span></Link>
            <a href="#how-it-works" className="clarity-button clarity-button-outline"><span className="clarity-play">▶</span> See how it works</a>
          </div>
          <div className="clarity-hero-facts" aria-label="Product highlights">
            <span>One memory each day</span>
            <span>Private recipient link</span>
            <span>Final A4 keepsake</span>
          </div>
        </div>
        <div className="clarity-hero-object" aria-hidden="true">
          <div className="clarity-open-letter">
            <span>July 2019</span>
            <strong>“That evening the rain kept us there.”</strong>
          </div>
          <div className="clarity-photo-print" />
        </div>
        <div className="clarity-scroll-cue"><span>Scroll to follow the journey</span><i /></div>
      </section>

      <section id="how-it-works" className="clarity-how">
        <header className="clarity-section-heading">
          <p className="clarity-eyebrow">How it works</p>
          <h2>A simple three-step journey.</h2>
          <p>People understand the experience immediately. The emotion comes from what you choose to put inside it.</p>
        </header>

        <div className="clarity-step-grid">
          <article className="clarity-step">
            <span className="clarity-step-number">1</span>
            <h3>Write and upload memories</h3>
            <p>Add photographs, notes, voice recordings and meaningful objects in the order you want them delivered.</p>
            <div className="clarity-step-art clarity-step-upload" aria-hidden="true">
              <div className="clarity-polaroid" />
              <div className="clarity-note">
                <span>The day we got lost in the rain and found our favourite chai place.</span>
                <i>▶ 〰〰〰 0:28</i>
              </div>
            </div>
          </article>

          <article className="clarity-step">
            <span className="clarity-step-number">2</span>
            <h3>One memory unlocks each day</h3>
            <p>The first opens immediately. Every future memory stays blurred while a live countdown moves towards its day.</p>
            <div className="clarity-step-art clarity-step-countdown" aria-label="Example locked memory countdown">
              <span>Day 2</span>
              <b>⌑</b>
              <small>A new memory unlocks in</small>
              <strong>18h 42m 36s</strong>
              <i>Tomorrow · 12:00 AM</i>
            </div>
          </article>

          <article className="clarity-step">
            <span className="clarity-step-number">3</span>
            <h3>The final letter arrives</h3>
            <p>The complete letter opens last. Everything they received becomes an A4 keepsake they can save or print.</p>
            <div className="clarity-step-art clarity-step-keepsake" aria-hidden="true">
              <div className="clarity-envelope"><i /></div>
              <div className="clarity-book-cover"><small>Our</small><strong>Intezaar Story</strong><span>A collection of memories</span></div>
              <b>PDF ↓</b>
            </div>
          </article>
        </div>
      </section>

      <section className="clarity-experience">
        <header className="clarity-section-heading clarity-section-heading-light">
          <p className="clarity-eyebrow">The journey they experience</p>
          <h2>One memory a day. A story that unfolds.</h2>
          <p>The complete sequence is visible, but only today’s chapter is clear enough to enter.</p>
        </header>

        <div className="clarity-journey-track">
          {journeyCards.map((card, index) => (
            <article className={`clarity-journey-card ${card.className}`} key={card.day}>
              <small>{card.day}</small>
              <div className="clarity-card-visual">
                {index === 0 ? <div className="clarity-card-photo" /> : null}
                {index > 0 && index < 4 ? <span className="clarity-card-lock">⌑</span> : null}
                {index === 2 ? <span className="clarity-card-wave">▂ ▅ ▃ ▇ ▄ ▆</span> : null}
                {index === 4 ? <div className="clarity-card-envelope"><i /></div> : null}
                {index === 5 ? <div className="clarity-card-pdf"><b>Our Journey</b><i /><i /><i /><i /></div> : null}
                {index === 1 ? <strong className="clarity-card-timer">18h 42m</strong> : null}
              </div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
              <span className="clarity-card-status">{card.status}</span>
            </article>
          ))}
        </div>

        <div className="clarity-trust-row">
          <article><span>01</span><div><strong>Private by design</strong><p>Only someone with the personal journey link can enter.</p></div></article>
          <article><span>02</span><div><strong>Delivered daily</strong><p>The next memory unlocks automatically at the chosen time.</p></div></article>
          <article><span>03</span><div><strong>Nothing disappears</strong><p>Every opened chapter remains available throughout the journey.</p></div></article>
          <article><span>04</span><div><strong>Yours afterwards</strong><p>Save the finished story as a printable A4 keepsake.</p></div></article>
        </div>
      </section>

      <section className="clarity-final">
        <RainGlass intensity="soft" className="clarity-final-rain" />
        <div className="clarity-final-letter" aria-hidden="true">
          <span>Dear you,</span>
          <p>By the time you read this, these memories will already have found you—one day at a time.</p>
        </div>
        <div className="clarity-final-copy">
          <p className="clarity-eyebrow">Some words deserve time</p>
          <h2>Create a journey that is worth the wait.</h2>
          <p>Turn a handful of real moments into a private daily experience ending in the letter you actually wanted to send.</p>
          <Link href="/create" className="clarity-button clarity-button-light">Create a journey <span>→</span></Link>
          <small>Takes only a few minutes to prepare the first version.</small>
        </div>
      </section>

      <footer className="clarity-footer">
        <strong>Intezaar</strong>
        <span>One memory each day. The final letter arrives last.</span>
        <span>India · 2026</span>
      </footer>
    </main>
  );
}
