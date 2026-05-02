"use client";
import { useState, useEffect } from "react";
import { getElectionById } from "@/lib/data-service";
import { getStage, getNextAction } from "@/lib/logic-engine";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import Countdown from "@/components/Countdown";
import AiExplainer from "@/components/AiExplainer";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ElectionDetail() {
  const params = useParams();
  const id = params?.id;
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const data = await getElectionById(id);
      setElection(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="container mt-4 text-center">Loading...</div>;
  if (!election) return <div className="container mt-4 text-center text-muted">Election not found.</div>;

  const stage = getStage(election);
  // Using an empty profile for next action. Assistant page handles profile logic.
  const nextAction = getNextAction(election, { isRegistered: true }); 

  return (
    <div className="container animate-fade-in">
      <Header />
      
      <Link href="/" style={{ color: 'var(--text-muted)', display: 'inline-block', marginBottom: '2rem' }}>
        ← Back to Dashboard
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Left Column */}
        <div>
          <h1 className="mb-2">{election.name}</h1>
          <p className="text-muted mb-4">{election.state} • {election.type === "national" ? "National" : "State Assembly"}</p>
          
          <Timeline timeline={election.timeline} currentStage={stage} />
        </div>

        {/* Right Column */}
        <div>
          {stage !== "Completed" && <Countdown votingDateStr={election.timeline.voting} />}
          
          <AiExplainer 
            election={election} 
            stage={stage} 
            userState={election.state} 
            isFirstTime={false} 
          />

          <div className="card" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
            <h3 style={{ color: 'var(--primary)' }}>Your Next Step</h3>
            <p style={{ fontSize: '1.1rem' }}>{nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
