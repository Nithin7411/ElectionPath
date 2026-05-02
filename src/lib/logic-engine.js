export function filterElections(elections, userState) {
  if (!elections || !Array.isArray(elections)) return [];
  return elections.filter(e => e.state === userState || e.type === "national");
}

export function sortElections(elections) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const upcoming = elections.filter(e => e.timeline.voting >= todayStr);
  const completed = elections.filter(e => e.timeline.voting < todayStr);

  upcoming.sort((a, b) => a.timeline.voting.localeCompare(b.timeline.voting));
  completed.sort((a, b) => b.timeline.voting.localeCompare(a.timeline.voting));

  return [...upcoming, ...completed];
}

export function getStage(election) {
  const todayStr = new Date().toISOString().split('T')[0];
  if (todayStr < election.timeline.voting) return "Upcoming";
  if (todayStr === election.timeline.voting) return "Voting Day";
  return "Completed";
}

export function getDaysLeft(election) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const voting = new Date(election.timeline.voting);
  voting.setHours(0, 0, 0, 0);
  
  const diffTime = voting - today;
  if (diffTime < 0) return 0;
  
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function checkEligibility(birthYear, elections) {
  const eligibleYear = parseInt(birthYear) + 18;
  return elections.filter(e => parseInt(e.year) >= eligibleYear);
}

export function getNextAction(election, userProfile) {
  // Destructure profile safely
  const { birthYear = null, isRegistered = false } = userProfile || {};

  // Age Check
  if (birthYear) {
    const eligibleYear = parseInt(birthYear) + 18;
    if (parseInt(election.year) < eligibleYear) {
      return "Wait until you turn 18 to vote.";
    }
  }

  const stage = getStage(election);

  if (stage === "Completed") {
    return "Election is over. Check results!";
  }

  if (stage === "Voting Day") {
    return "Go to your polling booth immediately!";
  }

  // Stage is Upcoming
  if (!isRegistered) {
    return "Register to vote before the deadline at nvsp.in.";
  }

  const daysLeft = getDaysLeft(election);
  if (daysLeft > 30) {
    return "Check your voter registration status.";
  } else {
    return "Prepare your Voter ID and documents.";
  }
}
