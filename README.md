# 🗳️ ElectionPath AI

ElectionPath AI is a smart, location-aware, and highly interactive civic assistant designed to help Indian citizens navigate the democratic process. It features gamified participation tracking, real-time election countdowns, and deep integration with Google's Gemini AI to provide personalized civic guidance.

## ✨ Key Features

- **📍 Location-Based Election Tracking**: Automatically filters national and state-specific elections based on the user's location.
- **⏳ Dynamic Timelines & Countdowns**: Visualizes election cycles (Upcoming -> Voting -> Completed) with real-time countdowns.
- **🤖 Gemini AI Integration**:
  - **AI Stage Explainer**: Explains what each election stage means and provides immediate action items.
  - **AI Profile Guide**: Analyzes your age, registration status, and location to give you step-by-step personalized voting/registration instructions.
  - **AI Chatbot (`/ask-ai`)**: A dedicated, full-screen interactive chatbot to answer any complex civic questions.
- **📈 Participation Tracker**: A gamified dashboard that tracks the elections you were eligible for vs. the ones you actually voted in.
- **🎨 Premium UI/UX**: Built with a sleek dark mode, glassmorphism aesthetics, dynamic micro-animations, and responsive CSS grids.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend**: React, Custom Vanilla CSS (Glassmorphism design system)
- **Database**: [Firebase Firestore](https://firebase.google.com/) (with an offline-first local data fallback)
- **AI**: Google [Gemini 2.0 Flash REST API](https://aistudio.google.com/)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Nithin7411/ElectionPath.git
cd ElectionPath
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Firebase and Gemini credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Google AI Studio API Key
NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Seed the Database
To populate your Firestore database with realistic Indian election data, run the included seeder script:
```bash
node scripts/seed-firestore.mjs
```
*(Note: If the database is empty or unavailable, the app will gracefully fall back to a local offline dataset).*

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📂 Project Structure

- `/app` - Next.js App Router pages (`/`, `/assistant`, `/election/[id]`, `/ask-ai`)
- `/src/components` - Reusable UI components (`Header`, `Timeline`, `AiExplainer`, `MarkdownRenderer`, etc.)
- `/src/lib` - Core business logic, Firebase initialization, and AI integration services
- `/scripts` - Database seeding utilities

## 🛡️ Security Note
Ensure that your `.env.local` file is never committed to version control. The application is configured to securely fetch the Gemini REST API on the client side using the provided environment variables.

---
Built with ❤️ for Indian Democracy.

## 🧪 Advanced Testing

### Coverage

* Core logic testing
* Edge case validation
* Integration testing (full flow)

### How to Run

```bash
node test.js
```

### Sample Output

✅ Test Passed: Stage Detection
✅ Test Passed: Eligibility
✅ Test Passed: Filtering
✅ Test Passed: Countdown
✅ Passed: Invalid data handling
✅ Full flow passed
