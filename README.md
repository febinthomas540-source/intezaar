# Intezaar

**An emotional delivery platform where messages travel before they arrive.**

This repository contains the first production-style product foundation:

- cinematic landing experience
- sender composition flow
- five-stage Delhi-to-Kerala journey demo
- animated regional atmospheres
- changing daily clue system
- interactive wax-seal opening ritual
- production-oriented PostgreSQL/Supabase schema
- standalone zero-install HTML prototype

## Run the Next.js application

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Open the standalone prototype

Open `static-demo/index.html` directly in a modern browser. It has no build step and no external dependencies.

## Product routes

- `/` — cinematic product landing page
- `/create` — sender creation experience
- `/journey/demo` — interactive journey and opening demo

## Current scope

This build proves the visual and emotional product direction. The create form is a front-end demonstration and does not yet save private letters or collect payment.

## Production implementation order

1. Create Supabase project and apply `supabase/schema.sql`.
2. Add server-only encryption for letter bodies.
3. Generate a cryptographically random recipient token; store only its hash.
4. Build a server route that returns the current journey chapter based on server UTC time.
5. Add private media uploads with short-lived signed URLs.
6. Integrate Razorpay or Cashfree in test mode.
7. Add sender authentication and dashboard.
8. Add reporting, deletion and moderation controls.
9. Test mobile performance and reduced-motion accessibility.
10. Deploy to a branded domain.

Journey scenes are storybook interpretations. Never describe them as literal GPS or postal tracking.
