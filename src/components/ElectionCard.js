"use client";
import { useState, useEffect } from "react";
import { getStage, getDaysLeft } from "@/lib/logic-engine";
import Link from "next/link";

export default function ElectionCard({ election }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const stage = getStage(election);
  const daysLeft = getDaysLeft(election);

  const getStageClass = () => {
    if (stage === "Upcoming") return "upcoming";
    if (stage === "Voting Day") return "voting";
    return "completed";
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{election.state}</span>
        {mounted && (
          <span className={`badge ${getStageClass()}`}>{stage}</span>
        )}
      </div>
      
      <h3 style={{ minHeight: '3rem' }}>{election.name}</h3>
      <p className="text-muted mb-4">{election.year} • {election.type === "national" ? "National" : "State Assembly"}</p>
      
      {mounted && stage !== "Completed" && (
        <div className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {daysLeft} <span style={{ fontSize: '1rem', fontWeight: 'normal' }} className="text-muted">days left</span>
        </div>
      )}
      
      <Link href={`/election/${election.id}`}>
        <button style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: '600', transition: 'background 0.3s' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary)'}>
          View Details
        </button>
      </Link>
    </div>
  );
}
