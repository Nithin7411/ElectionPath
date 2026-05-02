"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { checkEligibility, getNextAction } from "@/lib/logic-engine";
import { getAllElections } from "@/lib/data-service";
import { calculateParticipationStats, setParticipation, getParticipation } from "@/lib/participation";
import AiProfileGuide from "@/components/AiProfileGuide";

export default function AssistantPage() {
  const [profile, setProfile] = useState<{ birthYear: string; isFirstTime: boolean; isRegistered: boolean }>({ birthYear: "", isFirstTime: false, isRegistered: false });
  const [elections, setElections] = useState<any[]>([]);
  const [participation, setParticipationState] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const [userState, setUserState] = useState("");

  useEffect(() => {
    async function load() {
      const savedProfile = localStorage.getItem("electionpath_profile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      const savedState = localStorage.getItem("electionpath_state");
      if (savedState) {
        setUserState(savedState);
      }
      
      const data = await getAllElections();
      setElections(data);
      setParticipationState(getParticipation());
      setLoading(false);
    }
    load();
  }, []);

  // ... (handleProfileChange and handleVoteToggle remain the same)
  const handleProfileChange = (key: string, value: any) => {
    const newProfile = { ...profile, [key]: value };
    setProfile(newProfile);
    localStorage.setItem("electionpath_profile", JSON.stringify(newProfile));
  };

  const handleVoteToggle = (electionId: string, didVote: boolean) => {
    setParticipation(electionId, didVote);
    setParticipationState({ ...participation, [electionId]: didVote });
  };

  if (loading) return <div className="container mt-4 text-center">Loading Assistant...</div>;

  // Filter by user's location first, then check age eligibility
  const locationElections = userState ? elections.filter((e: any) => e.type === "national" || e.state === userState) : elections.filter((e: any) => e.type === "national");
  const eligibleElections = checkEligibility(profile.birthYear || "2006", locationElections);
  const stats = calculateParticipationStats(eligibleElections);
  const pastElections = eligibleElections.filter((e: any) => e.timeline.voting < new Date().toISOString().split('T')[0]);
  const upcomingElections = eligibleElections.filter((e: any) => e.timeline.voting >= new Date().toISOString().split('T')[0]);

  return (
    <div className="container animate-fade-in">
      <Header userState={userState} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Onboarding */}
        <div>
          <h2 className="mb-4">Your Profile</h2>
          <div className="card mb-4">
            <div className="mb-4">
              <label className="text-muted mb-2" style={{ display: 'block' }}>What is your birth year?</label>
              <input 
                type="number" 
                value={profile.birthYear} 
                onChange={(e) => handleProfileChange('birthYear', e.target.value)}
                placeholder="YYYY"
                style={{ width: '100%', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-card)', padding: '0.75rem', borderRadius: '8px' }}
              />
            </div>

            <div className="mb-4">
              <label className="text-muted mb-2" style={{ display: 'block' }}>Are you a first-time voter?</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => handleProfileChange('isFirstTime', true)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: `1px solid ${profile.isFirstTime ? 'var(--primary)' : 'var(--border-card)'}`, background: profile.isFirstTime ? 'rgba(59, 130, 246, 0.2)' : 'transparent' }}
                >Yes</button>
                <button 
                  onClick={() => handleProfileChange('isFirstTime', false)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: `1px solid ${!profile.isFirstTime ? 'var(--primary)' : 'var(--border-card)'}`, background: !profile.isFirstTime ? 'rgba(59, 130, 246, 0.2)' : 'transparent' }}
                >No</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-muted mb-2" style={{ display: 'block' }}>Are you registered to vote?</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => handleProfileChange('isRegistered', true)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: `1px solid ${profile.isRegistered ? 'var(--success)' : 'var(--border-card)'}`, background: profile.isRegistered ? 'rgba(16, 185, 129, 0.2)' : 'transparent' }}
                >Yes</button>
                <button 
                  onClick={() => handleProfileChange('isRegistered', false)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: `1px solid ${!profile.isRegistered ? 'var(--danger)' : 'var(--border-card)'}`, background: !profile.isRegistered ? 'rgba(244, 63, 94, 0.2)' : 'transparent' }}
                >No</button>
              </div>
            </div>
          </div>
          
          <AiProfileGuide profile={profile} />

          <h2 className="mb-4">Your Next Action</h2>
          {upcomingElections.slice(0, 1).map((election: any) => (
            <div key={election.id} className="card" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <h4 style={{ color: 'var(--warning)' }}>For {election.name}</h4>
              <p>{getNextAction(election, profile)}</p>
            </div>
          ))}
          {upcomingElections.length === 0 && (
            <div className="card text-center text-muted">No upcoming elections right now.</div>
          )}
        </div>

        {/* Right Column: Tracker */}
        <div>
          <h2 className="mb-4">Participation Tracker</h2>
          <div className="card mb-4">
            <h3 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {stats.percentage}%
            </h3>
            <p className="text-muted mb-4">You participated in {stats.voted} out of {stats.total} eligible elections.</p>
            
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${stats.percentage}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s' }} />
            </div>
          </div>

          <h3 className="mb-2">Your Election History</h3>
          <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
            {pastElections.length === 0 && (
              <p className="text-muted text-center py-4">No past elections available.</p>
            )}
            {pastElections.map((election: any) => (
              <div key={election.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ margin: 0 }}>{election.name}</h5>
                  <small className="text-muted">{election.year}</small>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={!!participation[election.id]}
                      onChange={(e) => handleVoteToggle(election.id, e.target.checked)}
                      style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                    />
                    <span>I Voted</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
