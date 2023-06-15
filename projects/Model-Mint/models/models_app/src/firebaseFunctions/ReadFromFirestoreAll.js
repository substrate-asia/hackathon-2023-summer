import firebase from "./firebaseConfig";
import { useState, useEffect } from "react";
import 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";

function ReadFromFirestoreAll(collectionName) {
  const db = firebase.firestore();
  
  const fetchPost = async () => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
    return newData;
  }

  return fetchPost();
}

export default ReadFromFirestoreAll;