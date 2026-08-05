"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

const memorySuggestions = [
  "A photograph from a day you both remember",
  "A sentence copied from an old message",
  "A voice note, song or familiar sound",
  "A ticket, date or object that stayed with you",
  "A final clue before the sealed letter",
  "Another photograph or private memory",
  "The last fragment before the full letter",
];

export default function CreatePage() {
  const [created, setCreated] = useState(false);
  const [memoryCount, setMemoryCount] = useState(5);
  const [recipient, setRecipient] = useState("Ananya");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreated(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="nostalgia-create">
      <Navigation />
      <section className="nostalgia-create-layout">
        <aside className="nostalgia-create-photo">
          <p className="nostalgia-eyebrow">Create a private journey</p>
          <h1>Choose what is worth waiting for.</h1>
          <p>
            The strongest journeys are not the longest. They contain only the photographs, sounds and words that still feel alive between two people.
          </p>
        </aside>

        <div className="nostalgia-create-form-wrap">
          {!created ? (
            <form className="nostalgia-form" onSubmit={submit}>
              <section className="nostalgia-form-section">
                <div className="nostalgia-form-heading"><span>01</span><h2>The two people</h2></div>
                <div className="nostalgia-form-grid">
                  <label>Your name<input name="sender" placeholder="Arjun" required /></label>
                  <label>Their name<input name="recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Ananya" required /></label>
                </div>
                <div className="nostalgia-form-grid">
                  <label>Occasion
                    <select name="occasion" defaultValue="just-because">
                      <option value="just-because">Just because</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="farewell">Farewell</option>
                      <option value="proposal">Proposal</option>
                      <option value="apology">Apology</option>
                    </select>
                  </label>
                  <label>Reveal the sender
                    <select name="identity" defaultValue="visible">
                      <option value="visible">From the beginning</option>
                      <option value="clues">Through small clues</option>
                      <option value="final">Only in the final letter</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="nostalgia-form-section">
                <div className="nostalgia-form-heading"><span>02</span><h2>The pace</h2></div>
                <label>How many memories should arrive?</label>
                <div className="nostalgia-length-options" role="group" aria-label="Number of memories">
                  {[3, 5, 7].map((count) => (
                    <button key={count} type="button" className={memoryCount === count ? "active" : ""} onClick={() => setMemoryCount(count)}>
                      {count} memories
                    </button>
                  ))}
                </div>
                <div className="nostalgia-form-grid" style={{ marginTop: 24 }}>
                  <label>Time between memories
                    <select name="rhythm" defaultValue="24-hours">
                      <option value="1-hour">Every hour</option>
                      <option value="12-hours">Every 12 hours</option>
                      <option value="24-hours">Once each day</option>
                      <option value="48-hours">Every two days</option>
                    </select>
                  </label>
                  <label>First arrival<input type="datetime-local" name="first-arrival" required /></label>
                </div>
              </section>

              <section className="nostalgia-form-section">
                <div className="nostalgia-form-heading"><span>03</span><h2>The memories</h2></div>
                {memorySuggestions.slice(0, memoryCount).map((suggestion, index) => (
                  <div className="nostalgia-memory-row" key={suggestion}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <select name={`memory-type-${index + 1}`} defaultValue={index === 0 ? "photo" : "text"} aria-label={`Memory type ${index + 1}`}>
                      <option value="photo">Photograph</option>
                      <option value="text">Written memory</option>
                      <option value="voice">Voice note</option>
                      <option value="postcard">Postcard</option>
                      <option value="keepsake">Ticket or keepsake</option>
                    </select>
                    <input name={`memory-${index + 1}`} placeholder={suggestion} required={index === 0} />
                  </div>
                ))}
                <div className="nostalgia-form-grid" style={{ marginTop: 22 }}>
                  <label>Photographs<input type="file" name="photographs" accept="image/*" multiple /></label>
                  <label>Voice notes<input type="file" name="voice-notes" accept="audio/*" multiple /></label>
                </div>
                <p className="nostalgia-form-note">Nothing is invented when a field is left empty. Quiet space is better than a false memory.</p>
              </section>

              <section className="nostalgia-form-section">
                <div className="nostalgia-form-heading"><span>04</span><h2>The letter that remains sealed</h2></div>
                <label>The complete final letter
                  <textarea name="final-letter" rows={10} placeholder="Write what should only be read after every memory has arrived…" required />
                </label>
                <div className="nostalgia-form-grid">
                  <label>Your closing<input name="closing" placeholder="Still remembering," /></label>
                  <label>Recipient timezone
                    <select name="timezone" defaultValue="recipient">
                      <option value="recipient">Use their local time</option>
                      <option value="sender">Use my local time</option>
                    </select>
                  </label>
                </div>
              </section>

              <div className="nostalgia-form-actions">
                <button className="nostalgia-button nostalgia-button-primary" type="submit">Seal the journey</button>
                <small>The final A4 keepsake becomes available only after every memory and the full letter have opened.</small>
              </div>
            </form>
          ) : (
            <section className="nostalgia-create-success">
              <p className="nostalgia-eyebrow">The journey is prepared</p>
              <h2>Something meaningful is now on its way to {recipient}.</h2>
              <p>
                The first memory will open at the chosen time. Every later part remains protected until its own arrival.
              </p>
              <div className="nostalgia-success-ticket">
                <span>Private Intezaar journey</span>
                <strong>{memoryCount} memories · one sealed letter</strong>
              </div>
              <div className="nostalgia-success-actions">
                <Link href={`/receive/demo?name=${encodeURIComponent(recipient)}`} className="nostalgia-button nostalgia-button-primary">See the recipient view</Link>
                <Link href="/journey/demo" className="nostalgia-button nostalgia-button-ghost">View the complete example</Link>
                <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setCreated(false)}>Edit the journey</button>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
