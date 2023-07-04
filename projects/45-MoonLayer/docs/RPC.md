## MoonLayer JSON-RPC docs

### Request body

Every method will have the same request body like this:

```js
{
    "method": "Method to call",
    "params": {}
}
```

### Response

...and a response like this:

```js
{
    "success": true | false,
    "payload": "Response's payload/main message",
    "error": {
        "Optional, only exists in requests that fail."
    }
}
```

Note: All methods are POST requests.

### Methods' params

* `get_account`: 
    * Get the account's info (state) from provided address.
    * params:
        * `address` (string): Address to get state from.
    * response (object):
        * `storageRoot` (string): Account's storage root. 
        * `codeHash` (string): Account's code hash. 
        * `balance`(string): Account's balance.
        * `nonce` (string): Account's current nonce.

* `feed_transaction`: 
    * Feed a transaction into a sequencer's transaction pool.
    * params:
        * `transaction` (string): Raw MoonLayer transaction.
    * response (object):
        * `true/false` (bool): `true` if transaction is valid, `false` if not.

* `encode_transaction`: 
    * Encode a transaction from transaction object.
    * params:
        * `transaction` (object): Transaction object.
    * response (string): Raw transaction in hex.

* `emulate_call`:
    * Emulate a contract call but does not mess with our node's state (used for calling view/pure functions mostly). 
    * params:
        * `contractAddress` (string): Contract address.
        * `senderAddress` (string): Sender address.
        * `data` (string): Call data.
        * `types` (array): Array of types of each parameter of the call.
    * response (array): Returned values.

* `get_storage_slot`:
    * Get value from a storage slot of an account from provided key.
    * params:
        * `address` (string): Address to get state from.
        * `key` (string): Storage key.
    * response (string): Value at storage slot.

* `get_storage_keys`:
    * Get storage keys of an account.
    * params:
        * `address` (string): Address to get state from.
    * response (string[]): Array of keys.

* `get_config`:
    * Get storage keys of an account.
    * response (object): The node's configurations.

* `get_address_from_index`:
    * Get address from index.
    * params:
        * `index` (string): Address index.
    * response (string): Address.

* `get_index_from_address`:
    * Get index from address.
    * params:
        * `index` (string): Address.
    * response (string): Address index.
