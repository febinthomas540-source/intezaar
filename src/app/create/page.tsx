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
          <p className="eyebrow">Create a private memory journey</p>
          <h1>What should travel with your words?</h1>
          <p>
            Give us the small details only the two of you understand. Intezaar turns them into
            postcards, traces and fragments that appear slowly before the final letter arrives.
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
              <label>Journey length
                <select name="pace" defaultValue="story">
                  <option value="short">A brief wait · 1–2 days</option>
                  <option value="story">A slow story · 3–5 days</option>
                  <option value="epic">A long return · 7–10 days</option>
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

            <div className="form-step"><span>02</span><h2>The feeling</h2></div>
            <div className="form-grid">
              <label>Postman voice
                <select name="postman" defaultValue="warm">
                  <option value="warm">Warm and trustworthy</option>
                  <option value="playful">Gentle and teasing</option>
                  <option value="poetic">Quiet and poetic</option>
                </select>
              </label>
              <label>Reveal rhythm
                <select name="reveal" defaultValue="daily">
                  <option value="gentle">Gentle · a few meaningful fragments</option>
                  <option value="daily">Daily · one memory each day</option>
                  <option value="deep">Deep nostalgia · memories, voice and photographs</option>
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
                  <option value="monsoon">Monsoon memories</option>
                  <option value="midnight">Midnight conversations</option>
                  <option value="golden">Golden old photographs</option>
                  <option value="homecoming">A journey home</option>
                </select>
              </label>
            </div>

            <div className="form-step"><span>03</span><h2>The people</h2></div>
            <div className="form-grid">
              <label>Your name<input name="sender" placeholder="Arjun" required /></label>
              <label>Their name
                <input name="recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Ananya" required />
              </label>
            </div>

            <div className="form-step"><span>04</span><h2>The memories</h2></div>
            <label>The final letter<textarea name="message" rows={8} placeholder="Write what an ordinary message could never hold…" required /></label>
            <label>A memory only both of you understand<input name="private-memory" placeholder="The rainy bus stop, the burnt tea, that missed train…" /></label>
            <div className="form-grid">
              <label>A song or sound<input name="song" placeholder="A song, film dialogue or voice-note moment" /></label>
              <label>A private word<input name="nickname" placeholder="A nickname, joke or phrase" /></label>
            </div>
            <label>One ordinary moment you never want to forget<textarea name="ordinary-moment" rows={4} placeholder="It does not need to sound poetic. The smallest details are usually the strongest." /></label>
            <label>Caption for a photograph<input name="photo-caption" placeholder="For example: We were tired, late and completely happy." /></label>

            <div className="form-actions">
              <button className="button button-primary" type="submit">Seal the memory journey</button>
              <span>The recipient never has to complete a game. They simply return when they miss the story.</span>
            </div>
          </form>
        ) : (
          <div className="creation-success">
            <div className="success-seal">I</div>
            <p className="eyebrow">Sealed for {recipient}</p>
            <h2>Something remembered is ready to travel.</h2>
            <p>A private journey from {origin} to {destination} has been prepared from your words and memories.</p>
            <Link href="/journey/demo" className="button button-primary">Enter the journey</Link>
            <button className="text-button" onClick={() => setCreated(false)}>Edit the memories</button>
          </div>
        )}
      </section>
    </main>
  );
}
