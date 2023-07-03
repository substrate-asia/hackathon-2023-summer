# Matrix AI

A fresh [MatrixAI](https://substrate.io/) Chain node, ready for hacking :rocket:

## Getting Started

Depending on your operating system and Rust version, there might be additional packages required to compile this project.
Check the [installation](https://docs.substrate.io/install/) instructions for your platform for the most common dependencies.

### Build

Use the following command to build the node without launching it:

```sh
cargo build --release
```

### Tests

Use the following command to run the Rust unit tests:

```sh
cargo test
```

### Single-Node Development Chain

The following command starts a single-node development chain that doesn't persist state:

```sh
./target/release/matrix-ai --dev
```

To purge the development chain's state, run the following command:

```sh
./target/release/matrix-ai purge-chain --dev
```

To start the development chain with detailed logging, run the following command:

```sh
RUST_BACKTRACE=1 ./target/release/matrix-ai -ldebug --dev
```

### Run with Docker

```sh
docker run -it --rm -p 9944:9944 contractlab/matrixai-chain matrix-ai --dev --unsafe-ws-external
```

### Connect with Polkadot-JS Apps Front-End

After you start the node locally, you can interact with it using the hosted version of the [Polkadot/Substrate Portal](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944) front-end by connecting to the local node endpoint.
A hosted version is also available on [IPFS (redirect) here](https://dotapps.io/) or [IPNS (direct) here](ipns://dotapps.io/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer).
You can also find the source code and instructions for hosting your own instance on the [polkadot-js/apps](https://github.com/polkadot-js/apps) repository.
