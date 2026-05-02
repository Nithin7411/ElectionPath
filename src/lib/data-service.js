import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { LOCAL_ELECTIONS } from "./local-elections";

// Retrieve a setting indicating if we should force local data
export const useLocalData = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("electionpath_use_local") === "true";
  }
  return false;
};

// Validate that an election object has minimum required fields
function isValidElection(election) {
  return (
    election &&
    typeof election === 'object' &&
    election.id &&
    election.name &&
    election.timeline &&
    election.timeline.voting
  );
}

export async function getAllElections() {
  if (useLocalData()) {
    console.log("Using local elections data");
    return LOCAL_ELECTIONS.filter(isValidElection);
  }
  
  try {
    const electionsCol = collection(db, "elections");
    const snapshot = await getDocs(electionsCol);
    if (snapshot.empty) {
      console.warn("Firestore 'elections' is empty. Falling back to local data.");
      return LOCAL_ELECTIONS.filter(isValidElection);
    }
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter out malformed documents to prevent crashes
    return data.filter(isValidElection);
  } catch (error) {
    console.error("Error fetching from Firestore:", error);
    console.log("Falling back to local data due to error.");
    return LOCAL_ELECTIONS.filter(isValidElection);
  }
}

export async function getElectionById(id) {
  if (!id || typeof id !== "string") {
    console.error("getElectionById called with invalid ID:", id);
    return null;
  }

  const findLocal = () => {
    const election = LOCAL_ELECTIONS.find(e => e.id === id) || null;
    return isValidElection(election) ? election : null;
  };

  if (useLocalData()) {
    return findLocal();
  }
  
  try {
    const docRef = doc(db, "elections", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const election = { id: snapshot.id, ...snapshot.data() };
      return isValidElection(election) ? election : null;
    } else {
      console.warn(`Election ${id} not found in Firestore. Checking local data.`);
      return findLocal();
    }
  } catch (error) {
    console.error(`Error fetching election ${id} from Firestore:`, error);
    return findLocal();
  }
}
