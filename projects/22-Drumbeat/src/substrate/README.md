# AdMeta

This is the AdMeta blockchain implementation.

## Getting Started

### Rust Setup

First, complete the [basic Rust setup instructions](./docs/rust-setup.md).

### Run

Use Rust's native `cargo` command to build and launch the AdMeta node:

```sh
cargo run --release -- --dev
```

### Build

The `cargo run` command will perform an initial build. Use the following command to build the node
without launching it:

```sh
cargo build --release
```

### Embedded Docs

Once the project has been built, the following command can be used to explore all parameters and
subcommands:

```sh
./target/release/admeta -h
```

## Run

The provided `cargo run` command will launch a temporary node and its state will be discarded after
you terminate the process. After the project has been built, there are other ways to launch the
node.

### Single-Node Development Chain

This command will start the single-node development chain with non-persistent state:

```bash
./target/release/admeta --dev
```

Purge the development chain's state:

```bash
./target/release/admeta purge-chain --dev
```

Start the development chain with detailed logging:

```bash
RUST_BACKTRACE=1 ./target/release/admeta -ldebug --dev
```

> Development chain means that the state of our chain will be in a tmp folder while the nodes are
> running. Also, **alice** account will be authority and sudo account as declared in the
> [genesis state](https://github.com/AdMetaNetwork/admeta/blob/main/node/src/chain_spec.rs#L52).
> At the same time the following accounts will be pre-funded:
>
> - Alice
> - Bob
> - Alice//stash
> - Bob//stash

In case of being interested in maintaining the chain' state between runs a base path must be added
so the db can be stored in the provided folder instead of a temporal one. We could use this folder
to store different chain databases, as a different folder will be created per different chain that
is ran. The following commands shows how to use a newly created folder as our db base path.

```bash
// Create a folder to use as the db base path
$ mkdir my-chain-state

// Use of that folder to store the chain state
$ ./target/release/admeta --dev --base-path ./my-chain-state/

// Check the folder structure created inside the base path after running the chain
$ ls ./my-chain-state
chains
$ ls ./my-chain-state/chains/
dev
$ ls ./my-chain-state/chains/dev
db keystore network
```

### Connect with Polkadot-JS Apps Front-end

Once the AdMeta node is running locally, you can connect it with **Polkadot-JS Apps** front-end to
interact with your chain. [Click
here](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944) connecting the Apps to your
local AdMeta node.

### Run in Docker

First, install [Docker](https://docs.docker.com/get-docker/) and
[Docker Compose](https://docs.docker.com/compose/install/).

Then run the following command to start a single node development chain.

```bash
./scripts/docker_run.sh
```

This command will firstly compile your code, followed by the whole unit test run, and then start a
local development network.

## Test

### Unit Test

Run `cargo test` command to build and launch all unit tests. The unit tests will stop if all tests
pass or any of them fails.

```sh
cargo test
```

### Test with WebApp

Please see the [AdMeta WebApp guide](https://docs.admeta.network/guides/how-to-use-admeta-webapp)
about how to test using AdMeta WebApp to interact with AdMeta Testnet.

## License

GPLv3
