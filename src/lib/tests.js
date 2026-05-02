/**
 * ElectionPath AI - Lightweight Test Suite
 * No heavy frameworks. Pure JS validation using console.assert.
 */

import { filterElections, getStage, checkEligibility, getDaysLeft } from './logic-engine';

export function runTestSuite() {
  console.log("🚀 Starting ElectionPath AI Test Suite...");
  const results = [];

  const addResult = (name, passed, error = null) => {
    results.push({ name, passed, error });
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  };

  // 1. Test Election Filtering
  try {
    const mockElections = [
      { id: 1, state: 'Delhi', type: 'state' },
      { id: 2, state: 'India', type: 'national' },
      { id: 3, state: 'Bihar', type: 'state' }
    ];
    const filtered = filterElections(mockElections, 'Delhi');
    console.assert(filtered.length === 2, "Should find 1 state + 1 national election");
    addResult("Election Filtering", filtered.length === 2);
  } catch (e) { addResult("Election Filtering", false, e.message); }

  // 2. Test Stage Detection
  try {
    const today = new Date().toISOString().split('T')[0];
    const mockElection = { timeline: { voting: today } };
    const stage = getStage(mockElection);
    console.assert(stage === "Voting Day", "Should detect Voting Day");
    addResult("Stage Detection", stage === "Voting Day");
  } catch (e) { addResult("Stage Detection", false, e.message); }

  // 3. Test Eligibility Calculation
  try {
    const mockElections = [{ year: 2024 }, { year: 2026 }];
    const eligible = checkEligibility(2000, mockElections); // Turns 18 in 2018
    console.assert(eligible.length === 2, "2000 born should be eligible for all");
    
    const ineligible = checkEligibility(2010, mockElections); // Turns 18 in 2028
    console.assert(ineligible.length === 0, "2010 born should not be eligible for 2024/2026");
    addResult("Eligibility Calculation", eligible.length === 2 && ineligible.length === 0);
  } catch (e) { addResult("Eligibility Calculation", false, e.message); }

  // 4. Test Countdown Logic
  try {
    const target = new Date();
    target.setDate(target.getDate() + 5);
    const mockElection = { timeline: { voting: target.toISOString().split('T')[0] } };
    const days = getDaysLeft(mockElection);
    console.assert(days === 5, `Expected 5 days, got ${days}`);
    addResult("Countdown Logic", days === 5);
  } catch (e) { addResult("Countdown Logic", false, e.message); }

  return results;
}
