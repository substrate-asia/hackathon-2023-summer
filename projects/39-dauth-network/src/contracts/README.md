# build and test smart contract
- keyledger is using the latest version of !ink, which is 4.0.0 at the moment. Currently it is  not available in crates.io. In order to build and test this smart contract, you need to get the !ink source code.
```
  git clone https://github.com/paritytech/ink.git
  git clone https://github.com/keysafe-protocol/contracts.git
  cp -r contracts/ink ink/examples/
  cd ink/examples/ink
  cargo build # to build the contract
  cargo test  # to run unit tests

