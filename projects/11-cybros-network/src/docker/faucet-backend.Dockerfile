FROM docker.io/library/node:lts-alpine

# Prevent problems on MacOS Apple Silicon chip
RUN apk add --no-cache python3 make g++ git

ARG GIT_REPO='https://github.com/paritytech/polkadot-testnet-faucet.git'
ARG GIT_TAG='main'
RUN git clone --depth 1 --recurse-submodules --shallow-submodules -j 8 -b ${GIT_TAG} ${GIT_REPO} /backend

WORKDIR /backend

RUN yarn --network-concurrency 1 --frozen-lockfile
RUN yarn build

ENV SMF_BACKEND_NETWORK_DECIMALS=12
ENV SMF_BACKEND_RPC_ENDPOINT="http://127.0.0.1:9933"
ENV SMF_BACKEND_INJECTED_TYPES="{}"
ENV SMF_BACKEND_PORT=5555
ENV SMF_BACKEND_EXTERNAL_ACCESS=0
ENV SMF_BACKEND_RECAPTCHA_SECRET=""
ENV SMF_BACKEND_FAUCET_ACCOUNT_MNEMONIC="BackendFaucetAccountMnemonicNotSet"
ENV SMF_BACKEND_DRIP_AMOUNT="100"
ENV SMF_BACKEND_FAUCET_BALANCE_CAP="10000"

CMD yarn start:backend
