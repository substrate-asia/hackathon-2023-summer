import { Web3Auth } from "@web3auth/modal";
import React, { useState, useEffect } from 'react';

function Web3authfunction() {
  const [data, setData] = useState(null);

  //Initialize within your constructor
  const web3auth = new Web3Auth({
    clientId: "YOUR_WEB3AUTH_CLIENT_ID", // Get your Client ID from Web3Auth Dashboard
    chainConfig: {
      chainNamespace: "eip155",
      chainId: "0x1", // Please use 0x5 for Goerli Testnet
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Wait for the initModal method to complete
        await web3auth.initModal();

        // Wait for the connect method to complete
        await web3auth.connect();

        // Set the data state to the user object

        var userinfo = await web3auth.getUserInfo();

        console.log(userinfo);  
        setData(web3auth.user);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {

      if (web3auth !== null && web3auth.user !== null) {
        // Call the logout method to log out the user
        await web3auth.logout();
        console.log("User logged out");
        // Set the data state to null to indicate that the user is logged out
        setData(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log("data: ", data);

  if (data === null) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h1>logged In</h1>
        <p>User: {JSON.stringify(data)}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }
}

export default Web3authfunction;