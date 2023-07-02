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




}

//window.PolkadotWeb3Url = 'ws://210.14.145.201:9944';
window.PolkadotWeb3Url = 'ws://127.0.0.1:9944';

window.PolkadotWeb3UrlPhala = "wss://poc5.phala.network/ws";

window.PolkadotWeb3JSSample = new PolkadotWeb3JSSample();


