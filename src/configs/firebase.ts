import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5vygbj4RkWYTNPewDEtgQUnt6MrdMbrg",
  authDomain: "your-mental-buddy.firebaseapp.com",
  projectId: "your-mental-buddy",
  storageBucket: "your-mental-buddy.firebasestorage.app",
  messagingSenderId: "855424577320",
  appId: "1:855424577320:web:73ddabbb27c3d583486a1d",
  measurementId: "G-0ZSH78HNWK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Function to save a new journal entry to Firestore
const saveJournalEntry = async (entry: { userId: string; mood: string; entryText: string; gratitude?: string }) => {
    try {
        const docRef = await addDoc(collection(firestore, "journalEntries"), {
            ...entry,
            timestamp: Timestamp.now()
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};

// Function to retrieve journal entries for a specific user from Firestore
const getJournalEntries = async (userId: string) => {
    try {
        const q = query(
            collection(firestore, "journalEntries"),
            where("userId", "==", userId ),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
};

// Function to save a new assessment result to Firestore
const saveAssessmentResult = async (result: {
  userId: string;
    type: string;
    score: number;
    level: string;
    recommendations: string[];
}) => {
  try {
    const docRef = await addDoc(collection(firestore, "assessmentResults"), {
      ...result,
      timestamp: Timestamp.now()
    });
    console.log("Assessment result saved with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error saving assessment result: ", e);
    return { success: false, error: e }; 
  }
};

// Function to retrieve assessment results for a specific user from Firestore
const getAssessmentResults = async (userId: string) => {
  try {
    const q = query(
      collection(firestore, "assessmentResults"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting assessment results: ", e);
    return [];
  }
};
export { app, auth, firestore, googleProvider, saveJournalEntry, getJournalEntries, saveAssessmentResult, getAssessmentResults };
