// Bad RPC server implementation, will be updated soon.

"use strict";

import Fastify from "fastify";
import { RLP } from "@ethereumjs/rlp";
import { hexToBytes } from 'ethereum-cryptography/utils.js'
import config from "../../config.js";
import { Address } from "@ethereumjs/util";
import { decodeTransaction, encodeTransaction } from "../client/txn.js";
import { Interface, defaultAbiCoder as AbiCoder } from '@ethersproject/abi';

const fastify = Fastify();

export function rpc(PORT, clientObj) {
    const { vm, transactionPool, addressDB, indexDB, trie } = clientObj;

    const config = { ...clientObj.config };

    if (!config.EXPORT_PRIVKEY) {
        delete config.ETH_PRIVKEY;
        delete config.PRIVKEY;
    }

    process.on("uncaughtException", err => console.log("LOG ::", err));

    fastify.post("/", async (req, reply) => {
        function throwError(message, status, payload = null) {
            reply.status(status);

            reply.send({
                success: false,
                payload: null,
                error: { message }
            });
        }

        function respond(payload) {
            reply.send({
                success: true,
                payload
            })
        }

        if (typeof req.body.params !== "object" && typeof req.body.method !== "string") {
            throwError("Invalid method.", 404);

            return;
        }

        switch (req.body.method) {
            case "get_account":
                if (typeof req.body.params.address === "string") {
                    try {
                        const address = new Address(Buffer.from(req.body.params.address.slice(2), "hex"));
                        const state = await vm.stateManager.getAccount(address);

                        respond({
                            storageRoot: state.storageRoot.toString("hex"),
                            codeHash: state.codeHash.toString("hex"),
                            balance: state.balance.toString(),
                            nonce: state.nonce.toString()
                        });
                    } catch (e) {
                        // console.log(e);

                        throwError("Error getting state from address provided.", 400);
                    }                
                } else {
                    throwError("Invalid params.", 400);
                }

                break;

            case "feed_transaction":
                if (!config.SEQUENCER_MODE) {
                    throwError("Not a sequencer.", 400);
                    break;
                }

                try {
                    transactionPool.push(
                        await decodeTransaction(req.body.params.transaction, addressDB)
                    );
                } catch (e) {
                    throwError("Invalid transaction.", 400);
                }

                respond(true);
                
                break;

            case "encode_transaction":
                try {
                    const transaction = req.body.params.transaction;

                    transaction.value = BigInt(transaction.value);
                    transaction.sig.r = BigInt(transaction.sig.r);
                    transaction.sig.s = BigInt(transaction.sig.s);
                    transaction.sig.v = BigInt(transaction.sig.v);

                    respond(await encodeTransaction(transaction, indexDB));
                } catch (e) {
                    throwError("Invalid transaction.", 400);
                }

                break;
            
            case "emulate_call":
                try {
                    const vmCopy = await vm.copy();
                    await vmCopy.stateManager.setStateRoot(await vm.stateManager.getStateRoot());

                    // const address = new Address(Buffer.from("b6d655d2db23f255061a43e1943566c53ae584b8", "hex"));
                    // console.log( (await vm.stateManager.getAccount(address)).codeHash.toString("hex") );

                    const greetResult = await vmCopy.evm.runCall({
                        to: new Address(Buffer.from(req.body.params.contractAddress, 'hex')),
                        caller: new Address(Buffer.from(req.body.params.senderAddress, 'hex')),
                        origin: new Address(Buffer.from(req.body.params.senderAddress, 'hex')), 
                        data: hexToBytes(req.body.params.calldata),
                    });

                    // console.log(greetResult.execResult);

                    const results = AbiCoder.decode(req.body.params.types, greetResult.execResult.returnValue);

                    respond(results);
                } catch (e) {
                    // console.log(e);
                    throwError("Invalid call.", 400);
                }

                break;
            
            case "get_storage_slot":

                if (
                    typeof req.body.params.address === "string" &&
                    typeof req.body.params.key === "string"
                ) {
                    try {
                        const address = new Address(Buffer.from(req.body.params.address.slice(2), "hex"));
                        const storageRoot = (await vm.stateManager.getAccount(address)).storageRoot;
                        const storageTrie = trie.copy();

                        storageTrie.root(storageRoot);

                        const stream = storageTrie.createReadStream();

                        await new Promise((resolve, reject) => {
                            stream
                                .on("data", (data) => {
                                    if (data.key.toString("hex") === req.body.params.key) {
                                        respond(RLP.decode(data.value).toString("hex"));
                                        resolve();
                                    }
                                })
                                .on("end", () => {
                                    throwError("Could not find value for provided slot.", 400);
                                    resolve();
                                })
                        });
                    } catch (e) {
                        throwError("Error getting state from address provided.", 400);
                    }
                }

                break;
            
            case "get_storage_keys":

                if (typeof req.body.params.address === "string") {
                    try {
                        const address = new Address(Buffer.from(req.body.params.address.slice(2), "hex"));
                        const storageRoot = (await vm.stateManager.getAccount(address)).storageRoot;
                        const storageTrie = trie.copy();

                        storageTrie.root(storageRoot);

                        const stream = storageTrie.createReadStream();

                        const keys = [];

                        await new Promise((resolve, reject) => {
                            stream
                                .on("data", (data) => {
                                    keys.push(data.key.toString("hex"))
                                })
                                .on("end", () => {
                                    respond(keys);
                                    resolve();
                                });
                        });
                    } catch (e) {
                        // console.log(e);

                        throwError("Error getting state from address provided.", 400);
                    }                
                }

                break;

            case "get_config":

                respond(config);

                break;

            case "get_address_from_index":

                if (
                    typeof req.body.params.index === "string" &&
                    (await addressDB.keys().all()).includes(req.body.params.index)
                ) {
                    respond(await addressDB.get(req.body.params.index)); 
                } else {
                    throwError("Invalid params,", 400);
                }

                break;

            case "get_index_from_address":

                if (
                    typeof req.body.params.address === "string" &&
                    (await indexDB.keys().all()).includes(req.body.params.address)
                ) {
                    respond(await indexDB.get(req.body.params.address)); 
                } else {
                    throwError("Invalid params,", 400);
                }

                break;

            default:
                throwError("Invalid method.", 404);
        }
    });

    fastify.listen(PORT, (err, address) => {
        if (err) {
            console.log("LOG :: Error at RPC server: Fastify: ", err);
            process.exit(1);
        }

        console.log(`LOG :: RPC server running on PORT ${PORT}`);
    });
}
