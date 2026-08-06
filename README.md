# Intezaar

**A private digital letter that takes a cinematic Indian mail journey before it arrives.**

The product promise is intentionally simple:

> Write a letter. It travels through post offices and railway stations for 3, 5 or 7 days. Then it arrives and can be opened.

## Product hierarchy

1. The letter is the main object.
2. Waiting and arrival create the emotional experience.
3. Indian post and rail provide the visual journey.
4. Up to three photographs, short memories or voice notes are optional extras inside the letter.

There is no long chapter system and no requirement for the recipient to return every day.

## Current routes

- `/` — letter-first Indian mail landing page
- `/create` — four-step sender prototype
- `/journey/demo` — interactive 5-day postal journey preview
- `/receive/demo` — sealed recipient letter and arrival experience
- `/celebrations` — personalised Indian celebration-letter studio

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Current prototype limitations

The current build demonstrates the product language, creation flow, postal route and seal-opening experience. It does not yet:

- store private letters in a production database
- encrypt letter bodies on the server
- collect payment
- create persistent secure recipient links
- upload private media
- calculate journey progress from a trusted server clock

The interface must continue to describe the route as a cinematic or storybook interpretation. It is not physical postage, live GPS or official India Post / Indian Railways tracking.

## Production implementation order

1. Create the database and sender account model.
2. Encrypt letter bodies before persistence.
3. Generate cryptographically random recipient tokens and store only token hashes.
4. Calculate 3, 5 or 7-day journey progress from server UTC time.
5. Add private media uploads with short-lived signed URLs.
6. Integrate Razorpay or Cashfree in test mode.
7. Add sender preview, edit, cancellation and deletion controls.
8. Add reporting, consent and moderation controls.
9. Test mobile performance, printing and reduced-motion accessibility.
10. Deploy to a branded domain.
