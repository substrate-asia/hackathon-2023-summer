
import { Keyring } from '@polkadot/keyring';
import data from './metadata.mjs'
import {waitReady} from '@polkadot/wasm-crypto';
import {ApiPromise,WsProvider} from '@polkadot/api';
import {ContractPromise} from '@polkadot/api-contract';
async function main () {
    await waitReady();
    const wsProvider=new WsProvider('ws://192.168.14.211:9944');
    const api= await ApiPromise.create({provider:wsProvider});//{WsProvider:wsProvider}
    await api.isReady
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });
    const alice = keyring.addFromUri('father weird payment camp saddle assault dune knee network prize enemy liquid');
    const contract = new ContractPromise(api,data,'cXkNELkGo7FzsJ95N5DgDCNR7Xa1jr32s3CnSV7UKVmuZvLtk')
    const gasLimit = 3000n * 1000000n;
    const storageDepositLimit = null;
    let event=contract.tx["psp34Mintable::mint"]
    const tx=event({storageDepositLimit,gasLimit},alice.address,{bytes:'d998cdd4a52fddb9cfc65e98ab42afbe2b279faf588bb1ea5b4e70ccf6db0af0'})
    const {nonce} = await api.query.system.account(alice.address)
    console.log(nonce)
    const signer =api.createType("SignerPayload",{
        method:tx,
        nonce,
        genesisHash:api.genesisHash,
        blockHash:api.genesisHash,
        runtimeVersion:api.runtimeVersion,
    });
    const {signature}=api.createType("ExtrinsicPayload",signer.toPayload(),{
        version:api.extrinsicVersion,
    }).sign(alice);
    tx.addSignature(alice.address,signature,signer.toPayload());
    console.log(tx.toJSON())
}
main();