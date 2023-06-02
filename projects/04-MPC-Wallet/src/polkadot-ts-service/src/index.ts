/*
Copyright 2022 The Dapr Authors
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// https://github.com/dapr/js-sdk/tree/main/examples/http/actor

import { initDapr,initTypeOrm,initEthers } from './config';
import { App,Chain } from './routes';

async function start() {
  // 初始化 dapr
  // const { client,server, invoker } = await initDapr();
  const {server, invoker } = await initDapr();
  //数据库初始化
  const { orm } = await initTypeOrm();
  const {
    wallet,
    accountOwnerAddress,
    tokenPaymaster,
    simpleAccountFactory,
    entryPoint} = await initEthers();

  await new App(orm,invoker).routes();

  await new Chain(wallet,accountOwnerAddress,tokenPaymaster,simpleAccountFactory,entryPoint,orm,invoker).router();
  // 启动dapr 服务
  await server.start();
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});

export default { start }