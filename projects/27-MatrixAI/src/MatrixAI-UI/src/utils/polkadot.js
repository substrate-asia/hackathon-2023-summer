import { ApiPromise, WsProvider } from "@polkadot/api";
// import keyring from "@polkadot/ui-keyring";
// import { Keyring }  from '@polkadot/keyring';
// import { cryptoWaitReady } from "@polkadot/util-crypto";
// import { stringToU8a } from '@polkadot/util';
import Keyring from './keyring';

import webconfig from "../webconfig";
const config = webconfig.wsnode;
let keyring=new Keyring(config.keyringOption);

let api = null,
  // keyring = null,
  isconnectSuccess = false,
  isconnecting = false;

export { getAPI, getKeyring, toPublickKey };

async function getAPI() {
  return new Promise((resolve, reject) => {
    try {
      if (isconnectSuccess && api) {
        return resolve(api);
      }
      if (isconnecting) {
        setTimeout(async () => {
          let tmp = await getAPI();
          resolve(tmp);
        }, 100);
      } else {
        connect(() => {
          resolve(api);
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}
function getKeyring() {    
  return keyring;
}
function toPublickKey(addr) {
  // const keyring = new Keyring();
  // let keyring2 = await getKeyring();
  // const pair = keyring.addFromAddress(addr);
  // const pair = keyring2.addFromSeed(stringToU8a(addr));
  // let retstr = Array.from(pair.publicKey, (i) =>
  //   i.toString(16).padStart(2, "0")
  // ).join("");
  // return "0x" + retstr;
  return keyring.getPublicKeyFromAccountId(addr);
}
function connect(cb) {
  console.log("connecting rpc...",config.nodeURL);
  if (!cb) cb = console.log;
  if (isconnecting) return;
  isconnecting = true;
  api = new ApiPromise({
    provider: new WsProvider(config.nodeURL),
  });
  api.on("connected", async () => {
    await api.isReady;
    isconnectSuccess = true;
    console.log("connect rpc success ", config.nodeURL);
    isconnecting = false;
    cb(api);
  });
  api.on("disconnected", () => {
    isconnectSuccess = false;
    setTimeout(connect, 3000);
    console.log("ws disconnected", config.nodeURL);
  });
  api.on("error", (error) => {
    isconnectSuccess = false;
    setTimeout(connect, 3000);
    console.log("error", error.message);
  });
}
