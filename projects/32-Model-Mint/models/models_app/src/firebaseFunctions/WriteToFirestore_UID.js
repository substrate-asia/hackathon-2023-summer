import firebase from "./firebaseConfig";
import { useState } from "react";
import 'firebase/firestore';


function WriteToFirestore_UID(collectionName, data) {
  const db = firebase.firestore();
  const addValue = async () => {
    try {
      await db.collection(collectionName).add(data);
      console.log("Value successfully written!");
    } catch (error) {
      console.error("Error writing value: ", error);
    }
  };
  addValue();
};


  export default WriteToFirestore_UID;


  // write me a function that can read from firestore


