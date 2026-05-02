"use client";
import { useState } from "react";
import { explainStage } from "@/lib/gemini-service";

import MarkdownRenderer from "./MarkdownRenderer";

export default function AiExplainer({ election, stage, userState, isFirstTime }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setLoading(true);
    const text = await explainStage(election, stage, userState, isFirstTime);
    setExplanation(text);
    setLoading(false);
  };

  return (
    <div className="card mb-4" style={{ border: '1px solid rgba(167, 139, 250, 0.3)', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(167, 139, 250, 0.05) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>✨</span> AI Guide
        </h3>
        {!explanation && !loading && (
          <button onClick={handleExplain} 
                  style={{ background: 'var(--bg-dark)', border: '1px solid #a78bfa', color: '#a78bfa', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            Explain this stage
          </button>
        )}
      </div>

      {loading && (
        <div style={{ animation: 'pulse-danger 1.5s infinite', color: '#a78bfa' }}>
          Generating explanation...
        </div>
      )}

      {explanation && !loading && (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
          <MarkdownRenderer content={explanation} />
        </div>
      )}
    </div>
  );
}
