<template>
  <div class="mb-4 card-img">
    <div class="top-div flex p-2 justify-between items-center">
      <img v-if="false" src="@/assets/images/icon.jpeg" class="h-[40px] rounded-full" />
      <div>
        <div>{{ cardInfo.name }}</div>
        <div v-if="false" class="text-css">an hour ago - Cross - post</div>
      </div>
      <span class="btm-tips" v-if="false">
        <img src="@/assets/icons/star.svg" class="h-[14px]" />
        <span class="ant-rate-text">5.0</span>
      </span>
    </div>
    <div class="relative cursor-pointer">
      <a-carousel arrows>
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
        <div v-for="(item,key) in cardInfo.images" :key="key">
          <img :src="item.imageLink" class="w-full rounded-[4px]" />
        </div>
        <!-- <div>
          <img :src="getImageURL(cardInfo.imageName)" class="w-full rounded-[4px]" />
        </div> -->
      </a-carousel>
      <div class="absolute top-0 w-full h-full">
        <div class="flex justify-end p-2">
          <div>
            <img v-if="false" src="@/assets/icons/more.svg" class="h-[28px]" />
          </div>
        </div>
        <div v-if="false" class="absolute bottom-[6px] left-[6px] w-full">
          <div class="flex justify-between w-[96%]">
            <div class="card-btm p-2">
              <div class="flex items-center">
                <img src="@/assets/icons/add-icon.svg" class="h-[18px] cursor-pointer" @click="showIcon = !showIcon" />
                <img src="@/assets/icons/smile-b.svg" class="h-[18px] ml-[8px]" />

                <span class="ml-[8px] flex items-center" v-if="showIcon">
                  <img src="@/assets/icons/like-y.svg" class="h-[16px]" />
                  <span class="ant-rate-text">0</span>
                  <img src="@/assets/icons/like-n.svg" class="h-[16px]" />
                  <span class="ant-rate-text">0</span>
                  <img src="@/assets/icons/love-icon.svg" class="h-[18px]" />
                  <span class="ant-rate-text">0</span>
                  <img src="@/assets/icons/smile-icon.svg" class="h-[18px]" />
                  <span class="ant-rate-text">0</span>
                  <img src="@/assets/icons/cry-icon.svg" class="h-[18px]" />
                  <span class="ant-rate-text">0</span>
                </span>
              </div>
            </div>
            <div>
              <img src="@/assets/icons/tips.svg" class="h-[26px] cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useAssets from "@/stores/useAssets";
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import { ref } from "vue";

defineProps({
  cardInfo:{
    type:Object,
    required: true
  }
})
const { getImageURL } = useAssets();
const showIcon = ref(false);
</script>
<style lang="less" scoped>
.top-div{
  color: rgb(193, 194, 197);
  background-color: rgb(26, 27, 30);
  .text-css{
    color: rgb(144, 146, 150);
  }
}
.card-img{
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px, rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px;
  border: 1px solid rgb(55, 58, 64);
}
.btm-tips{
  border: 1px solid transparent;
  backdrop-filter: blur(7px);
  box-shadow: rgba(37, 38, 43, 0.2) 1px 2px 3px -1px;
  background: rgba(212, 212, 212, 0.2);
  text-transform: uppercase;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 0.25px;
  padding-left: 8px;
  display: flex;
  align-items: center;
  width: max-content;
  margin: 5px 5px 0 0;
}
.card-btm{
  border-radius: 4px;
  background: rgba(16, 17, 19, 0.8);
  backdrop-filter: blur(13px) saturate(160%);
  box-shadow: rgba(0, 0, 0, 0.16) 0px -2px 6px 1px;
  padding: 4px;
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
.ant-carousel :deep(.slick-dots-bottom){
  bottom: 0px;
}
.ant-carousel :deep(.slick-dots){
  display:table !important;
  width:100%;
  margin: 0;
}
.ant-carousel  :deep(.slick-dots li){
  margin: 0;
  display: table-cell;
  border-right: 2px solid transparent;
  border-left: 2px solid transparent;
}
.ant-carousel  :deep(.slick-dots li:nth-last-child(1)){
  border-left: 2px solid transparent;
}
.ant-carousel  :deep(.slick-dots li:first-child){
  border-right: 2px solid transparent;
}
.ant-carousel :deep(.slick-dots li.slick-active){
  // width: auto;
  display: table-cell;
}
</style>