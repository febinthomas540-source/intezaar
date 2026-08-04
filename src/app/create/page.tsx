"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default function CreatePage() {
  const [created, setCreated] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreated(true);
  }

  return (
    <main className="creator-page">
      <Navigation />
      <section className="creator-layout">
        <div className="creator-intro">
          <p className="eyebrow">Create a private journey</p>
          <h1>Where should your words begin?</h1>
          <p>
            This first build demonstrates the complete creation direction. Payment, private storage
            and actual delivery will connect after the experience is approved.
          </p>
          <div className="creator-preview-card">
            <div className="creator-preview-sky" />
            <div className="creator-preview-envelope"><i /><b>I</b></div>
            <span>Delhi</span><strong>→</strong><span>Kerala</span>
          </div>
        </div>

        {!created ? (
          <form className="letter-form" onSubmit={submit}>
            <div className="form-step"><span>01</span><h2>The journey</h2></div>
            <div className="form-grid">
              <label>Leaving from<input name="origin" defaultValue="Delhi" required /></label>
              <label>Travelling to<input name="destination" defaultValue="Kerala" required /></label>
            </div>
            <label>Arrival moment<input type="datetime-local" name="arrival" required /></label>
            <label>Occasion
              <select name="occasion" defaultValue="birthday">
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="farewell">Farewell</option>
                <option value="just-because">Just because</option>
              </select>
            </label>
            <div className="form-step"><span>02</span><h2>The people</h2></div>
            <div className="form-grid">
              <label>Your name<input name="sender" placeholder="Arjun" required /></label>
              <label>Their name<input name="recipient" placeholder="Ananya" required /></label>
            </div>
            <div className="form-step"><span>03</span><h2>The letter</h2></div>
            <label>Your words<textarea name="message" rows={7} placeholder="Write what deserves to travel..." required /></label>
            <div className="form-actions">
              <button className="button button-primary" type="submit">Seal and preview</button>
              <span>Nothing is sent from this concept build.</span>
            </div>
          </form>
        ) : (
          <div className="creation-success">
            <div className="success-seal">I</div>
            <p className="eyebrow">Sealed for preview</p>
            <h2>Your letter is ready to travel.</h2>
            <p>The first cinematic Delhi-to-Kerala journey has been generated.</p>
            <Link href="/journey/demo" className="button button-primary">Watch the journey</Link>
            <button className="text-button" onClick={() => setCreated(false)}>Edit the letter</button>
          </div>
        )}
      </section>
    </main>
  );
}
