FROM node:alpine AS polkadot-ts-node-builder
WORKDIR /home/node/app
ARG CNF_VAR
COPY . .
COPY .env.${CNF_VAR} .env
RUN npm config set registry https://registry.npm.taobao.org && npm i -g rimraf && npm install -g typescript
RUN rimraf ./dist && tsc

#RUN  npm config set registry https://registry.npm.taobao.org && npm i -g rimraf && yarn
#RUN yarn build

FROM polkadot-ts-node-builder as polkadot-ts-node_v0.0.1
WORKDIR /app
COPY --from=polkadot-ts-node-builder /home/node/app/ .
COPY ./src/contracts/ ./dist/contracts/
CMD [ "node", "./dist/index.js" ]