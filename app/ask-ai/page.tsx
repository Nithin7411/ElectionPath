"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { askChatbot } from "@/lib/gemini-service";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Link from "next/link";

const RECOMMENDATIONS = [
  "How do I register to vote online?",
  "How can I find my polling booth?",
  "What documents do I need to vote?",
  "Who is the current Election Commissioner?",
  "Explain the EVM and VVPAT system."
];

export default function AskAiPage() {
  const [messages, setMessages] = useState([{ role: "ai", text: "Hello! I am the ElectionPath AI. How can I help you with your civic questions today?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userState, setUserState] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedState = localStorage.getItem("electionpath_state");
    if (savedState) setUserState(savedState);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSubmit) => {
    const text = textToSubmit || input;
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const responseText = await askChatbot(newMessages, userState);
    
    setMessages([...newMessages, { role: "ai", text: responseText }]);
    setLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/" style={{ color: 'var(--text-muted)' }}>← Back to Dashboard</Link>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Chat Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-card)', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <div>
            <h3 style={{ margin: 0, color: 'var(--primary)' }}>Election Assistant</h3>
            <small className="text-muted">Ask anything about the Indian democratic process.</small>
          </div>
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%',
                padding: '1rem',
                borderRadius: '12px',
                background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                border: msg.role === 'ai' ? '1px solid var(--border-card)' : 'none'
              }}>
                {msg.role === 'user' ? (
                  <p style={{ margin: 0 }}>{msg.text}</p>
                ) : (
                  <MarkdownRenderer content={msg.text} />
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)' }}>
                <span style={{ animation: 'pulse-danger 1.5s infinite', color: 'var(--primary)' }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Recommendations */}
        {messages.length === 1 && (
          <div style={{ padding: '0 1.5rem', marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {RECOMMENDATIONS.map((rec, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(rec)}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', 
                  padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.85rem', color: 'var(--text-muted)'
                }}
              >
                {rec}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-card)', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your civic question here..."
            style={{ 
              flex: 1, background: 'var(--bg-dark)', color: 'white', 
              border: '1px solid var(--border-card)', padding: '1rem', borderRadius: '8px', fontSize: '1rem' 
            }}
          />
          <button 
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{ 
              background: loading || !input.trim() ? 'var(--bg-card)' : 'var(--primary)', 
              color: 'white', padding: '0 2rem', borderRadius: '8px', fontWeight: 'bold',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
