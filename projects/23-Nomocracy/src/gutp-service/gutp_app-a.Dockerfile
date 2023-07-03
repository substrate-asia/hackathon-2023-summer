FROM docker.io/library/ubuntu:20.04
LABEL description="EightFish:gutp_standalone"

WORKDIR /eightfish

RUN mkdir -p /eightfish/target/wasm32-wasi/release/

COPY ./spin /usr/local/bin
COPY ./gutp/spin-a.toml /eightfish/gutp_app_spin.toml
COPY ./target/wasm32-wasi/release/gutp.wasm /eightfish/target/wasm32-wasi/release/
