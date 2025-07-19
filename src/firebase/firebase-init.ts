import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";



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
 * @param userId 
 * @param activity 
 * @param additionalData 
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