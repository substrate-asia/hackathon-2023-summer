import React from 'react';
import firebase from "./firebaseConfig";
import { useState } from "react";
import 'firebase/firestore';

function DeletefromFirestore(id) {
    console.log(id);
    const db = firebase.firestore();
    db.collection('models').doc(id).delete().then(() => {
          console.log(`Model ${id} deleted from Firebase`);
        })
        .catch((error) => {
          console.error(`Error deleting model ${id} from Firebase:`, error);
        });

}

export default DeletefromFirestore;

