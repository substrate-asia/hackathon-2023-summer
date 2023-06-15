// import React,{useState} from 'react';
// import { FaCog } from 'react-icons/fa';
// import WriteToFirestore from './WriteToFirestore';
// // import { useRainbow } from '@rainbow-me/rainbow';
// import { ConnectButton,getDefaultWallets } from '@rainbow-me/rainbowkit';
// import MetaMaskSDK from '@metamask/sdk';
// import { Link } from 'react-router-dom'; // Import the Link component
// import ReadFromFirestore from './firebaseFunctions/ReadFromFirestore';
// import {setCurrentUserWalletAddress, getCurrentUserWalletAddress}from './globalVariable';
// // const [modalIsOpen, setIsOpen] = useState(false);

// import firebase from "./firebaseConfig";
// import { collection, getDocs } from "firebase/firestore";
// import 'firebase/firestore';
// import ReadFromFirestoreAll from './firebaseFunctions/ReadFromFirestoreAll';
// const db = firebase.firestore();
// function Navbar() {
//   const [walletAddress,setWalletAddress] = useState('null');
//   const MMSDK = new MetaMaskSDK();
//   const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
//   const [data, setData] = useState();

//   function handletest()
//   {
//     // const data = useReadFromFirestore('Users', '0x22815bb7b2ea2d6b3c23d8e80f3894d31a841f75');
//     // ReadFromFirestore('Users', '0x22815bb7b2ea2d6b3c23d8e80f3894d31a841f75').then((data) => {
//       // console.log(data);
//     // });
//     // ReadFromFirestoreAll('models').then((data) => {
//     //   console.log(data);
//     // });
//   }
//     function handleConnect()
//     {
//       window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
//       .then(() => {
//         console.log('Wallet connected successfully.');
//         setWalletAddress(window.ethereum.selectedAddress);
//         console.log(window.ethereum.isConnected());
//         // console.log(walletAddress)
//         // console.log(window.ethereum.selectedAddress)
       
//       }).then(() => {
//         setCurrentUserWalletAddress( window.ethereum.selectedAddress);
//         console.log(getCurrentUserWalletAddress());
//         WriteToFirestore('Users',window.ethereum.selectedAddress,{'created_time':new Date().toLocaleTimeString()});
//       })
//       .catch((error) => {
//         console.error('Failed to connect wallet:', error);
//       });
//     }

//     function handleDisconnect() {
//       window.ethereum.on('disconnect', (error) => {
//         console.log('Wallet disconnected successfully.');
//       });
//     }

//     const [modalOpen, setModalOpen] = useState(false);
//     const [inputValue, setInputValue] = useState('');
  
//     const handleOpen = () => setModalOpen(true);
//     function handleClose()
//     {

//       setModalOpen(false);
//       WriteToFirestore('xxsxx','user_id',{'api':inputValue});

//     } 
//     const handleChange = (e) => setInputValue(e.target.value);

//     function handleClick() {
//         handleOpen();
//     }

//   var [modalIsOpen, setIsOpen] = useState(false);
//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <img src="https://d30a90h19r65wj.cloudfront.net/kl.png" alt="Logo" />
//         <h1>Model GPT Creator Dashboard</h1>
//       </div>
//       <div className="settings">
//         <FaCog onClick={handleOpen}/>

//         {modalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Enter your OpenAI API</h2>
//             <input type="text" value={inputValue} onChange={handleChange} />
//             <button onClick={handleClose}>Save</button>
//           </div>
//         </div>
//       )}
        
//       </div>
//       <Link to="/marketplace">Marketplace</Link> {/* Use the Link component to navigate to the marketplace page */}
// <Link to="/">Models</Link>

//           <button onClick={handletest}>test</button>

//       <div className="wallet-address-container">
//       {walletAddress == 'null' ?  <button onClick={handleConnect}>Connect to MetaMask</button>:<h1>{walletAddress}</h1>}
//      </div>
//       {/* <button onClick={handleDisconnect}>Disconnect</button> */}
//       {/* <div className='connect-button'>
//        <ConnectButton onClick={(data) => {
//         // console.log('accountStatus')  
//         // console.log(accountStatus)
//         handleConnect(data)
//        }}/>
//         </div> */}


//     </nav>
//   );
// };

// export default Navbar;
