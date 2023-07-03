<template>
  <div class="flex justify-center relative mb-4">
    <div class="text-center">
      <img src="@/assets/images/icon.jpeg" class="h-[90px] rounded-full" />
      <div class="text-[20px] font-bold">Alita</div>
    </div>
    <a-button type="primary" class="mr-10 w-[120px] absolute top-0 right-0" @click="goCreateNFT">MINT  NFT</a-button>
  </div>
  <a-tabs v-model:activeKey="activeKey" centered @change="handleTabChange">
    <a-tab-pane key="1" tab="Posts">
      <ImageList cardType="posts" :cardList="postList"></ImageList>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Model">
      <ImageList cardType="model" :cardList="modelList"></ImageList>
    </a-tab-pane>
    <a-tab-pane key="3" tab="NFT">
      <ImageList cardType="nft" :cardList="nftList"></ImageList>
    </a-tab-pane>
  </a-tabs>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import ImageList from "../home/components/ImageList.vue";
import { PolkadotAiChanClient} from "@/components/polkadot/ai-model"
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import {ApiPromise, WsProvider} from "@polkadot/api";
import { message } from "ant-design-vue";
import { useRouter } from 'vue-router';
const router = useRouter()

const modelList = reactive<any>([]);
const postList = reactive<any>([]);
const nftList = reactive<any>([])
const activeKey = ref('1');
const goCreateNFT = ()=>{
  router.push('/nftCreate')
}
const handleTabChange = (val: string) => {
  if (val === '1') {
    getPostList();
  } else if(val === '2') {
    getModelList();
  } else if (val === '3') {
    getNFTList();
  }
  console.log('handleTabChange',val)
}
const getPostList = async () => {
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  try {
    //5GHMXJA4EX42bg27atoGvhWu3jKv4ugEJf2N3RxktpBh3qkt
    const res = await client.userPostList(account)
    console.log("postList res:", res);
    Object.assign(postList,res);
  } catch (error:any) {
    message.error('Failed ',error)
  }
}
const getModelList = async () => {
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  try {
    //5GHMXJA4EX42bg27atoGvhWu3jKv4ugEJf2N3RxktpBh3qkt
    const res = await client.userModelList(account)
    console.log("modelList res:", res);
    Object.assign(modelList,res);
  } catch (error:any) {
    message.error('Failed ',error)
  }
}
const getNFTList = async () => {
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  try {
    //5GHMXJA4EX42bg27atoGvhWu3jKv4ugEJf2N3RxktpBh3qkt
    const res = await client.userNFT(account)
    console.log("nftList res:", res);
    Object.assign(nftList,res);
  } catch (error:any) {
    message.error('Failed ',error)
  }
}
const connectCommonPolk = async()=>{
  const allInjected = await web3Enable('my cool dapp');
  console.log(allInjected)
  const allAccounts = await web3Accounts();
  const account = allAccounts[0].address
  const wsProvider = new WsProvider('wss://ws.aishow.hamsternet.io');
  const api = await ApiPromise.create({provider: wsProvider});
  return {
    account,
    api
  }
}

onMounted(()=>{
  handleTabChange(activeKey.value);
  
})
</script>
<style lang="less" scoped>
.ant-tabs,
.ant-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn){
  color: white;
}
:deep(.ant-tabs-tab + .ant-tabs-tab){
   margin: 0;
}
:deep(.ant-tabs-tab){
  width: 90px;
  height: 30px;
  background-color: #C1C2C5;
}
:deep(.ant-tabs-tab-btn){
  text-align: center;
  width: 100%;
}
.ant-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active){
  background-color: #1890ff;
}
.ant-tabs-top :deep(.ant-tabs-nav::before){
  border-bottom: none;
}
</style>