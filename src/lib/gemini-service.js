import { ai } from "./firebase";
import { getGenerativeModel } from "firebase/ai";

export async function explainStage(election, stage, userState, isFirstTime) {
  // Check cache
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

  try {
    // Attempt standard REST API as fallback since Firebase AI has quota limits on the Free Plan
    const apiKey = "AIzaSyA5Ab8vSG2Q472_5NL1-ztxX5qdDm-_IPA"; // from config
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) throw new Error("REST API Error");
    
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(cacheKey, text);
    }
    return text;
  } catch (error) {
    console.error("All fallback mechanisms failed:", error);
    return "We couldn't generate an explanation right now. " + 
           (stage === "Upcoming" ? "Make sure you are registered to vote." : "Follow standard election guidelines.");
  }
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

  try {
    const apiKey = "AIzaSyA5Ab8vSG2Q472_5NL1-ztxX5qdDm-_IPA"; // from config
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) throw new Error("REST API Error");
    
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(cacheKey, text);
    }
    return text;
  } catch (error) {
    console.error("All fallback mechanisms failed for insights:", error);
    return "We couldn't generate personalized insights right now. Please check your voter registration status at nvsp.in.";
  }
}
