
import firebase from "./firebaseConfig";
import { useState } from "react";
import 'firebase/firestore';


function WriteToFirestore(collectonName,docName,data) {
  const db = firebase.firestore();
    const addValue = async () => {
      try {
        db.collection(collectonName).doc(docName).set(
          data
          // name: 'John Doe',
          // email: 'johndoe@example.com',
        );
        console.log("Value successfully written!");
      } catch (error) {
        console.error("Error writing Value: ", error);
      }
    };
    addValue();
  };
  
  export default WriteToFirestore;


  // write me a function that can read from firestore


