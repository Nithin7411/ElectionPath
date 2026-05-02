import { db } from "./firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const GEMINI_MODEL = "gemini-1.5-flash"; // Free tier stable
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

async function callGemini(prompt, history = []) {
  if (!API_KEY) {
    console.error("Missing Gemini API Key");
    return "AI configuration error.";
  }

  const contents = history.length > 0 ? history : [{ parts: [{ text: prompt }] }];

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "API Error");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my brain. Please try again.";
  }
}

export async function explainStage(election, stage, userState, isFirstTime) {
  const cacheKey = `gemini_${election.id}_${stage}_${isFirstTime}`;
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return cached;
  }

  const prompt = `
ROLE: You are a helpful civic assistant for Indian elections.
CONTEXT:
- User is in ${userState || "India"}
- Election: ${election.name}
- Current stage: ${stage}
- User type: ${isFirstTime ? "beginner" : "experienced"}

TASK: Explain simply:
- What this stage means
- What the user should do right now

OUTPUT: Short explanation (2-3 sentences) + one clear action item. Format it nicely with markdown.
  `;

  const text = await callGemini(prompt);
  if (text && typeof window !== "undefined") {
    sessionStorage.setItem(cacheKey, text);
  }
  return text;
}

export async function getProfileInsights(profile, state) {
  const { birthYear, isFirstTime, isRegistered } = profile;
  
  const cacheKey = `gemini_insights_${state}_${birthYear}_${isFirstTime}_${isRegistered}`;
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return cached;
  }

  const prompt = `
ROLE: You are an expert civic assistant for Indian elections.
CONTEXT:
- User Location: ${state || "India"}
- Birth Year: ${birthYear || "Unknown"}
- First Time Voter: ${isFirstTime ? "Yes" : "No"}
- Voter Registration Status: ${isRegistered ? "Registered" : "Not Registered"}

TASK:
Provide a personalized, step-by-step insight guide for this user's next actions.
- If not registered, tell them exactly how to register in ${state || "their state"} (mention nvsp.in or Voter Helpline App).
- If registered, tell them how to find their nearest polling booth.
- Advise them on any upcoming major elections based on their location.

OUTPUT FORMAT: Use markdown with bullet points and bold text for emphasis. Keep it practical, encouraging, and under 150 words.
  `;

  const text = await callGemini(prompt);
  if (text && typeof window !== "undefined") {
    sessionStorage.setItem(cacheKey, text);
  }
  return text;
}

export async function askChatbot(history, userState) {
  const SYSTEM_PROMPT = `
ROLE: You are 'ElectionPath AI', a production-grade civic assistant.
CONTEXT: User location: ${userState || "India"}.
GOAL: Provide accurate, non-partisan info about Indian elections.
STYLE: Professional, helpful, markdown-enabled.
LIMIT: Do not answer unrelated topics.
  `;

  const formattedHistory = history.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  // Inject system prompt into the context
  if (formattedHistory.length > 0) {
    formattedHistory[0].parts[0].text = `[SYSTEM: ${SYSTEM_PROMPT}]\n\nUser Question: ${formattedHistory[0].parts[0].text}`;
  }

  return await callGemini(null, formattedHistory);
}

// Firestore integration
export async function getElectionsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "elections"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching elections from Firestore:", error);
    return [];
  }
}

export async function getElectionById(id) {
  try {
    const docRef = doc(db, "elections", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching election by ID:", error);
    return null;
  }
}
