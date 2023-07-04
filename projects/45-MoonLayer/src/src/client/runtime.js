import fs from "fs";
import { Account, Address } from "@ethereumjs/util";
import { txObjToEthTxObj } from "./txn.js";
import config from "../../config.js";

const { LOG_FILE } = config;

export async function transitState(batch, vm, sequencerAddress, addressDB, indexDB) {
    for (const txn of batch) {
        const ethTxn = txObjToEthTxObj(txn);

        let result;

        await vm.stateManager.checkpoint();

        try {
            
            result = await vm.runTx({ tx: ethTxn });

            // console.log(result);
        } catch (e) {
            await vm.stateManager.revert();
            await vm.stateManager.flush();

            // Debug
            // console.log(2, e);

            // Skip to the next transaction
            continue;
        }

        const { minerValue } = result;

        // Get sequencer's address and state
        const address = new Address(Buffer.from(sequencerAddress, "hex"));
        const oldState = await vm.stateManager.getAccount(address);
        // Transfer gas fees to the sequencer
        await vm.stateManager.modifyAccountFields(address, { balance: oldState.balance + minerValue });

        await vm.stateManager.commit();
        await vm.stateManager.flush();


        // Update address indexing when a new address is found

        const log = JSON.parse(fs.readFileSync(LOG_FILE));

        let indexNumber = log.currentIndex;

        if ( txn.isToEmpty !== 1 && !(await indexDB.keys().all()).includes(txn.to) ) {
            indexNumber += 1;
            await addressDB.put(indexNumber.toString(), txn.to);
            await indexDB.put(txn.to, indexNumber.toString());
        }

        // Store updated address index height into log
        log.currentIndex = indexNumber;

        fs.writeFileSync(LOG_FILE, JSON.stringify({
            counter: log.counter,
            currentIndex: indexNumber
        }));
    }
}
