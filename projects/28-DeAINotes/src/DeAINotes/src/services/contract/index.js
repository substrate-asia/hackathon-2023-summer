import abi from "./metadata.js";
import { ContractPromise } from "@polkadot/api-contract";
import { getAPI, getKeyring } from "../../utils/polkadot";
import webconfig from "../../webconfig";
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";

let api = null,
  keyring = null,
  contract = null;
let gasLimit = 100000n * 1000000n; //3000n * 1000000n;

async function init() {
  if (api && contract && keyring) {
    return { api, keyring, contract };
  }
  api = await getAPI();
  keyring = getKeyring();
  console.log("init contract...");
  contract = new ContractPromise(api, abi, webconfig.contractAddress);
  console.log("init contract ok");
  return { api, keyring, contract };
}
function getAccount() {
  return new Promise(async (resolve, reject) => {
    const extensions = await web3Enable("my cool dapp");
    if (extensions.length === 0) {
      console.log("extensions.length=0");
      return reject("extensions not found");
    }
    await init();

    const allAccounts = await web3Accounts();
    console.log("allAccounts", allAccounts);
    if (allAccounts.length == 0) {
      return reject("web3Accounts not found");
    }
    let account = allAccounts[0];
    let addr = localStorage.getItem("addr");
    if (addr) {
      let tmp = allAccounts.find((t) => t.address == addr);
      if (tmp) {
        account = tmp;
      }
    }
    resolve(account);
  });
}
function baseFun(account, transferExtrinsic, statusCb) {
  return new Promise(async (resolve, reject) => {
    const extensions = await web3Enable("my cool dapp");
    if (extensions.length === 0) {
      console.log("extensions.length=0");
      return reject("extensions not found");
    }

    await init();

    const injector = await web3FromSource(account.meta.source);
    console.log("web3FromSource end");
    await transferExtrinsic
      .signAndSend(account.address, { signer: injector.signer }, (result) => {
        let status = result.status;
        console.log("result", result);
        console.log(`Current status: ${status.type}`);
        if (statusCb) {
          statusCb(status.type);
        }
        if (status.isFinalized) {
          console.log("Finalized block hash", status.asFinalized.toHex());
          console.log("************tx hash**************");
          let txHash = result.txHash.toHex();
          console.log(txHash);
          resolve(txHash);
        }
      })
      .catch((error) => {
        console.log(":( transaction failed", error);
        reject(error);
      });
  });
}
function contractMint(fileHash, statusCb) {
  return new Promise(async (resolve, reject) => {
    if (fileHash.indexOf("0x") != 0) {
      fileHash = "0x" + fileHash;
    }
    console.log("fileHash", fileHash);
    await init();
    let account = await getAccount();

    const storageDepositLimit = null;

    let event = contract.tx["psp34Mintable::mint"];
    const transferExtrinsic = event(
      { storageDepositLimit, gasLimit },
      account.address,
      {
        bytes: fileHash,
      }
    );
    console.log("init transferExtrinsic end");
    try {
      let txHash = await baseFun(account, transferExtrinsic, statusCb);
      resolve(txHash);
    } catch (e) {
      reject(e);
    }
  });
}
function contractAsk(fileHash, price, statusCb) {
  return new Promise(async (resolve, reject) => {
    if (fileHash.indexOf("0x") != 0) {
      fileHash = "0x" + fileHash;
    }
    console.log("fileHash", fileHash);
    await init();
    let account = await getAccount();

    const storageDepositLimit = null;

    // const transferExtrinsic = contract.tx.ask(
    //   { storageDepositLimit, gasLimit },
    //   {
    //     bytes: fileHash,
    //   },
    //   price
    // );
    const transferExtrinsic = contract.tx.ask(
      { storageDepositLimit, gasLimit },
      {
        bytes: fileHash,
      },
      { value: price }
    );
    console.log("init transferExtrinsic end");
    try {
      let txHash = await baseFun(account, transferExtrinsic, statusCb);
      resolve(txHash);
    } catch (e) {
      reject(e);
    }
  });
}
function contractTransfer(to, fileHash, statusCb) {
  return new Promise(async (resolve, reject) => {
    if (!to) {
      return reject("to account is null");
    }
    if (!fileHash) {
      return reject("fileHash is null");
    }
    if (fileHash.indexOf("0x") != 0) {
      fileHash = "0x" + fileHash;
    }
    console.log("fileHash", fileHash);
    await init();
    let account = await getAccount();

    const storageDepositLimit = null;
    let enevt = contract.tx["psp34::transfer"];
    const transferExtrinsic = enevt(
      { storageDepositLimit, gasLimit },
      to,
      {
        bytes: fileHash,
      },
      {}
    );
    console.log("init transferExtrinsic end");
    try {
      let txHash = await baseFun(account, transferExtrinsic, statusCb);
      resolve(txHash);
    } catch (e) {
      reject(e);
    }
  });
}
function contractBuy(fileHash,price, statusCb) {
  return new Promise(async (resolve, reject) => {
    if (fileHash.indexOf("0x") != 0) {
      fileHash = "0x" + fileHash;
    }
    console.log("fileHash", fileHash);
    await init();
    let account = await getAccount();

    const storageDepositLimit = null;

    const transferExtrinsic = contract.tx.buy(
      { storageDepositLimit, gasLimit,value:price },
      {
        bytes: fileHash,
      }
    );
    console.log("init transferExtrinsic end");
    try {
      let txHash = await baseFun(account, transferExtrinsic, statusCb);
      resolve(txHash);
    } catch (e) {
      reject(e);
    }
  });
}
function contractCancel(fileHash, statusCb) {
  return new Promise(async (resolve, reject) => {
    if (fileHash.indexOf("0x") != 0) {
      fileHash = "0x" + fileHash;
    }
    console.log("fileHash", fileHash);
    await init();
    let account = await getAccount();

    const storageDepositLimit = null;

    let event = contract.tx["cancel"];
    const transferExtrinsic = event(
      { storageDepositLimit, gasLimit },
      {
        bytes: fileHash,
      }
    );
    console.log("init transferExtrinsic end");
    try {
      let txHash = await baseFun(account, transferExtrinsic, statusCb);
      resolve(txHash);
    } catch (e) {
      reject(e);
    }
  });
}

export {
  contractMint,
  contractAsk,
  contractTransfer,
  contractBuy,
  contractCancel,
};
