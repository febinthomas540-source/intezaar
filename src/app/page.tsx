import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <main className="nostalgia-site">
      <Navigation />

      <section className="nostalgia-hero">
        <div className="nostalgia-hero-content">
          <p className="nostalgia-eyebrow">A private memory journey</p>
          <h1>Some memories should not <em>arrive instantly.</em></h1>
          <p className="nostalgia-hero-copy">
            Send photographs, voices and the words you never found the right moment to say. One memory appears each day. The final letter remains sealed until the journey is complete.
          </p>
          <div className="nostalgia-hero-actions">
            <Link href="/create" className="nostalgia-button nostalgia-button-primary">Create a journey</Link>
            <Link href="/journey/demo" className="nostalgia-button nostalgia-button-ghost">Enter the experience</Link>
          </div>
        </div>
        <div className="nostalgia-hero-foot">
          <span>Chandni Chowk · New Delhi</span>
          <span>A messenger waiting above the city</span>
        </div>
      </section>

      <section className="nostalgia-manifest">
        <div>
          <p className="nostalgia-eyebrow">Why Intezaar exists</p>
          <h2>We have made everything faster except meaning.</h2>
        </div>
        <div className="nostalgia-manifest-copy">
          <p>
            Messages now arrive before we have decided what they mean. Photographs disappear into camera rolls. Voice notes are heard once and forgotten beneath newer notifications.
          </p>
          <p>
            Intezaar gives a memory its own time and place. The recipient returns because something is still coming—not because an app demands attention, but because someone they know left something unfinished.
          </p>
          <strong>Yesterday remains. Today opens. Tomorrow is still hidden.</strong>
        </div>
      </section>

      <section className="nostalgia-story">
        <div className="nostalgia-story-visual">
          <div className="nostalgia-story-photo">
            <p className="nostalgia-story-caption">An old room in Puducherry. Photographs stay on the wall long after the moment has passed.</p>
          </div>
        </div>
        <div className="nostalgia-story-copy">
          <article className="nostalgia-act">
            <span className="nostalgia-act-number">Act I · What you leave behind</span>
            <h3>Choose only the memories that still have weight.</h3>
            <p>
              A photograph from a forgotten evening. Seven seconds of rain and laughter. A bus ticket kept for no sensible reason. A sentence copied from an old message.
            </p>
            <blockquote>Not more content. Just the things that belong to the two of you.</blockquote>
          </article>

          <article className="nostalgia-act">
            <span className="nostalgia-act-number">Act II · The waiting</span>
            <h3>Only one part becomes clear each day.</h3>
            <p>
              The recipient can see that the journey continues, but cannot rush it. Future memories remain softened behind glass, shadow and distance while a quiet countdown moves towards the next opening.
            </p>
          </article>

          <article className="nostalgia-act">
            <span className="nostalgia-act-number">Act III · The arrival</span>
            <h3>The full letter is the last thing they receive.</h3>
            <p>
              After every photograph, sound and keepsake has arrived, the final words open in their full context. The complete journey then becomes an A4 memory book they can save or print.
            </p>
          </article>
        </div>
      </section>

      <section className="nostalgia-memory-archive">
        <div className="nostalgia-archive-content">
          <p className="nostalgia-eyebrow">What can travel</p>
          <h2>Real fragments from a life already lived.</h2>
          <p>
            Each memory should feel found rather than designed. The website does not turn it into a cartoon object. It preserves the grain, handwriting, silence and imperfection that made it real.
          </p>
          <div className="nostalgia-object-list">
            <span>Photographs</span>
            <span>Voice notes</span>
            <span>Old messages</span>
            <span>Tickets</span>
            <span>Dates</span>
            <span>Private phrases</span>
            <span>The final letter</span>
          </div>
        </div>
      </section>

      <section className="nostalgia-wait">
        <div className="nostalgia-wait-photo" />
        <div className="nostalgia-wait-copy">
          <p className="nostalgia-eyebrow">The next memory is close</p>
          <h2>A window stays closed until the right moment.</h2>
          <p>
            The first memory opens immediately. Everything after it remains visible only as a suggestion. When the countdown reaches zero, the next part comes into focus.
          </p>
          <div className="nostalgia-countdown" aria-label="Example time until the next memory">
            <span><b>18</b><small>hours</small></span>
            <span><b>42</b><small>minutes</small></span>
            <span><b>15</b><small>seconds</small></span>
          </div>
        </div>
      </section>

      <section className="nostalgia-keepsake">
        <div>
          <p className="nostalgia-eyebrow">After the final letter</p>
          <h2>The journey becomes something physical again.</h2>
          <p>
            Every opened memory, caption and word is arranged into a quiet A4 keepsake. Not a screenshot of the website—a proper memory book built from the original photographs and letter.
          </p>
          <Link href="/journey/demo" className="nostalgia-button nostalgia-button-ghost">See the complete journey</Link>
        </div>
        <div className="nostalgia-keepsake-pages" aria-hidden="true">
          <article className="nostalgia-keepsake-page"><span>Memory four</span><strong>The ticket that stayed in your wallet</strong><p>A place, a date and the small reason it was never thrown away.</p></article>
          <article className="nostalgia-keepsake-page"><span>Memory one</span><strong>The evening the rain kept you there</strong><p>The photograph that began the journey.</p></article>
          <article className="nostalgia-keepsake-page"><span>Intezaar</span><strong>For the person who waited</strong><p>A private collection of everything that arrived.</p></article>
        </div>
      </section>

      <section className="nostalgia-final">
        <div className="nostalgia-final-inner">
          <p className="nostalgia-eyebrow">Some words deserve time</p>
          <h2>Give someone a reason to return tomorrow.</h2>
          <Link href="/create" className="nostalgia-button nostalgia-button-primary">Begin the letter</Link>
        </div>
      </section>

      <footer className="nostalgia-footer">
        <strong>Intezaar</strong>
        <span>Memories that take time to arrive</span>
        <span>India · 2026</span>
      </footer>
    </main>
  );
}
