"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import LocationSelector from "@/components/LocationSelector";
import ElectionCard from "@/components/ElectionCard";
import { getAllElections } from "@/lib/data-service";
import { filterElections, sortElections } from "@/lib/logic-engine";

export default function Home() {
  const [elections, setElections] = useState([]);
  const [userState, setUserState] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getAllElections();
      setElections(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const displayedElections = sortElections(filterElections(elections, userState));

  return (
    <div className="container animate-fade-in">
      <Header userState={userState} />
      
      <main>
        <LocationSelector onLocationDetected={setUserState} />
        
        <h2 className="mb-4">Elections for You</h2>
        
        {loading ? (
          <div className="text-center text-muted mt-4">Loading elections...</div>
        ) : (
          <>
            {displayedElections.length === 0 ? (
              <div className="card text-center">
                <p>No elections found for your region at this time.</p>
              </div>
            ) : (
              <div className="card-grid">
                {displayedElections.map(election => (
                  <ElectionCard key={election.id} election={election} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
