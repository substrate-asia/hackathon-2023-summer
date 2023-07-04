## Running the node

### Dependencies

* Latest releases of Node and npm.

### Installation

Clone this repository to your computer.

In the downloaded folder, install all the needed NPM packages:

```
npm install 
```

### Configuration

In the directory downloaded, we will see a file called `config.js`, that's where we will configure our MoonLayer client.

Originally, it will come with something like this:

```js
export default {
    // Your Moonbeam/Ethereum's private key
    // This key is only used for testing!!! DON'T USE IT FOR PRACTICAL PURPOSES!
    ETH_ADDRESS: "0x0896482E15075700D4bE7075E72eE63Dea7D9041",
    ETH_PRIVKEY: "0xc6c0c454257c778a35aa7f520fe3276846ec17915bd8e844721085e85b8058c9",
    // Can be replaced with another RPC
    ETH_RPC_URL: "https://rpc.api.moonbase.moonbeam.network",
    // Chain ID of Moonbeam Alpha Testnet, can be changed if you are using another network (e.g Moonbeam mainnet).
    CHAIN_ID: 1287,

    // Your MoonLayer's private key on the layer 2 (similar to Moonbeam/Ethereum's private key)
    // This key is only used for testing!!! DON'T USE IT FOR PRACTICAL PURPOSES!
    // We recommend using this key for testing because currently all tokens are minted to this account
    PRIVKEY: "0x3f1c78a7c6c46e3d8a45b1bc29048719bff0903375cd066ccb7675ce4c77752e",
    
    // Enable to become sequencer node, leave false if you use user node only
    SEQUENCER_MODE: true,
    // Address to be paid in (gas fees from transactions you sequenced will bet transferred to this address)
    // This is also the address generated from the private key above
    SEQUENCER_ADDRESS: "0xa39372a91baa8dcad7ee9da3d8311cf249dded06",

    // Contract address for batch upload, don't change this one
    ROLLUP_ADDRESS: "0x029B93211e7793759534452BDB1A74b58De22C9c",
    
    // Original Moonbeam Alpha block height to start syncing from, this also should not be changed
    // Although, as mentioned in the tutorial, you can change it as a way to reset the chain
    START_SYNC: 4663060,

    // RPC server config, you can set it to whatever you like, but you should just leave it 3000 cause our tests use it.
    RPC_PORT: 3000,

    // Directories to store our databases in, here's an example on our computer.
    // THESE ARE MUST-HAVEs AND THE USER MUST PROVIDE THEIR OWN PATH TO HAVE THE DATABASE STORED
    // The main MoonLayer database that includes state data, contract storage, etc.
    LEVEL_PATH: "C:/Users/npqua/desktop/MoonLayer/leveldb",
    // A log file that contains the current synced block and current address index
    LOG_FILE: "C:/Users/npqua/desktop/MoonLayer/log",
    // Address index DB used for compression
    ADDRESS_DB_PATH: "C:/Users/npqua/desktop/MoonLayer/addressdb",
    INDEX_DB_PATH: "C:/Users/npqua/desktop/MoonLayer/indexdb",

    // Genesis details
    // The first account to have the MoonLayer tokens minted to
    // This is also the address generated from the private key above
    FIRST_MINT_ADDR: "0xa39372a91baa8dcad7ee9da3d8311cf249dded06",
    // First minted tokens (must not exceed 11 bytes)
    FIRST_MINT_AMOUNT: "100000000000000000000000000",

    // Choose whether to export the private key or not, should be false unless you are doing something really special and dangerous.
    EXPORT_PRIVKEY: false
}
```

### Running 

After having all the configurations done, simply type into your console:

```
node .
```

to start up the client.

### JSON-RPC APIs

For dapps and tools to interact with the MoonLayer client, the client exposes JSON-RPC APIs for dapps to call locally.

[Here is the documentation on the RPC methods.](./RPC.md)

### Testing

To test it out yourself, go to [`try-it-out.md`](./try-it-out.md).

### Reset the chain

If you want to reset the chain, you can change the START_SYNC configuration to the current block height, delete the old database folders and re-run the node. What this does it that it will start off with an entirely new state, ignoring all transactions done in the past, therefore making an entirely new chain.

This is also mentioned again in `try-it-out.md`.
