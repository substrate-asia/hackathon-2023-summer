// import React, { useState } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import './signUpLogin.css';


// function SignUpLogin() {
// const firebaseConfig = {
//     apiKey: "AIzaSyCHKY82QTja95nPB-ACS2syUx6FCZg1w1U",
//     authDomain: "modelgpt-4c6ec.firebaseapp.com",
//     projectId: "modelgpt-4c6ec",
//     storageBucket: "modelgpt-4c6ec.appspot.com",
//     messagingSenderId: "715890973366",
//     appId: "1:715890973366:web:4a311865159696a1c0a417",
//     measurementId: "G-JVV7D2L7MS"
//     };
    
//     // Initialize Firebase
//     const app = initializeApp(firebaseConfig);
//     const auth = getAuth(app);
//     // const analytics = getAnalytics(app);
      

      

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSignUp = async () => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       alert('User account created!');
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       alert('Logged in!');
//     } catch (error) {
//       alert(error.message);
//     }
//   };
  
//   return (
//     <div className="container">
//       <div className="form">
//         <input 
//           className="input"
//           type="email" 
//           placeholder="Email" 
//           value={email} 
//           onChange={e => setEmail(e.target.value)} 
//         />
//         <input 
//           className="input"
//           type="password" 
//           placeholder="Password" 
//           value={password} 
//           onChange={e => setPassword(e.target.value)} 
//         />
//         <button className="button" onClick={handleSignUp}>Sign Up</button>
//         <button className="button" onClick={handleLogin}>Login</button>
//       </div>
//     </div>
//   );
// }

// export default SignUpLogin;
