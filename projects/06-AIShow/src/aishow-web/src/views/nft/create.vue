<template>
  <div class="mx-[20%]">
    <div class="text-[30px] font-bold my-6">Mint your NFT</div>
    <a-form :model="nftParams" layout="vertical" ref="formRef" :rules="formRules">
      <a-form-item v-if="!showImage" label="Choose the image from your Post"  name="post">
        <div @click="imgVisible=true" class="bg-[#25262b] rounded-[2px] w-[140px] h-[140px] cursor-pointer flex justify-center items-center">
          <img src="@/assets/icons/add-icon.svg" class="h-[20px] cursor-pointer" />
        </div>
      </a-form-item>
      <a-form-item v-else>
        <img :src="showImage" class="w-[140px] h-[140px]"/>
      </a-form-item>
      <a-form-item label="Name" name="name">
        <a-input v-model:value="nftParams.name" placeholder="Please enter Name" allow-clear autocomplete="off" />
      </a-form-item>
      <!-- <a-form-item label="Tags" name="name">
        <a-input v-model:value="nftParams.name" placeholder="Please enter Name" allow-clear autocomplete="off" />
      </a-form-item> -->
      <a-form-item label="Description" name="description">
        <div>The description will be included on the item's detail page underneath its image.</div>
        <a-textarea v-model:value="nftParams.description" placeholder="" allow-clear :auto-size="{ minRows: 5, maxRows: 15 }" />
      </a-form-item>
    </a-form>
    <div class="mt-8 text-center">
      <a-button type="primary" class="mr-10 w-[120px]" @click="cancelNft">Cancel</a-button>
      <a-button type="primary" @click="handleSubmit" class="w-[120px]" :loading="loading">Mint</a-button>
    </div>
  </div>
  <a-modal v-model:visible="imgVisible" >
    <template #footer>
      <a-button type="primary" @click="imgVisible=false">Cancel</a-button>
      <a-button type="primary" class="!ml-8" @click="getPostInfo">Confirm</a-button>
    </template>
    <div class="text-[20px] font-bold mb-5">Please select your image from your POST</div>
    <!-- <div>Title</div>
    <div class="mb-8">2023-06-20 15:34:56</div> -->
    <a-radio-group v-model:value="imgValue" name="radioGroup">
      <div class="grid grid-cols-3 gap-4">
        <div class="relative" v-for="(item, key) in postImageArr" :key="key">
          <div v-for="(i,k) in item.images" :key="k">
            <div>
              <img :src="i.imageLink" class="w-full" />
              <div class="absolute bottom-[5px] w-full text-center" @click="selectImage(item)">
                <a-radio :value="i"></a-radio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-radio-group>
    
  </a-modal>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import {ApiPromise, WsProvider} from "@polkadot/api";
import {web3Accounts, web3Enable} from "@polkadot/extension-dapp";
import { PolkadotAiChanClient, NFTCreateVO } from "@/components/polkadot/ai-model"
import { message } from 'ant-design-vue';
const router = useRouter()
const postImageArr = ref()
const showImage = ref()
const loading = ref(false)

const imgValue = ref();
const imgVisible = ref(false);
const formRef = ref();
const nftParams = reactive<NFTCreateVO>({
  modelHash:'',
  postId:'',
  uuid:'',
  name:'',
  description:''
})
const formRules = computed(() => {

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    name: [requiredRule('Please enter name!')],
    post: [requiredRule('Please choose a post!')],
    description: [requiredRule('Please enter description!')],
  };
});
const cancelNft = ()=>{
  router.back()
}
const handleSubmit = async () => {
  await formRef.value.validate();
  loading.value = true
  console.log('nftParams',nftParams)
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  try {
    await client.nftMint(nftParams,(info:any)=>{
      if(info.status === "inBlock") {
        router.push(`/nftDetail?collectionId=${info.collectionId}&itemId=${info.itemId}`)
      }else if(info.status === "error"){
        message.error(info.error)
      }
      loading.value = false
    })
  } catch (error:any) {
    message.error("Failed ",error)
    loading.value = false
  }
}
// 取post信息
const getPostInfo = ()=>{
  console.log('取post信息',imgValue.value)
  nftParams.uuid = imgValue.value.image
  showImage.value = imgValue.value.imageLink
  imgVisible.value = false
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
// 获取用户post列表
const getPostImg = async()=>{
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  const res:any = await client.userPostList(account)
  postImageArr.value = res
  console.log('aaaaaaaaaaaaa',postImageArr.value)
}
// 获取用户选中的图片
const selectImage = (item:any)=>{
  console.log('selectImage',item)
  nftParams.modelHash =item.modelHash
  nftParams.postId = item.uuid
}
onMounted(()=>{
  getPostImg()
})
</script>
<style lang="less" scoped>
:deep(.ant-radio), :deep(.ant-radio-inner){
  border-radius: 2px;
  height: 20px;
  width: 20px;
}
:deep(.ant-radio-checked .ant-radio-inner){
  border-color: transparent;
}
:deep(.ant-radio-inner::after),:deep(.ant-radio-checked::after){
  border-radius: 4px;
  transform: scale(0.8);
}
</style>