import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";


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
const db = getFirestore(app);




/**
 * Records user activity in Firestore.
 * @param userId - The ID of the user performing the activity.
 * @param activity - The type of activity being performed.
 * @param additionalData - Any additional data related to the activity.
 */
export const recordActivity = async (
  userId: string,
  activity: string,
  additionalData: string
) => {
  const userActivityCollection = collection(db, "userActivity");
  await addDoc(userActivityCollection, {
    userId, activity, additionalData, timestamp: serverTimestamp()
  });
};
export { app, db };