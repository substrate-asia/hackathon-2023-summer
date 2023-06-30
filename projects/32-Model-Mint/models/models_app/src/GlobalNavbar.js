import React, { useState, useEffect } from "react";
import { setCurrentUserWalletAddress, getCurrentUserWalletAddress, getCurrentUserOpenAIKey } from './globalVariable';
import './GlobalNavbar.css';
import { TextField, Input } from '@mui/material';
import WriteToFirestore from './firebaseFunctions/WriteToFirestore';

import ModelGPTLogo from './images/ModelGPTLogo.png';
import connectLogo from './images/connect.png';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import firebase from "./firebaseFunctions/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import 'firebase/firestore';
import ReadFromFirestoreAll from './firebaseFunctions/ReadFromFirestoreAll';
import MetaMaskSDK from '@metamask/sdk';
import MyPopup from './MyPopup';
import { Button, Stack } from 'react-bootstrap';
import okxWeb3 from '@okwallet/extension';
//console.log(okxWeb3);


const db = firebase.firestore();


function GlobalNavbar({ setShowPopup }) {

    const [walletAddress, setWalletAddress] = useState('null');
    const [errorMessage, setErrorMessage] = useState(null);
    // const [showPopup, setShowPopup] = useState(false);
    const [inputValue, setInputValue] = useState('');

    //const MMSDK = new MetaMaskSDK();
    //const ethereum = MMSDK.getProvider();


    window.addEventListener('load', checkAuth);

    window.onload = function () {
        if (getCurrentUserWalletAddress() == null) {
            handleConnect();
        }
    };

    function checkAuth() {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            setCurrentUserWalletAddress(authToken);
            console.log('authed', getCurrentUserWalletAddress());
        } else {
            console.log('not authed');
        }
    }


    function handlePopupInputChange(event) {
        setInputValue(event.target.value);
    }

    function handleLogout() {
        // perform logout logic
        console.log('logout');
        localStorage.removeItem('authToken');
        window.location.reload();
    }

    function handlePopupSubmit() {
        // Do something with the input value
        console.log(inputValue);
        // setShowPopup(false);
    }



      
    // async function handleConnect() {


    //     await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
    //         .then(() => {
    //             console.log('Wallet connected successfully.');
    //             setWalletAddress(window.ethereum.selectedAddress);
    //             console.log(window.ethereum.isConnected());
    //             // console.log(walletAddress)
    //             // console.log(window.ethereum.selectedAddress)

    //         }).then(() => {
    //             setShowPopup();
    //         }).then(() => {
    //             setCurrentUserWalletAddress(window.ethereum.selectedAddress);
    //             console.log(getCurrentUserWalletAddress());
    //             localStorage.setItem('authToken', getCurrentUserWalletAddress());
    //         })
    //         .catch((error) => {
    //             console.error('Failed to connect wallet:', error);
    //         });
    // }



    async function handleConnect() {
        try {
            const wallets = await window.okxwallet.requestWallets(true);
            if (wallets && wallets.length > 0) {
                const address = wallets[0].address[0].address;
                console.log('Wallet connected successfully:', address);
                setWalletAddress(address);
                setCurrentUserWalletAddress(address);
                localStorage.setItem('authToken', address);
                localStorage.setItem('walletAddress', address);
                setShowPopup();
                setErrorMessage(null);
            } else {
                console.error('No wallets found');
                setErrorMessage('No wallets found. Please install and set up an OKX wallet.');
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            setErrorMessage('Please ensure that OKX wallet is installed.');
        }
    }

    // async function handleConnect() {
    //     await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
    //         .then(() => {
    //             console.log('Wallet connected successfully.');
    //             setWalletAddress(window.ethereum.selectedAddress);
    //             console.log(window.ethereum.isConnected());
    //             // console.log(walletAddress)
    //             // console.log(window.ethereum.selectedAddress)

    //         }).then(() => {
    //             setShowPopup();
    //         }).then(() => {
    //             setCurrentUserWalletAddress(window.ethereum.selectedAddress);
    //             console.log(getCurrentUserWalletAddress());
    //             localStorage.setItem('authToken', getCurrentUserWalletAddress());
    //         })
    //         .catch((error) => {
    //             console.error('Failed to connect wallet:', error);
    //         });

    
    
    useEffect(() => {
        const storedWalletAddress = localStorage.getItem('walletAddress');
        if (storedWalletAddress) {
            setCurrentUserWalletAddress(storedWalletAddress);
        }
    }, []);

    return (
        <div className="global-navbar-container">
            <div className="global-navbar-container2">

                {/* <h1>ModelGPT</h1>
            <h2>Dashboard</h2>  */}

                {/* when img1 onClicked link to /marketplace */}
                <a href="/marketplace">
                    <img className="img1" src={ModelGPTLogo} alt="Logo" style={{ display: 'inline-block', padding: '0', marginLeft: '300px', lineHeight: '0' }} />
                </a>
                <div className="search-bar">
                    <input type="text" placeholder="Search Models" style={{
                        backgroundColor: 'transparent',
                        width: '500px', borderColor: 'transparent',
                        borderWidth: '0px', fontSize: '16px',
                        color: "white",
                        opacity: "0.7", outline: 'none'
                    }} />
                </div>


                {((localStorage.getItem('authToken') != null)) ? (
                    // display the first 4 and last 4 digits of the wallet address
                    <div >
                        <Stack direction="column" gap={3}>
                            <a href="/models"> <h1 className="creator-space">Creator Space</h1></a>
                            <a onClick={handleLogout}> <h1 className="creator-space">Log Out</h1></a>
                        </Stack>


                        {/* <p>{getCurrentUserWalletAddress().substring(0, 4) + "..." + getCurrentUserWalletAddress().substring(getCurrentUserWalletAddress().length - 4)}</p> */}
                    </div>
                ) : (<img className="img2" src={connectLogo} onClick={handleConnect} alt="Logo" />)}
                {/* <Button variant="primary" onClick={setShowPopup}>
                    Launch demo modal
                </Button> */}

                {errorMessage && <div className="error-message">{errorMessage}</div>}



            </div>
        </div>
    )
}

export default GlobalNavbar;