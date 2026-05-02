import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyA5Ab8vSG2Q472_5NL1-ztxX5qdDm-_IPA",
  authDomain: "electionpath-123.firebaseapp.com",
  projectId: "electionpath-123",
  storageBucket: "electionpath-123.firebasestorage.app",
  messagingSenderId: "464003864218",
  appId: "1:464003864218:web:b8a8bec5750722386f3123"
};

// Initialize Firebase only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Firebase AI with Gemini Developer API
let ai;
try {
  ai = getAI(app, { backend: new GoogleAIBackend() });
} catch (error) {
  console.warn("Firebase AI could not be initialized:", error);
}

export { ai };
