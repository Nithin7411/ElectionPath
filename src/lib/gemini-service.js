

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
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
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
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
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

export async function askChatbot(history, userState) {
  const prompt = `
ROLE: You are 'ElectionPath AI', a non-partisan, helpful civic assistant for Indian elections.
CONTEXT: User is located in ${userState || "India"}.
TASK: Answer the user's questions about elections, voting processes, candidates, or civic duties. Be concise, polite, and use markdown formatting for readability. Do not answer questions completely unrelated to civics/elections; politely redirect them.
  `;

  // Format history for REST API (assuming history is an array of { role: 'user' | 'model', text: '...' })
  // The Gemini REST API requires role to be 'user' or 'model'.
  const contents = history.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  // We inject the system prompt into the first message to ensure behavior
  if (contents.length > 0 && contents[0].role === 'user') {
    contents[0].parts[0].text = prompt + "\n\nUser: " + contents[0].parts[0].text;
  } else {
    // Fallback if history is somehow empty (shouldn't happen)
    contents.push({ role: 'user', parts: [{ text: prompt }] });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });
    
    if (!response.ok) throw new Error("REST API Error");
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Chatbot API failed:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
}
