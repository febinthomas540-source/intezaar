import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { RaahiBird } from "@/components/raahi-bird";

const steps = [
  ["01", "Pack the memories", "Choose photographs, voice notes, private phrases, small objects and the final letter."],
  ["02", "Raahi lands each day", "Only one memory opens at a time. The places ahead remain hidden beneath cloud."],
  ["03", "The letter reaches home", "After the last landing, the recipient opens the full letter and saves the journey."],
];

const landings = [
  ["Landing 1", "Photograph", "A real photo arrives first."],
  ["Landing 2", "Postcard", "A short memory follows."],
  ["Landing 3", "Voice", "A familiar sound waits in the rain."],
  ["Landing 4", "Keepsake", "A ticket, date or private phrase appears."],
  ["Final landing", "Letter", "The sealed words finally reach home."],
];

export default function Home() {
  return (
    <main className="raahi-site">
      <Navigation />

      <section className="raahi-home-hero">
        <div className="raahi-home-copy">
          <p className="raahi-kicker">A slower way to send something real</p>
          <h1>Send a memory.<br /><em>Let it find its way home.</em></h1>
          <p>
            Raahi is a little messenger carrying photographs, voices and private words one landing at a time—until the final sealed letter reaches the person you chose.
          </p>
          <div className="raahi-hero-actions">
            <Link href="/create" className="raahi-button raahi-button-primary">Create a memory journey</Link>
            <Link href="/journey/demo" className="raahi-button raahi-button-secondary">See how it unfolds</Link>
          </div>
          <div className="raahi-hero-proof">
            <span>One memory each day</span>
            <span>Private recipient link</span>
            <span>A4 keepsake at the end</span>
          </div>
        </div>

        <div className="raahi-hero-scene" aria-label="Raahi carrying an envelope across an illustrated sky">
          <div className="raahi-cloud raahi-cloud-one" />
          <div className="raahi-cloud raahi-cloud-two" />
          <svg className="raahi-flight-line" viewBox="0 0 700 520" preserveAspectRatio="none" aria-hidden="true">
            <path d="M30 430 C180 80 365 100 388 286 C411 470 555 470 670 68" />
          </svg>
          <RaahiBird className="raahi-hero-bird" label="Raahi the messenger pigeon carrying a sealed envelope" />
          <figure className="raahi-memory-polaroid">
            <img src="/demo-memory-photo.svg" alt="Illustrated photograph of a rainy evening memory" />
            <figcaption>“That evening neither of us wanted the bus to come.”</figcaption>
          </figure>
        </div>
      </section>

      <section className="raahi-intro-band">
        <h2>Not another instant message.</h2>
        <p>
          Intezaar turns waiting into part of the gift. Yesterday’s memory stays with the recipient, today’s landing becomes clear, and tomorrow’s remains just out of reach.
        </p>
      </section>

      <section className="raahi-section">
        <div className="raahi-section-heading">
          <p className="raahi-kicker">How Intezaar works</p>
          <h2>You prepare the story. Raahi carries it.</h2>
        </div>
        <div className="raahi-how-grid">
          {steps.map(([number, title, copy]) => (
            <article className="raahi-how-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="raahi-section raahi-landings-section">
        <div className="raahi-section-heading">
          <p className="raahi-kicker">One journey, several landings</p>
          <h2>Every stop leaves something behind.</h2>
          <p>The sender chooses what each landing contains. A shorter journey with honest memories is always better than empty filler.</p>
        </div>
        <div className="raahi-landing-grid">
          {landings.map(([day, title, copy]) => (
            <article className="raahi-landing-card" key={day}>
              <span>{day}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <div className="raahi-mini-orbit" />
              <i className="raahi-mini-dot" />
            </article>
          ))}
        </div>
      </section>

      <section className="raahi-section raahi-wait-section">
        <div className="raahi-wait-copy">
          <p className="raahi-kicker">The waiting is visible</p>
          <h2>Today is clear. Tomorrow is still in the clouds.</h2>
          <p>
            The first landing opens immediately. A live countdown begins, and every future memory remains blurred until Raahi reaches it.
          </p>
          <div className="raahi-countdown-pill" aria-label="Example countdown">
            <span><b>18</b><small>hours</small></span>
            <span><b>42</b><small>minutes</small></span>
            <span><b>15</b><small>seconds</small></span>
          </div>
        </div>
        <div className="raahi-wait-board">
          <div className="open-memory">
            <img src="/demo-memory-photo.svg" alt="First memory already delivered" />
            <p>Landing 1 · already delivered</p>
          </div>
          <div className="locked-memory">
            <div>
              <span>☁</span>
              <strong>The old clock tower</strong>
              <small>Raahi lands here tomorrow.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="raahi-section raahi-keepsake-section">
        <div>
          <p className="raahi-kicker">After the final letter</p>
          <h2>The whole journey becomes something they can keep.</h2>
          <p>
            Once every landing has opened, Intezaar turns the route, photographs, captions and full letter into an A4 memory book and a one-page journey poster.
          </p>
          <Link href="/journey/demo" className="raahi-button raahi-button-secondary">Explore the full example</Link>
        </div>
        <div className="raahi-book-stack" aria-hidden="true">
          <div className="raahi-book-page"><span>Landing 3</span><strong>A voice beneath the monsoon tree</strong></div>
          <div className="raahi-book-page"><span>Landing 1</span><strong>The photograph that began the journey</strong></div>
          <div className="raahi-book-page"><span>Intezaar keepsake</span><strong>For the person who waited</strong></div>
        </div>
      </section>

      <section className="raahi-final-cta">
        <p className="raahi-kicker">Some words deserve a journey</p>
        <h2>Give Raahi something precious to carry.</h2>
        <Link href="/create" className="raahi-button raahi-button-primary">Begin the journey</Link>
      </section>

      <footer className="raahi-footer">
        <strong>Intezaar</strong>
        <span>Send a memory. Let it find its way home.</span>
        <span>India · 2026</span>
      </footer>
    </main>
  );
}
