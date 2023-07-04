import { loadSync as loadEnvSync } from "https://deno.land/std/dotenv/mod.ts"
import { parse } from "https://deno.land/std/flags/mod.ts"
import { sleep } from "https://deno.land/x/sleep/mod.ts";

import { Contract, InfuraProvider, EventLog } from "npm:ethers"

import { ApiPromise, HttpProvider, Keyring, WsProvider } from "https://deno.land/x/polkadot/api/mod.ts"
import { cryptoWaitReady, encodeAddress, blake2AsU8a, secp256k1Compress } from "https://deno.land/x/polkadot/util-crypto/mod.ts"
import { hexToU8a } from "https://deno.land/x/polkadot/util/mod.ts"

import { SubmittableExtrinsic } from "https://deno.land/x/polkadot/api/submittable/types.ts";
import { ISubmittableResult } from "https://deno.land/x/polkadot/types/types/extrinsic.ts";
import { KeyringPair } from "https://deno.land/x/polkadot/keyring/types.ts";

function eachSlice<T>(array: T[], size: number, callback: (slicedArray: T[]) => void) {
  const l = array.length
	let i = 0
  for (; i < l; i += size){
    callback.call(array, array.slice(i, i + size))
  }
};

const savedBlockNumberFilePath = "./tmp/current_block"

const env = loadEnvSync()
const parsedArgs = parse(Deno.args, {
  alias: {
    "dryRun": "dry",
  },
  boolean: [
    "dryRun",
  ],
  default: {
    dryRun: false,
  },
})
const dryRun = parsedArgs.dryRun

const evmChainProvider = new InfuraProvider(env.INFURA_NETWORK, env.INFURA_API_KEY)

const bridgeContractABI = [
	"event PromptRequested(address indexed sender, uint256 fee, string input, bytes publicKey, bool simple)"
];
const contract = new Contract(env.EVM_BRIDGE_CONTRACT_ADDRESS, bridgeContractABI, evmChainProvider)

function createSubstrateApi(rpcUrl: string): ApiPromise | null {
  let provider = null;
  if (rpcUrl.startsWith("wss://") || rpcUrl.startsWith("ws://")) {
    provider = new WsProvider(rpcUrl);
  } else if (
    rpcUrl.startsWith("https://") || rpcUrl.startsWith("http://")
  ) {
    provider = new HttpProvider(rpcUrl);
  } else {
    return null;
  }

  return new ApiPromise({
    provider,
    throwOnConnect: true,
    throwOnUnknown: true,
  });
}

await cryptoWaitReady().catch((e) => {
  console.error(e.message);
  Deno.exit(1);
});

const subOperatorKeyPair: KeyringPair = (() => {
  const operatorMnemonic = env.SUB_OPERATOR_MNEMONIC;
  if (operatorMnemonic === undefined || operatorMnemonic === "") {
		console.error("Mnemonic is blank")
    Deno.exit(1)
  }

  try {
    return new Keyring({ type: "sr25519" }).addFromUri(operatorMnemonic, { name: "The operator" });
  } catch (e) {
    console.error(`Operator mnemonic invalid: ${e.message}`);
    Deno.exit(1)
  }
})();
console.log(`Operator: ${subOperatorKeyPair.address}`);

const api = createSubstrateApi(env.SUB_NODE_RPC_URL);
if (api === null) {
  console.error(`Invalid RPC URL "${env.SUB_NODE_RPC_URL}"`);
  Deno.exit(1);
}

api.on("error", (e) => {
  console.error(`Polkadot.js error: ${e.message}"`);
  Deno.exit(1);
});

await api.isReady.catch((e) => console.error(e));

let startBlock = (() => {
	const currentBlock = (() => {
		try {
			const fromFile = parseInt(Deno.readTextFileSync(savedBlockNumberFilePath).trim())
			return fromFile > 0 ? fromFile : 0
		} catch (_e) {
			return 0;
		}
	})()
	if (currentBlock > 0) {
		return currentBlock
	}

  const defaultStartBlock = parseInt(env.EVM_BRIDGE_CONTRACT_START_BLOCK)
  if (defaultStartBlock > 0) {
    return defaultStartBlock;
  }

  return undefined
})();

const jobPoolId = env.JOB_POOL_ID
const jobPolicyId = env.JOB_POLICY_ID
const jobSpecVersion = env.JOB_SPEC_VERSION

do {
	console.log(`Start block ${startBlock}`)
	// const latestBlock = await evmChainProvider.getBlockNumber();
	// console.log(latestBlock)

	let highestBlockNumber: number = startBlock ?? 0
	const evmEvents: EventLog[] = []
	for (const event of (await contract.queryFilter("PromptRequested", startBlock))) {
		if (event instanceof EventLog) {
			evmEvents.push(event)
			if (event.blockNumber > highestBlockNumber) {
				highestBlockNumber = event.blockNumber
			}
		}
	}
	if (evmEvents.length == 0) {
		console.log("No new event")
		await sleep(4)
	}

	const txPromises: SubmittableExtrinsic<"promise", ISubmittableResult>[] = [];
	eachSlice(evmEvents, 50, (slicedEvents) => {
		txPromises.push(
			api.tx.utility.forceBatch(
				slicedEvents.map(
					(event: EventLog) => {
						const prompt = event.args[2].toString().trim()
						if (prompt.length === 0) {
							console.info("Prompt is blank, skip")
							return []
						}

						const simple = event.args[4]
						if (simple) {
							console.log(`Sender: Unknown Prompt: ${prompt}`)

							const input = {e2e: false, data: prompt}
							return [
								api.tx.offchainComputing.createJob(jobPoolId, jobPolicyId, jobSpecVersion, false, JSON.stringify(input), null),
							]
						} else {
							let senderPublicKey = event.args[3].toString().trim()
							if (senderPublicKey.length === 0 || senderPublicKey === "0x") {
								console.info("Public key is blank, skip")
								return []
							}
							if (senderPublicKey.length === 130) {
								senderPublicKey = `0x04${senderPublicKey.substring(2)}`
							}

							try {
								const subAddressFromPublicKey = encodeAddress(blake2AsU8a(secp256k1Compress(hexToU8a(senderPublicKey))), 42)
								console.log(`Sender: ${subAddressFromPublicKey} Prompt: ${prompt}`)
								
								const parsedPrompt = JSON.parse(prompt)
								if (!parsedPrompt.data || parsedPrompt.data.toString().trim().length === 0) {
									console.info("Invalid prompt, skip")
									return []
								}
								
								return [
									api.tx.offchainComputing.createJobFor(subAddressFromPublicKey, jobPoolId, jobPolicyId, jobSpecVersion, false, prompt, null),
								]
							} catch (e) {
								console.info(`Invalid input ${e.message}`)
								return []
							}
						}
					}
				).flat()
			)
		)
	})

	for (const txPromise of txPromises) {
		console.info(`Sending offchainComputing.createJob(poolId, policyId, implSpecVersion, input, softExpiresIn) in batch`);
		console.info(`Call hash: ${txPromise.toHex()}`);

		if (!dryRun) {
			const txHash = await txPromise.signAndSend(subOperatorKeyPair, { nonce: -1 });
			console.info(`Transaction hash: ${txHash.toHex()}`);
		}
	}

	startBlock = highestBlockNumber + 1
	if (!dryRun) {
		Deno.writeTextFileSync(savedBlockNumberFilePath, (highestBlockNumber + 1).toString())
	}

	await sleep(4)
} while (true);
