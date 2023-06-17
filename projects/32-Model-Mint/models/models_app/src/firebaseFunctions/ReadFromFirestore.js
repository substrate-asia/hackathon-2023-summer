import firebase from "./firebaseConfig";
import { useState, useEffect } from "react";
import 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
function ReadFromFirestore(collectionName,docName) {
//   const [data, setData] = useState('');
  const db = firebase.firestore();
    // const fetchPost = async () => {
      
    //     await getDocs(collection(db, "Users"))
    //         .then((querySnapshot)=>{               
    //             const newData = querySnapshot.docs
    //                 .map((doc) => ({...doc.data(), id:doc.id }));
    //                 // setData(newData);                
    //             console.log( newData);
    //         })
    // }
    //     fetchPost();

    return db.collection(collectionName).doc(docName).get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
      } else {
        console.log("No such document!");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error reading document: ", error);
      return null;
    });
    // const fetchData = async () => {
    //   try {
    //     const docRef = db.collection('Users').doc('0x22815bb7b2ea2d6b3c23d8e80f3894d31a841f75');
    //     const doc = await docRef.get();
    //     if (doc.exists) {
    //     //   setData(doc.data());
    //     //   console.log("Document data:", doc.data());
    //       return doc.data();
    //     } else {
    //       console.log("No such document!");
    //       return null;
    //     }
    //   } catch (error) {
    //     console.error("Error reading document: ", error);
    //     return null;
    //   }
    // };

    // fetchData();


//   return data;
// return 'hello';
}

export default ReadFromFirestore;