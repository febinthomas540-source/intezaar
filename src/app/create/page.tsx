"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { allRouteCities, routeCorridors } from "@/lib/routes";

export default function CreatePage() {
  const [created, setCreated] = useState(false);
  const [routeId, setRouteId] = useState(routeCorridors[0].id);
  const selectedRoute = useMemo(
    () => routeCorridors.find((route) => route.id === routeId) ?? routeCorridors[0],
    [routeId],
  );
  const [origin, setOrigin] = useState(selectedRoute.origin);
  const [destination, setDestination] = useState(selectedRoute.destination);
  const [recipient, setRecipient] = useState("Ananya");

  function chooseRoute(id: string) {
    const route = routeCorridors.find((item) => item.id === id);
    if (!route) return;
    setRouteId(route.id);
    setOrigin(route.origin);
    setDestination(route.destination);
  }

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
          <h1>Choose the road your words will remember.</h1>
          <p>
            Start with a real postal corridor, then add the people, details and old objects only the two of you understand.
          </p>
          <div className="creator-preview-card">
            <div className="creator-preview-sky" />
            <div className="creator-preview-envelope"><i /><b>{selectedRoute.accent}</b></div>
            <span>{origin}</span><strong>→</strong><span>{destination}</span>
          </div>
        </div>

        {!created ? (
          <form className="letter-form" onSubmit={submit}>
            <div className="form-step"><span>01</span><h2>Choose a postal corridor</h2></div>

            <div className="corridor-picker">
              <div>
                <div>
                  <h3>Curated routes</h3>
                  <p>Each corridor has its own pace, transport and regional memories.</p>
                </div>
              </div>
              <div className="corridor-grid">
                {routeCorridors.map((route) => (
                  <button
                    key={route.id}
                    type="button"
                    className={`corridor-card ${route.id === selectedRoute.id ? "active" : ""}`}
                    onClick={() => chooseRoute(route.id)}
                    aria-pressed={route.id === selectedRoute.id}
                  >
                    <span>{route.accent}</span>
                    <strong>{route.name}</strong>
                    <small>{route.strapline}</small>
                  </button>
                ))}
              </div>
            </div>

            <section className="corridor-detail" aria-live="polite">
              <div className="corridor-detail-head">
                <div>
                  <h3>{selectedRoute.name}</h3>
                  <p>{selectedRoute.strapline}</p>
                </div>
                <span className="corridor-duration">{selectedRoute.duration}</span>
              </div>
              <div className="corridor-stops">
                {selectedRoute.stops.map((stop) => <span className="corridor-stop" key={stop}>{stop}</span>)}
              </div>
              <div className="corridor-meta">
                <div><span>Atmosphere</span><strong>{selectedRoute.tone}</strong></div>
                <div><span>Carried by</span><strong>{selectedRoute.transport}</strong></div>
              </div>
            </section>

            <p className="custom-route-note">You can keep the route or customise its first and final stop.</p>
            <div className="form-grid">
              <label>Leaving from
                <select name="origin" value={origin} onChange={(event) => setOrigin(event.target.value)} required>
                  {allRouteCities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>
              <label>Travelling to
                <select name="destination" value={destination} onChange={(event) => setDestination(event.target.value)} required>
                  {allRouteCities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>
            </div>
            <label>Arrival moment<input type="datetime-local" name="arrival" required /></label>

            <div className="form-step"><span>02</span><h2>The feeling</h2></div>
            <div className="form-grid">
              <label>Journey rhythm
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
            <div className="form-grid">
              <label>Postman voice
                <select name="postman" defaultValue="warm">
                  <option value="warm">Warm and trustworthy</option>
                  <option value="playful">Gentle and teasing</option>
                  <option value="poetic">Quiet and poetic</option>
                </select>
              </label>
              <label>Mystery
                <select name="mystery" defaultValue="clues">
                  <option value="none">Reveal the sender immediately</option>
                  <option value="clues">Reveal small clues</option>
                  <option value="secret">Keep the sender secret until arrival</option>
                </select>
              </label>
            </div>

            <div className="form-step"><span>03</span><h2>The people and the letter</h2></div>
            <div className="form-grid">
              <label>Your name<input name="sender" placeholder="Arjun" required /></label>
              <label>Their name<input name="recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Ananya" required /></label>
            </div>
            <label>The final letter<textarea name="message" rows={8} placeholder="Write what an ordinary message could never hold…" required /></label>
            <label>A memory only both of you understand<input name="private-memory" placeholder="The rainy bus stop, the burnt tea, that missed train…" /></label>
            <div className="form-grid">
              <label>A song or sound<input name="song" placeholder="A song, film dialogue or familiar sound" /></label>
              <label>A private word<input name="nickname" placeholder="A nickname, joke or phrase" /></label>
            </div>

            <div className="form-step"><span>04</span><h2>The old objects</h2></div>
            <div className="form-grid">
              <label>A date that still means something<input type="date" name="memory-date" /></label>
              <label>What happened that day?<input name="date-caption" placeholder="The five-minute call that lasted until sunrise" /></label>
            </div>
            <label>An old message fragment<textarea name="old-message" rows={3} placeholder="A real SMS, diary line, email subject or sentence you nearly deleted…" /></label>
            <div className="form-grid">
              <label>How should it appear?
                <select name="artifact" defaultValue="inland-letter">
                  <option value="old-sms">Old phone message</option>
                  <option value="diary">Diary or notebook page</option>
                  <option value="bus-ticket">Bus or train ticket</option>
                  <option value="cinema-ticket">Cinema ticket</option>
                  <option value="cassette">Cassette label</option>
                  <option value="postcard">Postcard</option>
                  <option value="inland-letter">Indian inland letter</option>
                </select>
              </label>
              <label>A place-specific detail<input name="regional-detail" placeholder="Railway chai, KSRTC ticket, bakery cover…" /></label>
            </div>
            <div className="form-grid">
              <label>Optional photograph<input type="file" name="photograph" accept="image/*" /></label>
              <label>Optional voice note<input type="file" name="voice-note" accept="audio/*" /></label>
            </div>
            <p className="form-note">Only add what feels true. Empty fields create quiet space rather than invented memories.</p>

            <div className="form-actions">
              <button className="button button-primary" type="submit">Seal the memory journey</button>
              <span>The recipient returns for a story, not a streak.</span>
            </div>
          </form>
        ) : (
          <div className="creation-success">
            <div className="success-seal">{selectedRoute.accent}</div>
            <p className="eyebrow">Sealed for {recipient}</p>
            <h2>The route has been booked.</h2>
            <div className="creation-route-ticket">
              <small>{selectedRoute.name}</small>
              <strong>{origin} → {destination}</strong>
              <p>{selectedRoute.transport}</p>
              <div>{selectedRoute.stops.map((stop) => <span key={stop}>{stop}</span>)}</div>
            </div>
            <Link href={`/receive/demo?name=${encodeURIComponent(recipient)}`} className="button button-primary">See what {recipient} receives</Link>
            <Link href="/journey/demo" className="text-button">Skip to the full journey</Link>
            <button className="text-button" onClick={() => setCreated(false)}>Edit the memories</button>
          </div>
        )}
      </section>
    </main>
  );
}
