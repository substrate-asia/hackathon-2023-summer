

 import styled from "styled-components";
 import { Button, Space, message } from "antd";
 import React, { useState } from "react";
 
 import { getAPI, getKeyring } from "./utils/polkadot";
 import { mnemonicGenerate } from "@polkadot/util-crypto";
 import { u8aToHex } from "@polkadot/util";
 import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
 import Identicon from "@polkadot/react-identicon";
 
 
 function Home({ className }) {
   /**
    * 操作项
    * @param className
    */
   document.title = "首页";
   const [chainLogCount, setChainLogCount] = useState("--"); // 实时上链记录
   const [totalPerson, setTotalPerson] = useState("--"); // 实时上链记录
   const onLogin = async () => {
     let api = await getAPI();
     let keyring = await getKeyring();
     // api.rpc.chain.subscribeNewHeads(header => {
     // 	console.log(`Chain is at #${header.number}`);
     // });
     const mnemonic = mnemonicGenerate(12);
 
     // add the account, encrypt the stored JSON with an account-specific password
     const { pair, json } = keyring.addUri(mnemonic, "myStr0ngP@ssworD", { name: "mnemonic acc" });
   };
   const getAccounts = async () => {
     let keyring = await getKeyring();
     const accounts = keyring.getAccounts();
 
     accounts.forEach(({ address, meta, publicKey }) => console.log(address, JSON.stringify(meta), u8aToHex(publicKey)));
   };
   const dapp = async () => {
     const allInjected = await web3Enable("my cool dapp");
     console.log("allInjected", allInjected);
     const accounts = await web3Accounts();
     console.log("accounts", accounts);
   };
   const tx = async () => {
     let api = await getAPI();
     const allInjected = await web3Enable("my cool dapp");
     const accounts = await web3Accounts();
     console.log("accounts", accounts);
     // let SENDER = "5EAVXkeQX5YC9yVU31kcB1hHi4WVudxo8RSXgmohQQBSg4uq"; //accounts[0].address;
     // const injector = await web3FromAddress(SENDER);
     // api.tx.balances.transfer("5D4p9vKrauBW7NCKthG6BPx1wcr7UUcJL14CppyoUiFz6mZz", 1000000000000).signAndSend(SENDER, { signer: injector.signer }, status => {
     // 	console.log(status);
     // 	try {
     // 		console.log("status.status.toJSON()", status.status.toJSON());
     // 	} catch (e) {
     // 		console.log(e);
     // 	}
     // 	try {
     // 		console.log("isFinalized", status.isFinalized);
     // 	} catch (e) {
     // 		console.log(e);
     // 	}
     // });
 
     const { nonce, data: balance } = await api.query.system.account("5D4p9vKrauBW7NCKthG6BPx1wcr7UUcJL14CppyoUiFz6mZz");
     console.log("balance", balance);
     console.log(`balance of ${balance.free} and a nonce of ${nonce}`);
   };
   return (
     <div className={className}>
       <Space>
         <Button type="primary" onClick={onLogin}>
           Login
         </Button>
         <Button type="primary" onClick={getAccounts}>
           getAccounts
         </Button>
         <Button type="primary" onClick={dapp}>
           dapp
         </Button>
         <Button type="primary" onClick={tx}>
           tx
         </Button>
 
         <Identicon value={"cXh5StobuVP4B7mGH9xn8dSsDtXks4qLAou8ZdkZ6DbB6zzxe"} size={32} theme={"polkadot"} />
       </Space>
     </div>
   );
 }
 
 export default styled(Home)`
   padding: 20px;
 `;
 