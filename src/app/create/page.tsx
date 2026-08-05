"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { RaahiBird } from "@/components/raahi-bird";

const landingTemplates = [
  ["First rooftop", "Photograph"],
  ["Clock tower", "Postcard or note"],
  ["Monsoon tree", "Voice note"],
  ["Riverside wall", "Ticket or keepsake"],
  ["Warm window", "Final clue"],
  ["Old balcony", "Photograph or message"],
  ["Home", "Sealed letter"],
];

export default function CreatePage() {
  const [created, setCreated] = useState(false);
  const [landingCount, setLandingCount] = useState(5);
  const [recipient, setRecipient] = useState("Ananya");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreated(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="raahi-create-page">
      <Navigation />
      <section className="raahi-create-layout">
        <aside className="raahi-create-intro">
          <p className="raahi-kicker">Prepare Raahi’s journey</p>
          <h1>Pack one honest memory into every landing.</h1>
          <p>
            Photographs, voices, small objects and private words arrive one at a time. The complete letter remains sealed until the final day.
          </p>
          <div className="raahi-create-preview">
            <svg className="preview-path" viewBox="0 0 500 350" preserveAspectRatio="none" aria-hidden="true">
              <path d="M30 290 C115 30 290 55 315 190 C340 320 420 300 475 40" />
            </svg>
            <RaahiBird className="preview-bird" label="Raahi carrying the sender’s memories" />
            <div className="raahi-preview-status">
              <small>{landingCount} daily landings</small>
              <strong>One final letter for {recipient || "someone special"}</strong>
            </div>
          </div>
        </aside>

        {!created ? (
          <form className="raahi-creator-form" onSubmit={submit}>
            <div className="raahi-form-step"><span>01</span><h2>The two people</h2></div>
            <div className="raahi-form-grid">
              <label>Your name<input name="sender" placeholder="Arjun" required /></label>
              <label>Their name<input name="recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Ananya" required /></label>
            </div>
            <div className="raahi-form-grid">
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
              <label>Keep the sender…
                <select name="identity" defaultValue="visible">
                  <option value="visible">Visible from the beginning</option>
                  <option value="clues">Hidden behind small clues</option>
                  <option value="final">Secret until the final letter</option>
                </select>
              </label>
            </div>

            <div className="raahi-form-step"><span>02</span><h2>The pace of the journey</h2></div>
            <label>How many landings should Raahi make?</label>
            <div className="raahi-choice-row" role="group" aria-label="Journey length">
              {[3, 5, 7].map((count) => (
                <button key={count} type="button" className={landingCount === count ? "active" : ""} onClick={() => setLandingCount(count)}>
                  {count} memories
                </button>
              ))}
            </div>
            <div className="raahi-form-grid" style={{ marginTop: 18 }}>
              <label>Time between landings
                <select name="rhythm" defaultValue="24-hours">
                  <option value="1-hour">Every hour</option>
                  <option value="12-hours">Every 12 hours</option>
                  <option value="24-hours">Once each day</option>
                  <option value="48-hours">Every two days</option>
                </select>
              </label>
              <label>First arrival<input type="datetime-local" name="first-arrival" required /></label>
            </div>

            <div className="raahi-form-step"><span>03</span><h2>What Raahi leaves behind</h2></div>
            <div className="raahi-memory-builder">
              {landingTemplates.slice(0, landingCount).map(([place, suggestion], index) => (
                <div className="raahi-memory-row" key={`${place}-${index}`}>
                  <span>{index + 1}</span>
                  <select name={`memory-type-${index + 1}`} defaultValue={index === landingCount - 1 ? "letter-clue" : "memory"} aria-label={`Memory type for landing ${index + 1}`}>
                    <option value="memory">{suggestion}</option>
                    <option value="photo">Photograph</option>
                    <option value="text">Written memory</option>
                    <option value="voice">Voice note</option>
                    <option value="postcard">Postcard</option>
                    <option value="keepsake">Ticket or keepsake</option>
                    <option value="letter-clue">Clue to the final letter</option>
                  </select>
                  <input name={`memory-${index + 1}`} placeholder={`${place}: write the caption or memory here…`} required={index === 0} />
                </div>
              ))}
            </div>
            <div className="raahi-form-grid" style={{ marginTop: 18 }}>
              <label>Upload photographs<input type="file" name="photographs" accept="image/*" multiple /></label>
              <label>Upload voice notes<input type="file" name="voice-notes" accept="audio/*" multiple /></label>
            </div>
            <p className="raahi-form-note">Only add what is true. Empty spectacle is never more valuable than a small real memory.</p>

            <div className="raahi-form-step"><span>04</span><h2>The letter Raahi protects</h2></div>
            <label>The complete final letter
              <textarea name="final-letter" rows={10} placeholder="Write what should remain sealed until the last landing…" required />
            </label>
            <div className="raahi-form-grid">
              <label>A private closing<input name="closing" placeholder="Still remembering," /></label>
              <label>Recipient timezone
                <select name="timezone" defaultValue="recipient">
                  <option value="recipient">Use the recipient’s local timezone</option>
                  <option value="sender">Use my timezone</option>
                </select>
              </label>
            </div>

            <div className="raahi-form-actions">
              <button className="raahi-button raahi-button-primary" type="submit">Entrust the journey to Raahi</button>
              <small>The final PDF unlocks only after every memory and the sealed letter are opened.</small>
            </div>
          </form>
        ) : (
          <div className="raahi-create-success">
            <RaahiBird className="success-bird" label="Raahi ready to begin the journey" />
            <p className="raahi-kicker">The journey is prepared</p>
            <h2>Raahi is ready to fly to {recipient}.</h2>
            <p>The first landing will open at the chosen time. Every later memory remains protected until its own arrival.</p>
            <div className="raahi-success-ticket">
              <span>Private Intezaar journey</span>
              <strong>{landingCount} landings · one sealed letter</strong>
              <p>Default pace: one landing every day</p>
            </div>
            <div className="raahi-success-actions">
              <Link href={`/receive/demo?name=${encodeURIComponent(recipient)}`} className="raahi-button raahi-button-primary">See what {recipient} receives</Link>
              <Link href="/journey/demo" className="raahi-button raahi-button-secondary">View the full example</Link>
              <button className="raahi-button raahi-button-secondary" type="button" onClick={() => setCreated(false)}>Edit the journey</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
