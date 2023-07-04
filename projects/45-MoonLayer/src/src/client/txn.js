import { Transaction } from "@ethereumjs/tx";
import { Address } from "@ethereumjs/util";

// Transaction fields

// - "Is to empty?" flag: 1 byte | Int
// - to: 20 bytes / 4 bytes | Hex string
// - value: 11 bytes | BigInt
// - gas: 3 bytes | BigInt
// - gasPrice: 8 bytes | BigInt
// - nonce: 3 bytes | Int
// - r: 32 bytes | Hex string
// - s: 32 bytes | Hex string
// - v: 1 byte | Hex string
// - data: dynamic | Hex string

export async function decodeTransaction(tx, addressDB) {
    try {
        tx = tx.slice(2); // Removes "0x"

        const txObj = { sig: {} };

        txObj.isToEmpty = parseInt(tx.slice(0, 2), 16);
        tx = tx.slice(2);

        if (txObj.isToEmpty === 0) { // If to is not empty
            txObj.to = tx.slice(0, 40);
            tx = tx.slice(40);
        }

        if (txObj.isToEmpty === 2) { // If tx uses address indexing compression
            const index = parseInt(tx.slice(0, 8), 16).toString();

            txObj.to = await addressDB.get(index);

            tx = tx.slice(8);
        }

        txObj.value = BigInt("0x" + tx.slice(0, 22));
        tx = tx.slice(22);

        txObj.gas = 2**(parseInt("0x" + tx.slice(0, 1)) + 9); // Gas = 2^(n+9)
        tx = tx.slice(1);

        txObj.gasPrice = 2**(parseInt("0x" + tx.slice(0, 1)) + 25); // Gas price = 2^(n+25)
        tx = tx.slice(1);

        txObj.nonce = parseInt("0x" + tx.slice(0, 6));
        tx = tx.slice(6);

        txObj.sig.r = BigInt("0x" + tx.slice(0, 64));
        tx = tx.slice(64);

        txObj.sig.s = BigInt("0x" + tx.slice(0, 64));
        tx = tx.slice(64);

        txObj.sig.v = BigInt("0x" + tx.slice(0, 2));
        tx = tx.slice(2);

        txObj.data = tx; // Takes what's left

        return txObj;
    } catch(e) {
        // console.log(3, e);
        throw new Error("Invalid transation format.");
    }
}

export async function encodeTransaction(txObj, indexDB) {
    let calldata = txObj.data.toString(16);

    let to;

    switch (txObj.isToEmpty) {
        case 0:
            to = txObj.to;
            break;
        case 1:
            to = "";
            break;
        case 2:
            to = parseInt(await indexDB.get(txObj.to)).toString(16).padStart(8, "0");
    }

    const tx = (
        txObj.isToEmpty.toString(16).padStart(2, "0") +
        to                                            + 
        txObj.value.toString(16).padStart(22, "0")    +
        Math.round(Math.log(txObj.gas) / Math.log(2) - 9).toString(16)       + 
        Math.round(Math.log(txObj.gasPrice) / Math.log(2) - 25).toString(16) + 
        txObj.nonce.toString(16).padStart(6, "0")     +
        txObj.sig.r.toString(16).padStart(64, "0")    +
        txObj.sig.s.toString(16).padStart(64, "0")    +
        txObj.sig.v.toString(16).padStart(2, "0")     +
        calldata
    );

    return "0x" + tx;
}

export function txObjToEthTxObj(txObj) {
    return Transaction.fromTxData({
        to: txObj.isToEmpty === 0 ? new Address(Buffer.from(txObj.to, "hex")) : undefined,
        value: txObj.value,
        gasPrice: txObj.gasPrice,
        nonce: txObj.nonce,

        v: txObj.sig.v,
        r: txObj.sig.r,
        s: txObj.sig.s,
        
        data: txObj.data !== "" ? "0x" + txObj.data : "",

        gasLimit: txObj.gas,
    });
}

export function signTx(txObj, sendersk) {
    const ethTx = Transaction.fromTxData({
        to: txObj.isToEmpty === 0 ? new Address(Buffer.from(txObj.to, "hex")) : undefined,
        value: txObj.value,
        gasPrice: txObj.gasPrice,
		nonce: txObj.nonce,

        data: txObj.data !== "" ? "0x" + txObj.data : "",

        gasLimit: txObj.gas,
    }).sign(sendersk);

    txObj.sig = { v: ethTx.v, r: ethTx.r, s: ethTx.s };

    return txObj;
}

export function verifyTxSig(txObj) {
    return txObjToEthTxObj(txObj).verifySignature();
}

