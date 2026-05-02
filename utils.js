export const STAGES = {
  UPCOMING: "Upcoming",
  VOTING: "Voting Day",
  COMPLETED: "Completed"
};

export function getStage(election) {
  if (!election || !election.timeline || !election.timeline.voting) {
    return "Invalid Data";
  }
  const todayStr = new Date().toISOString().split('T')[0];
  if (todayStr < election.timeline.voting) return STAGES.UPCOMING;
  if (todayStr === election.timeline.voting) return STAGES.VOTING;
  return STAGES.COMPLETED;
}

export function filterElections(elections, userState) {
  if (!elections || !Array.isArray(elections)) return [];
  return elections.filter(e => e.state === userState || e.type === "national");
}

export function getDaysLeft(date) {
  if (!date || isNaN(new Date(date).getTime())) return -1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const voting = new Date(date);
  voting.setHours(0, 0, 0, 0);
  
  const diffTime = voting - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getEligibleYear(dob) {
  if (!dob || isNaN(new Date(dob.toString()).getTime())) {
    console.error("Enter valid DOB");
    return null;
  }
  const dobNum = parseInt(dob, 10);
  if (!dobNum || isNaN(dobNum)) return null;
  return dobNum + 18;
}
