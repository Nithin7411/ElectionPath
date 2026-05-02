"use client";

const STORAGE_KEY = "electionpath_participation";

export function getParticipation() {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

export function setParticipation(electionId, didVote) {
  if (typeof window === "undefined") return;
  const current = getParticipation();
  current[electionId] = didVote;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function calculateParticipationStats(eligibleElections) {
  const participation = getParticipation();
  const pastElections = eligibleElections.filter(e => {
    const todayStr = new Date().toISOString().split('T')[0];
    return e.timeline.voting < todayStr;
  });

  const total = pastElections.length;
  if (total === 0) return { total: 0, voted: 0, percentage: 0 };

  let voted = 0;
  for (const election of pastElections) {
    if (participation[election.id]) voted++;
  }

  return {
    total,
    voted,
    percentage: Math.round((voted / total) * 100)
  };
}
