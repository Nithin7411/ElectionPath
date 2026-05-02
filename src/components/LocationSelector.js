"use client";
import { useState, useEffect } from "react";
import { ALL_INDIAN_STATES, detectLocation } from "@/lib/location-engine";

export default function LocationSelector({ onLocationDetected }) {
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("electionpath_state");
    if (saved) {
      setState(saved);
      if (onLocationDetected) onLocationDetected(saved);
    }
  }, [onLocationDetected]);

  const handleDetect = async () => {
    setLoading(true);
    try {
      const location = await detectLocation();
      setState(location.state);
      localStorage.setItem("electionpath_state", location.state);
      if (onLocationDetected) onLocationDetected(location.state);
    } catch (error) {
      console.error("Failed to detect location", error);
      alert("Failed to detect location automatically. Please select manually.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setState(val);
    localStorage.setItem("electionpath_state", val);
    if (onLocationDetected) onLocationDetected(val);
  };

  return (
    <div className="card mb-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <div>
        <h4 className="mb-1">Your Location</h4>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Elections are tailored to your state</p>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexGrow: 1, justifyContent: 'flex-end' }}>
        <select 
          value={state} 
          onChange={handleChange}
          aria-label="Select your state to filter elections"
          style={{ background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-card)', padding: '0.5rem', borderRadius: '8px' }}
        >
          <option value="">Select State</option>
          {ALL_INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
+
+        <button 
+          onClick={handleDetect} 
+          disabled={loading}
+          aria-label="Automatically detect your location"
+          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', padding: '0.5rem 1rem', borderRadius: '8px' }}
+        >
+          {loading ? "Locating..." : "Auto Detect"}
+        </button>
      </div>
    </div>
  );
}
