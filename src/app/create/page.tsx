"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

const cities = [
  "Ahmedabad",
  "Alappuzha",
  "Bengaluru",
  "Bhopal",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Delhi",
  "Goa",
  "Guwahati",
  "Hyderabad",
  "Jaipur",
  "Kochi",
  "Kolkata",
  "Kozhikode",
  "Lucknow",
  "Mangaluru",
  "Mumbai",
  "Pune",
  "Thiruvananthapuram",
];

export default function CreatePage() {
  const [created, setCreated] = useState(false);
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("Kochi");
  const [recipient, setRecipient] = useState("Ananya");

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
            Choose the route, waiting game and personality of the postman who will carry your
            letter. Every journey remains private and opens only at the promised moment.
          </p>
          <div className="creator-preview-card">
            <div className="creator-preview-sky" />
            <div className="creator-preview-envelope"><i /><b>I</b></div>
            <span>{origin}</span><strong>→</strong><span>{destination}</span>
          </div>
        </div>

        {!created ? (
          <form className="letter-form" onSubmit={submit}>
            <div className="form-step"><span>01</span><h2>The journey</h2></div>
            <div className="form-grid">
              <label>Leaving from
                <select name="origin" value={origin} onChange={(event) => setOrigin(event.target.value)} required>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>
              <label>Travelling to
                <select name="destination" value={destination} onChange={(event) => setDestination(event.target.value)} required>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>
            </div>
            <label>Arrival moment<input type="datetime-local" name="arrival" required /></label>
            <div className="form-grid">
              <label>Journey pace
                <select name="pace" defaultValue="story">
                  <option value="short">Quick journey · 1–2 days</option>
                  <option value="story">Story journey · 3–5 days</option>
                  <option value="epic">Epic journey · 7–10 days</option>
                </select>
              </label>
              <label>Occasion
                <select name="occasion" defaultValue="birthday">
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="farewell">Farewell</option>
                  <option value="proposal">Proposal</option>
                  <option value="apology">Apology</option>
                  <option value="just-because">Just because</option>
                </select>
              </label>
            </div>

            <div className="form-step"><span>02</span><h2>The waiting game</h2></div>
            <div className="form-grid">
              <label>Postman personality
                <select name="postman" defaultValue="warm">
                  <option value="warm">Warm and trustworthy</option>
                  <option value="playful">Playful and teasing</option>
                  <option value="poetic">Quiet and poetic</option>
                </select>
              </label>
              <label>Activity level
                <select name="activity" defaultValue="daily">
                  <option value="light">Light · two activities</option>
                  <option value="daily">Daily · one per chapter</option>
                  <option value="adventure">Adventure · activities and route choices</option>
                </select>
              </label>
            </div>
            <div className="form-grid">
              <label>Mystery level
                <select name="mystery" defaultValue="clues">
                  <option value="none">Reveal the sender immediately</option>
                  <option value="clues">Reveal small clues</option>
                  <option value="secret">Keep the sender secret until arrival</option>
                </select>
              </label>
              <label>Journey mood
                <select name="mood" defaultValue="monsoon">
                  <option value="monsoon">Monsoon romance</option>
                  <option value="midnight">Midnight postal</option>
                  <option value="golden">Golden nostalgia</option>
                  <option value="festival">Festival journey</option>
                </select>
              </label>
            </div>

            <div className="form-step"><span>03</span><h2>The people</h2></div>
            <div className="form-grid">
              <label>Your name<input name="sender" placeholder="Arjun" required /></label>
              <label>Their name
                <input
                  name="recipient"
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  placeholder="Ananya"
                  required
                />
              </label>
            </div>

            <div className="form-step"><span>04</span><h2>The letter</h2></div>
            <label>Your words<textarea name="message" rows={7} placeholder="Write what deserves to travel..." required /></label>
            <label>First clue for the recipient<input name="clue" placeholder="For example: We first met in the rain." /></label>
            <div className="form-actions">
              <button className="button button-primary" type="submit">Seal and preview</button>
              <span>This concept build creates a visual preview; secure delivery comes next.</span>
            </div>
          </form>
        ) : (
          <div className="creation-success">
            <div className="success-seal">I</div>
            <p className="eyebrow">Sealed for {recipient}</p>
            <h2>Your letter is ready to travel.</h2>
            <p>A cinematic journey from {origin} to {destination} has been prepared.</p>
            <Link href="/journey/demo" className="button button-primary">Enter the waiting game</Link>
            <button className="text-button" onClick={() => setCreated(false)}>Edit the letter</button>
          </div>
        )}
      </section>
    </main>
  );
}
