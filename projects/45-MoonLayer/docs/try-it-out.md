Demo link: 

## Run the client

You first need to run an MoonLayer client (node) to test. Details are mentioned in the [how-to-run-node](./how-to-run-node.md) documentation.

Note: You should follow the configuration in the how-to-run-node docs, only changing the database path, or else it might not work with these tests. If you are running multiple nodes, be sure to have the same sync height, or else each node will run its own different fork of MoonLayer.

## Example of testing the EVM through a simple contract

Imagine we have a contract like this:

```c#
contract Greeter {
    string greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }
}
```

We will try to deploy the contract, execute a contract's function and then check if everything works correctly.

Hop over to `examples/greeter-contract`, open your terminal and run `test.js`:

```
node test
```

It will send two transactions - a deployment transaction that sets `greeting` to `Hello, world!` and a transaction to call the contract, setting `greeting` to `Hola, mundo!`. After five seconds we will query the `greeting` value and log it out to see if the `greeting` value is changed to `Hola, mundo!` or not. Details on how the code works is explained through the comments in this file.

## Example of testing the EVM with a more complex NFT contract

Available in `examples/erc721-contract`, same as above, open your terminal and run `test.js`:

```
node test
```

Details on how the code works is explained through the comments in this file.

## Make and send the transaction yourself

### Standard transaction

A standard MoonLayer transaction object would look like this:

```js
const transaction = {
    // isToEmpty is set to 0 if we want a standard transaction
    isToEmpty: 0,
    // Because this is a standard transaction, we will use the full address
    to: "029B93211e7793759534452BDB1A74b58De22C9c",
    // Data field used for storing custom data, contract deployment and contract calls.
    data: "",
    // Current sender's nonce
    nonce: 0,
    // Gas = 2^n where n is any number from 9 to 24 
    gas: 2097152,
    // Gas price = 2^n where n is any number from 25 to 40
    gasPrice: 33554432,
    // Amount to send
    value: 320000000n
}
```

Note that you can change the value to whatever you like.

### Address-compressed transaction

An address-compressed MoonLayer transaction object would look like this:

```js
const transaction = {
    // isToEmpty is set to 2 if we want an address-compressed transaction
    isToEmpty: 2,
    // We provide the full address here, but it will be compressed after the transaction object is encoded.
    to: "029B93211e7793759534452BDB1A74b58De22C9c",
    data: "",
    nonce: 0,
    gas: 2097152,
    gasPrice: 33554432,
    value: 320000000n
}
```

### Deployment transaction

A MoonLayer deployment transaction object would look like this:

```js
const transaction = {
    // isToEmpty is set to 1 if we want a deployment transaction
    isToEmpty: 1,
    // We don't provide the receiver's address here.
    data: "", // Add your contract's bytecode here.
    nonce: 0,
    gas: 2097152,
    gasPrice: 33554432,
    value: 320000000n
}
```

### Sign the transaction

Use the `signTx` function exported from `./src/client/txn.js`:

```js
const signedTx = signTx(transaction, privateKeyInBuffer);
```

### Encode the transaction

Before sending the transaction, we must encode it first. We can use the `encodeTransaction` function exported from `./src/client/txn.js` or the `encode_transaction` RPC method for this.

### Send the transaction?

Use the JSON-RPC method `feed_transaction` to send the transaction.


## Reset the chain

If you want to reset the chain and try the test again, you can change the `START_SYNC` configuration to the current block height, delete the old database folders and re-run the node. This will reset the state and ignore all previous transactions.
