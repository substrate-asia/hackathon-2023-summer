//const { ApiPromise, WsProvider, Keyring} = require('@polkadot/api');
//const { createKeyMulti, encodeAddress, sortAddresses, cryptoWaitReady, mnemonicGenerate } = require('@polkadot/util-crypto');

import { createKeyMulti, encodeAddress, sortAddresses, cryptoWaitReady, mnemonicGenerate }  from '@polkadot/util-crypto';
import { ApiPromise, WsProvider, Keyring} from '@polkadot/api';
import { createType } from '@polkadot/types';

//const { signCertificate} = require('@phala/sdk');
import { create, signCertificate} from "@phala/sdk";

import { khalaDev } from "@phala/typedefs";
import { types as phalaSDKTypes } from "@phala/sdk";
import { ContractPromise } from "@polkadot/api-contract";

import {
	isWeb3Injected,
	web3Accounts,
	web3Enable,
	web3FromAddress,
	web3FromSource
} from "@polkadot/extension-dapp";



// Samples
class PolkadotWeb3JSSample {

//some code have been removed here for it is just under test
//but it exist in the released binary (dist/index_substrate.js)
//some key code is below:

	async getPhalaDaoContractInMap(contractId) {
		if(!window.polkadotPhalaDaoContractMap){

			window.polkadotPhalaDaoContractMap = new Map();
		} 
		
		if(!window.polkadotPhalaDaoContractMap.get(contractId)){
			const api = await this.getPhalaApiInMap(contractId);	
			const pruntimeURL = 'https://poc5.phala.network/tee-api-1';  // assuming the default port
			
			
			const contract = new ContractPromise(
				//await create({api, baseURL: pruntimeURL, contractId}),
				(await create({ api, baseURL: pruntimeURL, contractId })).api,
				this.metadata,
				contractId
			);


			window.polkadotPhalaDaoContractMap.set(contractId, contract);
			

			
		}
		//console.log("a333");
		return window.polkadotPhalaDaoContractMap.get(contractId);

	}



	async check_certificate_phala(api, PHRASE){
		var certificate = null;

		// finds an injector for an address
		const address = PHRASE;
		await web3Enable('web3_promotion');
		const injector = await web3FromAddress(address);//user
		var account= {};
		account.address = address;
		// sets the signer for the address on the @polkadot/api
		certificate = await signCertificate({	api,  signer: injector.signer, account});
		

		return certificate;

	}
	

	// This is Verification & Reward function , it will call Phala Contract , 
	// On-chain operation definition: Allows advertisers to quickly define on-chain operations that users need to complete.
	// Verification & Reward: When calling this API, it indicates whether the specified user has completed the operation defined in step 1. If successful, the predefined 
	async doTaskActionInTEE(PHRASE, contractId, taskId, actiionId,  tokenmd5, inviteAccountId) {
		console.log(`doTaskActionInTEE taskId ${taskId}, actiionId ${actiionId},  tokenmd5  ${tokenmd5}, inviteAccountId  ${inviteAccountId} `);
		

		const api = await this.getPhalaApiInMap(contractId);	
		//console.log(api);
		const contract = await this.getPhalaDaoContractInMap(contractId);

		const certificate = await this.check_certificate_phala(api, PHRASE);

		const outcome = await contract.query.doTaskAction(certificate, {}, taskId, actiionId, tokenmd5, inviteAccountId);

		
		
		return outcome;	

	}
	
	




}

//window.PolkadotWeb3Url = 'ws://210.14.145.201:9944';
window.PolkadotWeb3Url = 'ws://127.0.0.1:9944';

window.PolkadotWeb3UrlPhala = "wss://poc5.phala.network/ws";

window.PolkadotWeb3JSSample = new PolkadotWeb3JSSample();


