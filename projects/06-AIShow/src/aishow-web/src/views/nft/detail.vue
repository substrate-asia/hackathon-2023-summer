<template>
  <div class="grid grid-cols-2 gap-8">
    <div class="border border-solid border-white flex justify-center">
      <img :src="image" class="my-[20px] rounded-[4px]" />
    </div>
    <div>
      <div class="flex justify-between">
        <div class="font-bold">
          <div class="text-[26px]">{{name}}</div>
          <!-- <div>Owned by <label class="text-[#1971c2]"></label></div> -->
        </div>
        <a-button type="primary" class=" w-[120px]" @click="showTransferModal=true" :loading="loading">Trasfer</a-button>
      </div>
      <div class="text-[20px]">
        <div class="mt-10 text-[20px] font-bold">Description：{{description}}</div>
        <div class="mt-5 text-[20px] font-bold">Hash：{{hash}}</div>
        <div class="mt-5 text-[20px] font-bold">CollectionId：{{collectionId}}</div>
        <div class="mt-5 text-[20px] font-bold">ItemId：{{itemId}}</div>
        <div class="mt-5 text-[20px] font-bold">Owner：{{owner}}</div>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="showTransferModal" >
    <template #footer>
      <a-button type="primary" @click="showTransferModal=false">Cancel</a-button>
      <a-button type="primary" class="!ml-8" @click="trasferNft">Confirm</a-button>
    </template>
    <div class="text-[20px] font-bold mb-5">Please enter the address of the transfer user</div>
    <a-input v-model:value="userWalletAddress" placeholder="Wallet Address" allow-clear autocomplete="off" />
  </a-modal>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {ApiPromise, WsProvider} from "@polkadot/api";
import {web3Accounts, web3Enable} from "@polkadot/extension-dapp";
import {CallbackResult, PolkadotAiChanClient} from "@/components/polkadot/ai-model"
import { message } from 'ant-design-vue';
const route = useRoute()
const name = ref()
const description = ref()
const hash = ref()
const image = ref()
const owner = ref()
const loading = ref(false)
const userWalletAddress = ref('')
const showTransferModal = ref(false)
const collectionId:any = route.query.collectionId
const itemId:any = route.query.itemId
const getNftDetail = async()=>{
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  const res = await client.nftDetail(collectionId,itemId)
  console.log('getNftDetail',res)
  hash.value = res.itemUuid
  image.value = res.itemLink
  name.value = res.name
  description.value = res.description
  owner.value = res.owner
}
// 交易nft
const trasferNft = async()=>{
  if(userWalletAddress.value.trim()==''){
    message.error('Please enter the address of the transfer user')
    return
  }
  showTransferModal.value = false
  loading.value = true
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  console.log('交易nft参数',collectionId,itemId,userWalletAddress.value)
  try {
    client.nftTransfer(collectionId,itemId,userWalletAddress.value,(result:CallbackResult)=>{
        if(result.status === "inBlock") {
            message.success('Transfer success')
        }else if(result.status === "error"){
            message.error(result.error)
        }
      loading.value = false
    })
  } catch (error:any) {
    message.error("Failed ",error)
    loading.value = false
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
  getNftDetail()
})
</script>
<style lang="less" scoped>
</style>
