# Adhitech Website

A Vite + React website for Adhitech Advertising Technology Pvt. Ltd.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

1. Extract this folder.
2. Open a terminal in `Adhitech-Website-Updated`.
3. Run:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The production output is written to `dist/`.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

The included `vercel.json` supports the client-side React Router routes.

## Before publishing

- Confirm the phone number, email, address and business hours in `src/data/company.js`.
- Confirm project names, captions and image choices in `src/data/gallery.js`.
- Replace any temporary/old photographs with approved, high-resolution factory and project images.
- Test the enquiry links, WhatsApp links, mobile navigation and all routes on a phone.
- Add a real social-sharing/OG image if the preferred hero image changes.

## Design direction

The visual system uses warm off-white surfaces, graphite/dark sections and a restrained signal-red accent. The intention is to make the business feel like a capable, established manufacturer: clear typography, strong real-world imagery, purposeful motion and direct enquiry paths.
