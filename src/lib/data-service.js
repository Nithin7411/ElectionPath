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

export async function getAllElections() {
  if (useLocalData()) {
    console.log("Using local elections data");
    return LOCAL_ELECTIONS;
  }
  
  try {
    const electionsCol = collection(db, "elections");
    const snapshot = await getDocs(electionsCol);
    if (snapshot.empty) {
      console.warn("Firestore 'elections' is empty. Falling back to local data.");
      return LOCAL_ELECTIONS;
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching from Firestore:", error);
    console.log("Falling back to local data due to error.");
    return LOCAL_ELECTIONS;
  }
}

export async function getElectionById(id) {
  if (useLocalData()) {
    return LOCAL_ELECTIONS.find(e => e.id === id) || null;
  }
  
  try {
    const docRef = doc(db, "elections", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      console.warn(`Election ${id} not found in Firestore. Checking local data.`);
      return LOCAL_ELECTIONS.find(e => e.id === id) || null;
    }
  } catch (error) {
    console.error(`Error fetching election ${id} from Firestore:`, error);
    return LOCAL_ELECTIONS.find(e => e.id === id) || null;
  }
}
