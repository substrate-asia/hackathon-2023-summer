<template>
  <ImageList cardType="home" :cardList="cardList"></ImageList>
</template>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import ImageList from "./components/ImageList.vue";
import { PolkadotAiChanClient} from "@/components/polkadot/ai-model"
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import {ApiPromise, WsProvider} from "@polkadot/api";
import { message } from "ant-design-vue";

const cardList = reactive<any>([]);

const getList = async () => {
  
  // 以下需要配置为全局
  const allInjected = await web3Enable('my cool dapp');
  console.log(allInjected)
  const allAccounts = await web3Accounts();
  const account = allAccounts[0].address
  const wsProvider = new WsProvider('wss://ws.aishow.hamsternet.io');
  const api = await ApiPromise.create({provider: wsProvider});
  // 以上需要配置为全局
  const client = new PolkadotAiChanClient(api,account)
  try {
    const res = await client.modelList()
    console.log("res:", res);
    Object.assign(cardList,res);
  } catch (error:any) {
    message.error('Failed ',error)
  }
}
onMounted(() => {
  getList();
});
</script>
<style lang="less" scoped>
</style>