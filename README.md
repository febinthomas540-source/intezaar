# Intezaar

**A private digital letter that takes a cinematic Indian mail journey before it arrives.**

> Write a letter. It travels through post offices and railway stations for 3, 5 or 7 days. Then it arrives and can be opened.

## Product hierarchy

1. The letter is the main object.
2. Waiting and arrival create the emotional experience.
3. Indian post and rail provide the visual journey.
4. Photos, voice notes and one short video are optional elements inside the letter.

There is no chapter system and no requirement for the recipient to return every day.

## Creation flow

1. **Write** — sender, recipient, occasion, opening, letter and closing.
2. **Personalise** — choose from ten editable formats and add up to three optional media items.
3. **Journey** — choose 3, 5 or 7 days and set the origin and destination cities.
4. **Arrival & payment** — choose the opening time and review the clearly labelled prototype checkout.
5. **Share** — copy or share the private recipient link.

## Current routes

- `/` — letter-first Indian mail landing page
- `/create` — complete five-step sender prototype
- `/celebrations` — personalised Indian celebration-letter studio
- `/journey/demo` — non-indexed interactive postal journey preview
- `/receive/demo` — non-indexed sealed recipient letter and arrival experience

## Active source structure

- `src/app` — App Router pages, metadata and the live visual styles
- `src/components/hero-journey.tsx` — homepage posting and railway scene
- `src/components/letter-opening.tsx` — arrival and wax-seal interaction
- `src/components/postal-letter-prototype.tsx` — recipient journey demo
- `src/components/celebration-studio.tsx` — celebration-letter drafting experience
- `src/components/navigation.tsx` — shared navigation

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Current prototype limitations

The current build does not yet:

- store or encrypt private letters on a server
- persist uploaded photos, audio or video after the browser session
- transfer sender content into the recipient link
- collect payment
- create cryptographically private recipient tokens
- calculate progress from a trusted server clock

The route is a cinematic interpretation. It is not physical postage, live GPS, official India Post tracking or official Indian Railways tracking.

## Production implementation order

1. Add authenticated sender drafts and encrypted letter storage.
2. Add private media uploads with validation, compression and signed delivery URLs.
3. Generate random recipient tokens and store only token hashes.
4. Calculate journey and unlock status from server UTC time.
5. Connect a payment provider in test mode.
6. Add sender edit, cancellation and deletion controls.
7. Add reporting, consent, moderation and retention controls.
8. Test mobile performance, accessibility, printing and reduced motion.
9. Move to a branded production domain.
