import { app, db } from "./src/firebase/firebase-init";

import { collection, addDoc } from "firebase/firestore";

async function addData() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

addData();
