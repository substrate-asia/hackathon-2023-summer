<template>
  <div class="top-0 px-[32px] bg-[#000000] z-10 fixed h-[64px] w-full border-b">
    <div class="flex justify-between items-center h-full">
      <div class="text-[30px] font-bold">
        <!-- <span class="text-red-600 cursor-pointer" @click="goHome">AI</span><span class="cursor-pointer mr-[10px]" @click="goHome">SHOW</span> -->
        <img @click="goHome" src="@/assets/icons/AiSHOWLOGO.png" class="h-[20px] mr-[10px] cursor-pointer" />
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click.prevent>
            <img src="@/assets/icons/add.svg" class="h-[20px]" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0" @click="goUploadModal">
                Upload a model
              </a-menu-item>
              <a-menu-item key="1" @click="goPostImages">
                Post images
              </a-menu-item>
              <!-- <a-menu-divider /> -->
              <a-menu-item key="3" @click="goWriteAnArticle">Mint a NFT</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <div>
        <a-button v-if="!walletAddress" class="ml-8" type="primary" @click="connectWallet">Connect Wallet</a-button>
        <sapn v-if="walletAddress" class="inline-block h-[40px] px-2 leading-[32px] border-[#1971c2] border-solid rounded-lg text-[#1971c2]">{{walletAddress}}</sapn>
        <img v-if="walletAddress" @click="goProfile" src="@/assets/images/icon.jpeg" class="h-[40px] rounded-full cursor-pointer ml-5" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue' 
import { useRouter } from 'vue-router';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
const router = useRouter()
const walletAddress = ref('')
const connectWallet = async() => {
  const extensions = await web3Enable("my cool dapp");
  console.log('extensions',extensions);
  const allAccounts = await web3Accounts();
  console.log('allAccounts',allAccounts);
  const walletAddr = allAccounts[0]?.address
  sessionStorage.setItem("walletAddress", walletAddr);
  walletAddress.value = walletAddr.substring(0,5)+ "..." +walletAddr.substring(walletAddr.length-4)
  const wsProvider = new WsProvider('wss://ws.aishow.hamsternet.io');
  const api = await ApiPromise.create({provider: wsProvider});
  console.log('api~~~~~~~',api)
  // 先把polka钱包账号存起来，防止后面需要使用到
  sessionStorage.setItem("account", JSON.stringify(walletAddr));
  sessionStorage.setItem("allAccounts", JSON.stringify(allAccounts));
  // sessionStorage.setItem("api", JSON.stringify(api));
}
const goUploadModal = ()=>{
  router.push('/modelCreate')
  console.log('goUploadModal')
}
const goPostImages = ()=>{
  console.log('goPostImages')
  router.push('/postCreate')
}
const goWriteAnArticle = ()=>{
  console.log('goWriteAnArticle')
  router.push('/nftCreate')
}
const goHome = ()=>{
  router.push('/')
}
const goProfile = ()=>{
  router.push('/profile')
}
onMounted(() => {
  const walletAddr = sessionStorage.getItem("walletAddress") || ''
  if (walletAddr !== undefined && walletAddr !== '') {
    walletAddress.value = walletAddr.substring(0,5)+ "..." +walletAddr.substring(walletAddr.length-4)
  }
});
</script>
<style lang="less" scoped>

</style>