import { memo, useState } from 'react';
import type { FC } from 'react';
import classes from './App.module.css';
import resets from './components/Mint/_resets.module.css';
import { MintModel } from './components/Mint/MintModel/MintModel';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

interface Props {
  className?: string;
}

export const MintModelPage: FC<Props> = memo(function App(props = {}) {
  const history = useHistory();
  // Custom OKExChain mainnet provider
  const customOKExChainProvider = new ethers.providers.JsonRpcProvider({
    url: "https://exchainrpc.okex.org", // OKExChain mainnet node URL
    chainId: 66, // OKExChain mainnet chainId
    name: "okexchain"
  });

  // Set provider and signer
  const [provider, setProvider] = useState(customOKExChainProvider);
  const [signer, setSigner] = useState(provider.getSigner());
  
  async function handleMint() {
    console.log("mint clicked");

    // The contract address of the NFT
    const contractAddress = "0xda0d7f342b9c0f7f5f456e0c0a3ec6fe925eaef3";

    // The Token ID of the NFT you want to send
    const tokenId = "9568";

    // The address of the user's wallet
    const userAddress = "0x6F83E25c9f4348Eefb0766319093d82EA9777300";

    // The ABI of the contract (You can get this from the contract's documentation or Etherscan)
    const contractABI = []; // replace this with your contract's ABI

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Estimate the gas price
    const estimate = await contract.estimateGas.transferFrom(
      await signer.getAddress(), // from your wallet
      userAddress, // to user's wallet
      tokenId // the token id you want to transfer
    );

    // Execute the transaction
    const transaction = await contract.transferFrom(
      await signer.getAddress(),
      userAddress,
      tokenId,
      { gasLimit: estimate }
    );

    // Wait for it to be mined
    await transaction.wait();

    console.log(`Sent token #${tokenId} to ${userAddress}!`);
 
    
    console.log("mint clikced");
    history.push('/models');
    //Nick: start your code here 
  }

  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <MintModel onMint={handleMint}/>
    </div>
  );
});

export default MintModelPage;
