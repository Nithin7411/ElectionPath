import { getStage, filterElections, getDaysLeft, getEligibleYear } from './utils.js';

// --- RUNNING TESTS ---

// 1. BASIC TESTS
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

// 2. EDGE CASE TESTS
// Voting day = today
console.assert(getStage({ timeline: { voting: todayStr } }) === "Voting Day", "❌ Failed: Voting day = today");

// Past election
console.assert(getStage({ timeline: { voting: pastStr } }) === "Completed", "❌ Failed: Past election handling");

// Missing/invalid election data
const invalidElection = {};
console.assert(
  getStage(invalidElection) === "Invalid Data",
  "❌ Failed: Invalid data handling"
);
console.log("✅ Passed: Invalid data handling");

// 3. INTEGRATION TEST
function testFullFlow() {
  const data = [
    { state: "Andhra Pradesh", type: "state", year: 2024, timeline: { voting: futureStr } },
    { state: "Karnataka", type: "state", year: 2024, timeline: { voting: futureStr } },
    { state: "India", type: "national", year: 2024, timeline: { voting: futureStr } }
  ];
  
  const userState = "Andhra Pradesh";
  const dob = 2005;

  const filteredElections = filterElections(data, userState);
  const eligibleYear = getEligibleYear(dob);
  const eligible = filteredElections.filter(e => e.year >= eligibleYear);

  console.assert(eligible.length > 0, "❌ Full flow failed");
  console.log("✅ Full flow passed");
}

testFullFlow();
