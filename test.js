// test.js

// 1. STAGE DETECTION
function getStage(election) {
  const todayStr = new Date().toISOString().split('T')[0];
  if (todayStr < election.timeline.voting) return "Upcoming";
  if (todayStr === election.timeline.voting) return "Voting Day";
  return "Completed";
}

// 2. ELIGIBILITY CALCULATION
function getEligibleYear(birthYear) {
  return birthYear + 18;
}

// 3. ELECTION FILTERING
function filterElections(elections, userState) {
  return elections.filter(e => e.state === userState || e.type === "national");
}

// 4. COUNTDOWN CALCULATION
function getDaysLeft(votingDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const voting = new Date(votingDate);
  voting.setHours(0, 0, 0, 0);
  
  const diffTime = voting - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// --- RUNNING TESTS ---

// Test 1: Stage Detection
const todayDate = new Date();
const todayStr = todayDate.toISOString().split('T')[0];

const futureDate = new Date(todayDate);
futureDate.setDate(futureDate.getDate() + 10);
const futureStr = futureDate.toISOString().split('T')[0];

const pastDate = new Date(todayDate);
pastDate.setDate(pastDate.getDate() - 10);
const pastStr = pastDate.toISOString().split('T')[0];

console.assert(getStage({ timeline: { voting: futureStr } }) === "Upcoming", "❌ Test Failed: Stage Detection (Upcoming)");
console.assert(getStage({ timeline: { voting: todayStr } }) === "Voting Day", "❌ Test Failed: Stage Detection (Voting Day)");
console.assert(getStage({ timeline: { voting: pastStr } }) === "Completed", "❌ Test Failed: Stage Detection (Completed)");
console.log("✅ Test Passed: Stage Detection");

// Test 2: Eligibility
console.assert(getEligibleYear(2005) === 2023, "❌ Test Failed: Eligibility");
console.log("✅ Test Passed: Eligibility");

// Test 3: Filtering
const mockElections = [
  { state: "Andhra Pradesh", type: "state" },
  { state: "Karnataka", type: "state" },
  { state: "India", type: "national" }
];
const filtered = filterElections(mockElections, "Andhra Pradesh");
console.assert(
  filtered.length === 2 && 
  filtered.some(e => e.state === "Andhra Pradesh") && 
  filtered.some(e => e.type === "national"), 
  "❌ Test Failed: Filtering"
);
console.log("✅ Test Passed: Filtering");

// Test 4: Countdown
const futureVotingDate = new Date();
futureVotingDate.setDate(futureVotingDate.getDate() + 5);
const daysLeft = getDaysLeft(futureVotingDate);
console.assert(daysLeft > 0 && daysLeft === 5, "❌ Test Failed: Countdown");
console.log("✅ Test Passed: Countdown");
