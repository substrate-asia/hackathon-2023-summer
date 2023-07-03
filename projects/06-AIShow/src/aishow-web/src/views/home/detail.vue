<template>
  <div>
    <div class="grid grid-cols-3 gap-8">
      <div class="col-span-2">
        <div class="text-[26px] font-bold">{{ cardList.name }}</div>
        <div class="my-4">
          <img v-if="false" src="@/assets/images/one.jpeg" class="w-[30px] h-[30px] rounded-full" />
          {{ dayjs(cardList.createTime).format('MMM DD , YYYY') }}
        </div>
        <a-carousel arrows :dots="false">
          <template #prevArrow>
            <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
              <left-circle-outlined />
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
              <right-circle-outlined />
            </div>
          </template>
          <div v-for="(item,key) in cardList.images" :key="key">
            <div class="flex">
              <CarouselImage :cardInfo="item"></CarouselImage>
              <!-- <CarouselImage :cardInfo="item"></CarouselImage> -->
            </div>
          </div>
        </a-carousel>
      </div>
      <div>
        <div class="text-[26px] font-bold text-[#1971c2]">Price:{{ cardList.downloadPrice }} AIST</div>
        <a-button class="w-full mb-[20px]" type="primary" @click="downloadModelFile">Download（<span>{{fileSize}}</span>）</a-button>
        <div class="overflow-y-auto">
          <div v-html="cardList.comment"></div>
          <!-- <pre><label class="text-[#1971c2]">View more</label></pre> -->
        </div>
      </div>
    </div>
    <a-divider class="bg-[#fff] text-[26px] font-bold">This model works</a-divider>
    <div class="model-bg grid grid-cols-4 gap-4">
      
      <div>
        <div v-for="(item,key) in modalList" :key="key" @click="goPostDetail(item)">
          <ModalImage :cardInfo="item" v-if="key % 4 === 0"></ModalImage>
        </div>
      </div>
      <div>
        <div v-for="(item,key) in modalList" :key="key" @click="goPostDetail(item)">
          <ModalImage :cardInfo="item" v-if="key % 4 === 1"></ModalImage>
        </div>
      </div>
      <div>
        <div v-for="(item,key) in modalList" :key="key" @click="goPostDetail(item)">
          <ModalImage :cardInfo="item" v-if="key % 4 === 2"></ModalImage>
        </div>
      </div>
      <div>
        <div v-for="(item,key) in modalList" :key="key" @click="goPostDetail(item)">
          <ModalImage :cardInfo="item" v-if="key % 4 === 3"></ModalImage>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import CarouselImage from './components/CarouselImage.vue';
import ModalImage from "./components/ModalImage.vue";
import { onMounted, reactive, ref } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { PolkadotAiChanClient} from "@/components/polkadot/ai-model"
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import {ApiPromise, WsProvider} from "@polkadot/api";
import { message } from "ant-design-vue";
import dayjs from 'dayjs';
import { downloadFileFN } from '@/utils/deoss/index'
import prettyBytes from 'pretty-bytes';

const router = useRouter()
const route = useRoute()

const cardList = reactive<any>({});
const modalList = reactive<any>([]);
const modelHash = ref()
const fileSize = ref()
const goPostDetail = (item:any)=>{
  console.log('goPostDetail',item)
  // 需带上图片标识进入详情页
  router.push('/postDetail?hash='+item.modelHash+'&id='+item.uuid)
}
const downloadModelFile = async()=>{
  console.log('downloadModelFile')
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  try {
    client.buyModel(modelHash.value,async(info:any)=>{
      console.log('download model',info)
      const blob:any = await downloadFileFN(cardList.hash)
      console.log('blob~~~~~',blob)
      let downloadElement = document.createElement("a");
      let href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      downloadElement.download = cardList.filename;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);
    })
  } catch (error:any) {
    message.error('Failed ',error)
  }
}
const getModelDetail = async () => {
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  try {
    console.log("hash:", route.query.hash);
    const res = await client.modelDetail(route.query.hash)
    console.log("res:", res);
    Object.assign(cardList,res);
    modelHash.value = res.hash
    fileSize.value = prettyBytes(cardList.size);
  } catch (error: any) {
    console.log("error:",error);
    message.error('Failed ',error)
  }
}
const getPostList = async () => {
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  try {
    console.log("postList hash:", route.query.hash);
    const res = await client.postList(route.query.hash)
    console.log("modalList res:", res);
    Object.assign(modalList,res);
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
onMounted(() => {
  getModelDetail();
  getPostList();
});
</script>
<style lang="less" scoped>
/* For demo */
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  background-color: rgb(37, 38, 43);
  overflow: hidden;
  border-radius: 4px;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 40px;
  height: 35px;
  font-size: 35px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

pre{
  white-space:pre-wrap;
  white-space:-moz-pre-wrap;
  white-space:-pre-wrap;
  white-space:-o-pre-wrap;
  word-wrap:break-word;
}
.ant-divider-horizontal.ant-divider-with-text{
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  background: transparent;
}
.ant-divider-horizontal.ant-divider-with-text::before, .ant-divider-horizontal.ant-divider-with-text::after{
  border-color: #fff;
}
.model-bg{
  background-color: rgb(37, 38, 43);
  border-radius: 4px;
  padding: 4px;
}
</style>