## 编译环境安装
```
rustup install nightly-2023-03-18

rustup target add wasm32-unknown-unknown --toolchain nightly-2023-03-18

cargo +nightly-2023-03-18 build --release
```
## macOs needs to be installed
```
cargo update -p parity-db
```
## build project
```
cargo build --release
```