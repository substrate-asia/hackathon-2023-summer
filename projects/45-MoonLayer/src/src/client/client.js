import fs from "fs";

import { ethers } from "ethers";

import { Chain, Common, Hardfork } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
import { VM } from "@ethereumjs/vm";
import { Account, Address } from "@ethereumjs/util";
import { DefaultStateManager } from "@ethereumjs/statemanager";
import { Trie } from "@ethereumjs/trie";
import { Level } from "level";
import { LevelDB } from "../lib/level.js";

import config from "../../config.js";
import { decodeTransaction, encodeTransaction, signTx, txObjToEthTxObj, verifyTxSig } from "./txn.js";
import { decodeBatch, encodeBatch } from "./batch.js";
import { transitState } from "./runtime.js";
import { rpc } from "../rpc/rpc.js";

// Init constants

// process.on("uncaughtException", err => console.log(err));

const { 
    ETH_PRIVKEY,
    ETH_RPC_URL,
    ETH_ADDRESS,
    CHAIN_ID,
    PRIVKEY, 
    SEQUENCER_ADDRESS, 
    SEQUENCER_MODE,
    ROLLUP_ADDRESS, 
    START_SYNC, 
    RPC_PORT,
    LEVEL_PATH,
    LOG_FILE,
    FIRST_MINT_ADDR,
    ADDRESS_DB_PATH,
    INDEX_DB_PATH
} = config;


// Init EVM + state storage

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin });

const trie = await Trie.create({
    db: new LevelDB(new Level(LEVEL_PATH)),
    useKeyHashing: true,
    useRootPersistence: true,
})

const stateManager = new DefaultStateManager({ trie });

const vm = await VM.create({ common, stateManager });

const addressDB = new Level(ADDRESS_DB_PATH);
const indexDB = new Level(INDEX_DB_PATH);

const provider = new ethers.providers.JsonRpcProvider(ETH_RPC_URL);

// Init current sync height

let counter, currentIndex = 0;

if (!fs.existsSync(LOG_FILE)) {
    counter = START_SYNC;

    // Initial coin mint
    const address = new Address(Buffer.from(FIRST_MINT_ADDR.slice(2), "hex"));
    const account = new Account(0n, 10000000000000000000000000n);
    await vm.stateManager.checkpoint();
    await vm.stateManager.putAccount(address, account);
    await vm.stateManager.commit();
    await vm.stateManager.flush();

    // Initial address indexing
    await addressDB.put("0", FIRST_MINT_ADDR.slice(2));
    await indexDB.put(FIRST_MINT_ADDR.slice(2), "0");

    fs.writeFileSync(LOG_FILE, JSON.stringify({
        counter,
        currentIndex
    }));
} else {
    const log = JSON.parse(fs.readFileSync(LOG_FILE));

    counter = log.counter;
    currentIndex = log.currentIndex;
}


// Sync rollup blocks

async function sync() {
    const block = await provider.getBlockWithTransactions(counter);
    
    if (block === null) {
        console.log("LOG :: Synced to current height.");
        
        setTimeout(sync, 12000);

        return;
    }

    for (const transaction of block.transactions) {
        try {
            let msg = transaction.data.slice(2);

            const sequencerAddress = msg.slice(0, 40);
            msg = msg.slice(40);
            const batch = await decodeBatch("0x" + msg, addressDB);

            await transitState(batch, vm, sequencerAddress, addressDB, indexDB);
        } catch (e) {
            // Debug
            // console.log(e);
        }
    }

    console.log("LOG :: Synced up to", counter.toString() + ", please wait.");

    counter++;

    fs.writeFileSync(LOG_FILE, JSON.stringify({
        counter,
        currentIndex
    }));

    setTimeout(sync);
}

await sync();


// RPC

const transactionPool = [];

rpc(RPC_PORT, { vm, transactionPool, config, addressDB, indexDB, trie });


// Sequencer

if (SEQUENCER_MODE) {
    setInterval(async () => {
        if (transactionPool.length === 0) return;

        // Build the batch upload transaction

        const txCount = await provider.getTransactionCount(ETH_ADDRESS); // Get nonce
        
        const tx = Transaction.fromTxData({
            to: ROLLUP_ADDRESS,
            value: 0,
            gasPrice: 50000000000,
            nonce: txCount,

            data: SEQUENCER_ADDRESS + (await encodeBatch(transactionPool.slice(0, 100), indexDB)).slice(2),

            gasLimit: 1000000,
        }).sign(Buffer.from(ETH_PRIVKEY.slice(2), "hex")); // Sign
        
        // Send
        
        const { hash } = await provider.sendTransaction(
            "0x" + tx.serialize().toString("hex")
        );

        // Remove sequenced transactions
        transactionPool.splice(0, 100);

        await provider.waitForTransaction(hash);
    }, 12000);
}
