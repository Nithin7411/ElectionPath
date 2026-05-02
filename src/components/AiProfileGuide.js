"use client";
import { useState, useEffect } from "react";
import { getProfileInsights } from "@/lib/gemini-service";
import MarkdownRenderer from "./MarkdownRenderer";

export default function AiProfileGuide({ profile }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("");

  useEffect(() => {
    const savedState = localStorage.getItem("electionpath_state");
    if (savedState) {
      setState(savedState);
    }
  }, []);

  const handleGetInsights = async () => {
    setLoading(true);
    const text = await getProfileInsights(profile, state);
    setInsights(text);
    setLoading(false);
  };

  return (
    <div className="card mb-4" style={{ border: '1px solid rgba(167, 139, 250, 0.3)', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(167, 139, 250, 0.05) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span> AI Civic Guide
          </h3>
          <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>Get tailored advice for {state || "your location"}</p>
        </div>
        
        {!insights && !loading && (
          <button onClick={handleGetInsights} 
                  style={{ background: 'var(--bg-dark)', border: '1px solid #a78bfa', color: '#a78bfa', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            Get Insights
          </button>
        )}
      </div>

      {loading && (
        <div style={{ animation: 'pulse-danger 1.5s infinite', color: '#a78bfa', padding: '1rem 0' }}>
          Analyzing your profile and location data...
        </div>
      )}

      {insights && !loading && (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '8px' }}>
          <MarkdownRenderer content={insights} />
          
          <button 
            onClick={handleGetInsights}
            style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'underline' }}>
            Refresh Insights
          </button>
        </div>
      )}
    </div>
  );
}
