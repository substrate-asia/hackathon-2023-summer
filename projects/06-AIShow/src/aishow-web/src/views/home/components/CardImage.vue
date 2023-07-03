<template>
  <div class="mb-4 relative card-img  cursor-pointer">
    <img v-if="cardType === 'nft'" :src="cardInfo.itemLink" class="w-full rounded-[4px]" />
    <img v-else :src="cardInfo.images[0].imageLink" class="w-full rounded-[4px]" />
    <!-- <img :src="getImageURL(+cardInfo.images[0].imageLink)" class="w-full rounded-[4px]" /> -->
    <div v-if="cardType !== 'nft'" class="absolute top-0 w-full h-full">
      <div class="flex justify-between p-2">
        <!-- <div class="left-tips"> Checkpoint </div> -->
        <div>
          <img v-if="false" src="@/assets/icons/more.svg" class="h-[28px]" />
        </div>
      </div>
      <div class="absolute bottom-0 rounded-bl-[4px] rounded-br-[4px] w-full">
        <div class="flex justify-end p-2">
          <div class="rounded-img w-[38px]  rounded-full">
            <img :src="cardInfo.images[0].imageLink" class="w-[38px] h-[38px] rounded-full" />
          </div>
        </div>
        <div class="card-btm p-2">
          <div class="text-[14px] font-medium">{{ cardInfo.name }}</div>
          <div v-if="false">
            <span class="btm-tips">
              <a-rate value="5" tooltips="desc" />
              <span class="ant-rate-text">842</span>
            </span>
          </div>
          <div class="flex" v-if="false">
            <span class="btm-tips">
              <img src="@/assets/icons/collect.svg" class="h-[14px]" />
              <span class="ant-rate-text">12K</span>
            </span>
            <span class="btm-tips">
              <img src="@/assets/icons/info.svg" class="h-[14px]" />
              <span class="ant-rate-text">270</span>
            </span>
            <span class="btm-tips">
              <img src="@/assets/icons/down.svg" class="h-[14px]" />
              <span class="ant-rate-text">166K</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useAssets from "@/stores/useAssets";

defineProps({
  cardInfo:{
    type:Object,
    required: true
  },
  cardType: {
    type: String,
    required: true
  }
})
const { getImageURL } = useAssets();
</script>
<style lang="less" scoped>
.card-img{
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px, rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px;
  border: 1px solid rgb(55, 58, 64);
}
.left-tips{
  box-shadow: rgba(37, 38, 43, 0.2) 1px 2px 3px -1px;
  background: rgba(30, 133, 230, 0.4);
  border-radius: 4px;
  padding: 0px 8px;
  height: 18px;
  font-size: 10px;
  letter-spacing: 0.25px;
  font-weight: 700;
  text-transform: uppercase;
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
  background: linear-gradient(45deg, rgba(37, 38, 43, 0.8) 0%, rgba(37, 38, 43, 0) 100%);
  backdrop-filter: blur(13px) saturate(160%);
  box-shadow: rgba(0, 0, 0, 0.16) 0px -2px 6px 1px;
}
.rounded-img{
  box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 3px, rgba(0, 0, 0, 0.5) 0px 8px 15px -5px;
  transition: opacity 0.25s ease 0s;
  position: relative;
}
.rounded-img::before {
  content: "";
  position: absolute;
  inset: 0px;
  border-radius: 32px;
  box-shadow: rgba(255, 255, 255, 0.8) 0px 0px 0px 1px inset;
}
</style>