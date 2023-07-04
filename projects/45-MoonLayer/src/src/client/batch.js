import { decodeTransaction, encodeTransaction } from "./txn.js";


export async function decodeBatch(batchHex, addressDB) {
    batchHex = batchHex.slice(2);

    const txList = [];

    while (batchHex.length > 0) {
        const offset = parseInt(batchHex.slice(0, 8), 16);
        batchHex = batchHex.slice(8);

        const tx = await decodeTransaction("0x" + batchHex.slice(0, offset * 2), addressDB);
        batchHex = batchHex.slice(offset * 2);

        txList.push(tx);
    }

    return txList;
}

export async function encodeBatch(batch, indexDB) {
    let batchHex = "0x";

    for (const tx of batch) {
        const encodedTx = (await encodeTransaction(tx, indexDB)).slice(2);

        batchHex += (encodedTx.length / 2).toString(16).padStart(8, "0"); // Offset for transaction size, 4 bytes
        batchHex += encodedTx; // The transaction itself
    }

    return batchHex;
}
