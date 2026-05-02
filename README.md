# ElectionPath AI

A **smart election guide** built with **Next.js** + **Firebase** — detects user location, shows relevant elections, explains timelines, checks eligibility, tracks participation, and provides step-by-step guidance. Uses a deterministic logic engine with AI (Firebase AI / Gemini) only for explanations.

## Architecture

```text
User → Next.js Frontend → Logic Engine → Firestore / Local Data
                  ↓
         Firebase AI (Gemini 3 Flash)
```

- **Framework**: Next.js 15 (App Router)
- **AI Integration**: Firebase AI SDK (`firebase/ai` → `GoogleAIBackend`)
- **Data Source**: Firestore + Local fallback toggle
- **Styling**: Vanilla CSS (CSS Variables, Grid, Flexbox)

## Project Structure

```text
src/
├── app/                  # Next.js App Router
│   ├── layout.js         # Root layout
│   ├── page.js           # Home Dashboard
│   └── globals.css       # Design System
├── components/           # UI Components
├── lib/                  # Core Logic & Services
│   ├── firebase.js       # Firebase initialization
│   ├── data-service.js   # Firestore & Local data layer
│   ├── logic-engine.js   # Election filtering and state logic
│   └── gemini-service.js # AI Explanation service
scripts/
└── seed-firestore.mjs    # Script to populate Firestore
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Configuration**
   The project uses Firebase. Ensure your `firebase.js` contains your configuration, and verify that **AI Logic** (Gemini Developer API) is enabled in your Firebase Console under **AI Services > AI Logic**.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Seed Firestore** (Optional, if you want to use the database instead of local fallback)
   ```bash
   node scripts/seed-firestore.mjs
   ```

## Implementation Plan Reference

For the detailed original plan regarding component specifications, logic definitions, and UI design goals, refer to the `implementation_plan.md` artifact generated during setup.
