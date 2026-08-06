"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

const occasions = ["Just because", "Birthday", "Anniversary", "Farewell", "Apology", "Wedding", "Celebration"];

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [journeyDays, setJourneyDays] = useState(5);
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("Ananya");
  const [occasion, setOccasion] = useState("Just because");
  const [letter, setLetter] = useState("");
  const [extras, setExtras] = useState(["", "", ""]);
  const [fromCity, setFromCity] = useState("Delhi");
  const [toCity, setToCity] = useState("Kochi");

  const filledExtras = useMemo(() => extras.filter((item) => item.trim()).length, [extras]);
  const canContinue = sender.trim().length > 0 && recipient.trim().length > 0 && letter.trim().length > 0;

  function updateExtra(index: number, value: string) {
    setExtras((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreated(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const recipientLink = `/receive/demo?name=${encodeURIComponent(recipient)}&day=1&duration=${journeyDays}&from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`;
  const arrivalLink = `/receive/demo?name=${encodeURIComponent(recipient)}&day=${journeyDays}&duration=${journeyDays}&from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`;

  return (
    <main className="nostalgia-create">
      <Navigation />
      <section className="nostalgia-create-layout">
        <aside className="nostalgia-create-photo">
          <p className="nostalgia-eyebrow">Write a private letter</p>
          <h1>Post words that deserve more than an instant delivery.</h1>
          <p>
            The letter is the main thing. Photographs, short memories and voice notes are optional pieces carried inside it.
          </p>
        </aside>

        <div className="nostalgia-create-form-wrap">
          {!created ? (
            <form className="nostalgia-form" onSubmit={submit}>
              <p className="nostalgia-form-note">Step {step} of 4 · Four light screens · No long chapter system</p>

              {step === 1 ? (
                <section className="nostalgia-form-section">
                  <div className="nostalgia-form-heading"><span>01</span><h2>Write the letter</h2></div>
                  <div className="nostalgia-form-grid">
                    <label>Your name<input value={sender} onChange={(event) => setSender(event.target.value)} placeholder="Arjun" autoComplete="name" /></label>
                    <label>Their name<input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Ananya" required /></label>
                  </div>
                  <label>Occasion
                    <select value={occasion} onChange={(event) => setOccasion(event.target.value)}>
                      {occasions.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label>Your letter
                    <textarea value={letter} onChange={(event) => setLetter(event.target.value)} rows={12} placeholder="Dear Ananya, I could have sent this in a second. I wanted it to take its time…" required />
                  </label>
                  <p className="nostalgia-form-note">This is what the recipient ultimately waits to open.</p>
                  <div className="nostalgia-form-actions">
                    <button className="nostalgia-button nostalgia-button-primary" type="button" disabled={!canContinue} onClick={() => setStep(2)}>Continue to optional extras</button>
                  </div>
                </section>
              ) : null}

              {step === 2 ? (
                <section className="nostalgia-form-section">
                  <div className="nostalgia-form-heading"><span>02</span><h2>Optional things inside</h2></div>
                  <p className="nostalgia-form-note">Add up to three small extras, or skip this screen completely. They support the letter; they do not replace it.</p>
                  {extras.map((extra, index) => (
                    <div className="nostalgia-memory-row" key={index}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <select aria-label={`Optional extra ${index + 1} type`} defaultValue={index === 0 ? "photo" : index === 1 ? "memory" : "voice"}>
                        <option value="photo">Photograph</option>
                        <option value="memory">Short memory</option>
                        <option value="voice">Voice note</option>
                      </select>
                      <input value={extra} onChange={(event) => updateExtra(index, event.target.value)} placeholder="A short caption or note about this extra" />
                    </div>
                  ))}
                  <div className="nostalgia-form-grid" style={{ marginTop: 22 }}>
                    <label>Optional photos<input type="file" accept="image/*" multiple /></label>
                    <label>Optional voice notes<input type="file" accept="audio/*" multiple /></label>
                  </div>
                  <div className="nostalgia-form-actions">
                    <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(1)}>Back</button>
                    <button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(3)}>{filledExtras ? `Continue with ${filledExtras} extras` : "Skip extras"}</button>
                  </div>
                </section>
              ) : null}

              {step === 3 ? (
                <section className="nostalgia-form-section">
                  <div className="nostalgia-form-heading"><span>03</span><h2>Choose the postal journey</h2></div>
                  <label>How many days should the letter travel?</label>
                  <div className="nostalgia-length-options" role="group" aria-label="Journey length">
                    {[3, 5, 7].map((count) => (
                      <button key={count} type="button" className={journeyDays === count ? "active" : ""} onClick={() => setJourneyDays(count)}>
                        {count} days
                      </button>
                    ))}
                  </div>
                  <div className="nostalgia-form-grid" style={{ marginTop: 24 }}>
                    <label>Posted from<input value={fromCity} onChange={(event) => setFromCity(event.target.value)} placeholder="Delhi" /></label>
                    <label>Arriving in<input value={toCity} onChange={(event) => setToCity(event.target.value)} placeholder="Kochi" /></label>
                  </div>
                  <p className="nostalgia-form-note">The route is a cinematic Indian mail interpretation, not physical postage or live GPS tracking.</p>
                  <div className="nostalgia-form-actions">
                    <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(2)}>Back</button>
                    <button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(4)}>Review the letter</button>
                  </div>
                </section>
              ) : null}

              {step === 4 ? (
                <section className="nostalgia-form-section">
                  <div className="nostalgia-form-heading"><span>04</span><h2>Review and seal</h2></div>
                  <div className="nostalgia-success-ticket">
                    <span>Private Intezaar letter</span>
                    <strong>{fromCity || "Delhi"} → {toCity || "Kochi"} · {journeyDays} days</strong>
                  </div>
                  <p><strong>From:</strong> {sender}</p>
                  <p><strong>For:</strong> {recipient}</p>
                  <p><strong>Occasion:</strong> {occasion}</p>
                  <p><strong>Optional extras:</strong> {filledExtras || "None"}</p>
                  <label>Letter preview<textarea value={letter} onChange={(event) => setLetter(event.target.value)} rows={10} /></label>
                  <p className="nostalgia-form-note">Prototype only: no payment is collected and nothing is uploaded to a private server yet. Review every word before creating the demo link.</p>
                  <div className="nostalgia-form-actions">
                    <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(3)}>Back</button>
                    <button className="nostalgia-button nostalgia-button-primary" type="submit">Seal letter and create demo link</button>
                  </div>
                </section>
              ) : null}
            </form>
          ) : (
            <section className="nostalgia-create-success">
              <p className="nostalgia-eyebrow">The private preview is ready</p>
              <h2>Your sealed letter is prepared for {recipient}.</h2>
              <p>
                In this prototype the route is simulated in the browser. A production version will create a secure private link only after payment and server-side storage are connected.
              </p>
              <div className="nostalgia-success-ticket">
                <span>Intezaar mail · {fromCity} to {toCity}</span>
                <strong>{journeyDays}-day journey · {filledExtras} optional extras</strong>
              </div>
              <div className="nostalgia-success-actions">
                <Link href={recipientLink} className="nostalgia-button nostalgia-button-primary">Open the recipient link</Link>
                <Link href={arrivalLink} className="nostalgia-button nostalgia-button-ghost">Preview arrival day</Link>
                <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => { setCreated(false); setStep(1); }}>Edit the letter</button>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
