import React, { useState } from 'react';
import Web3 from 'web3';

const NewPage = () => {
  const [nfts, setNFTs] = useState([]);

  // Function to handle "View NFTs" button click
  const handleViewNFTs = async () => {
    if (typeof window.ethereum !== 'undefined') {
      // Connect to the user's wallet
      try {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);

        // Get the user's address
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        // Access the user's ERC-721 NFTs
        // You can replace this with your own logic to fetch and display the NFTs
        const nftData = await fetchUserNFTs(userAddress, web3);
        setNFTs(nftData);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.error('Web3 provider not found. Please install a compatible wallet extension.');
    }
  };

  // Fetch additional information about each NFT
  async function fetchUserNFTs(userAddress, web3) {
    try {
      // Access the ERC-721 contract using its ABI and contract address
      const contractABI = [{"inputs":[{"internalType":"address payable","name":"shareholderAddress_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"PROVENANCE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleIsActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI_","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"provenance","type":"string"}],"name":"setProvenance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newState","type":"bool"}],"name":"setSaleState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"shareholderAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];; // Contract ABI goes here
      const contractAddress = '0x79FCDEF22feeD20eDDacbB2587640e45491b757f';
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Retrieve the user's NFT token IDs
      const tokenIds = [];
      const balance = await contract.methods.balanceOf(userAddress).call();
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(userAddress, i).call();
        tokenIds.push(tokenId);
      }

      // Fetch additional information about each NFT
      const nfts = [];
      for (const tokenId of tokenIds) {
        const name = await contract.methods.name().call(); 
        const imageHash = await contract.methods.tokenURI(tokenId).call();
        const hashWithPrefixRemoved = imageHash.replace('ipfs://', '');
        const hash = hashWithPrefixRemoved.split('/')[0];
        const ipfsBaseUrl = 'https://ipfs.io/ipfs/';
        const ipfs_l1 = ipfsBaseUrl + hash + '/' + tokenId;
        const websiteLink = ipfs_l1;

        const finalImage = await fetchData(websiteLink);

        nfts.push({
          tokenId,
          name,
          finalImage,
          // Add any other relevant properties you want to display
        });
      }

      return nfts;
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  }

  // Function to fetch JSON data from IPFS
  async function fetchData(websiteLink) {
    try {
      const response = await fetch(websiteLink);
      const jsonData = await response.json();
      const image = jsonData.image;

      const convertedImage = convertLink(image);
      return convertedImage;
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }

  // Function to convert IPFS link
  function convertLink(link) {
    const hash = link.replace('ipfs://', '');
    const convertedLink = `https://ipfs.io/ipfs/${hash}`;
    return convertedLink;
  }

  return (
    <div>
      <h1>New Page</h1>
      <p>This is a new page!</p>
      <button onClick={handleViewNFTs}>View NFTs</button>

      {/* Display the user's NFTs */}
      {/* Display the user's NFTs */}
      {nfts.length > 0 && (
  <div>
    <h2>Your NFTs:</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: '#FFFFFF', padding: '10px' }}>
      {nfts.map((nft) => (
        <div key={nft.tokenId} style={{ margin: '10px', color: '#000000' }}>
          <p style={{ fontWeight: 'bold' }}>NFT #{nft.tokenId}</p>
          <img src={nft.finalImage} alt={nft.name} style={{ width: '200px', height: '200px' }} />
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

// the above code contains the NFT display, now we focus on minting the NFTs here







export default NewPage;
