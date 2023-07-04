<template>
  <div class="mx-[20%]">
    <div class="text-[30px] font-bold my-6">Creat your model</div>
    <a-form :model="formData" layout="vertical" ref="formRef" :rules="formRules">
      <a-form-item label="Upload modele file" name="fileName">
        <a-upload-dragger
          v-model:fileList="fileList"
          name="file"
          :multiple="true"
          @change="handleFileChange"
          @drop="handleFileDrop"
          :maxCount="1"
          accept=".ckpt, .pt, .safetensors, .bin, .zip, .yaml, .yml, .onnx"
        >
          <p class="ant-upload-drag-icon">
            <img src="@/assets/icons/upload.svg" class="w-[60px]" />
          </p>
          <p class="ant-upload-text">Drop your files here or click to select</p>
          <p class="ant-upload-hint">
            Attach up to 1 files. Accepted file types: .ckpt, .pt, .safetensors, .bin, .zip, .yaml, .yml, .onnx
          </p>
        </a-upload-dragger>
        <a-button :disabled="fileList.length ? false : true" type="primary" class="w-full mt-4" @click="uploadFileList" :loading="fileLoading">Start Upload</a-button>
      </a-form-item>
      <a-form-item label="Upload modele image" name="picName">
        <div>The image is used to show the effect of the model generation example</div>
        <a-upload-dragger
          v-model:fileList="imageList"
          name="imagefile"
          :multiple="true"
          @change="handleChange"
          @drop="handleDrop"
          :maxCount="5"
          accept=".jpg,.jpeg,.png,.svg,.gif,.tiff,.bmp,.webp"
          action="/api"
        >
          <p class="ant-upload-drag-icon">
            <img src="@/assets/icons/picture.svg" class="w-[60px]" />
          </p>
          <p class="ant-upload-text">Drag images here or click to select files</p>
          <p class="ant-upload-hint">
            Attach up to 5 files
          </p>
        </a-upload-dragger>
        <a-button :disabled="imageList.length ? false : true" type="primary" class="w-full mt-4" @click="uploadImageList" :loading="imageLoading">Start Upload</a-button>
      </a-form-item>
      <a-form-item label="Set a price" name="price">
        <div>The image is used to show the effect of the model generation example</div>
        <a-input class="!w-[95%]" v-model:value="formData.price" placeholder="Amount" allow-clear autocomplete="off" />AIST
      </a-form-item>
      <a-form-item label="Name" name="name">
        <a-input v-model:value="formData.name" placeholder="Please enter Name" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="About your model" name="description">
        <div>What your model does</div>
        <Wangeditor
          v-model:value="formData.description"
          placeholder="About your model"
        />
      </a-form-item>
    </a-form>
    <div class="mt-8 text-center">
      <a-button type="primary" class="mr-10 w-[120px]" @click="cancelUploadModal">Cancel</a-button>
      <a-button type="primary" @click="handleSubmit" class="w-[120px]" :loading="loading">Submit</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { message, type UploadChangeParam } from 'ant-design-vue';
import Wangeditor from '@/components/Wangeditor.vue';
import {CreateModelVO, PolkadotAiChanClient} from "@/components/polkadot/ai-model"
import {ApiPromise, WsProvider} from "@polkadot/api";
import {web3Accounts, web3Enable} from "@polkadot/extension-dapp";
import { useRouter } from 'vue-router';
import { uploadFile } from '@/utils/deoss'

const router = useRouter();
const fileList = ref<any>([]);
const imageList = ref<any>([]);
const formRef = ref();
const fileInfo = ref()
const imageInfo = ref()
const loading = ref(false)
const fileLoading = ref(false)
const imageLoading = ref(false)
const formData = reactive({
  price:'',
  name: '',
  description:''
});
const formRules = computed(() => {

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    price: [requiredRule('Please enter price!')],
    name: [requiredRule('Please enter name!')],
    description: [requiredRule('Please enter description!')],
  };
});
const cancelUploadModal = () =>{
  router.push('/')
}
const handleSubmit = async () => {
    await formRef.value.validate();
    loading.value = true
    // 以下需要配置为全局
    const allInjected = await web3Enable('my cool dapp');
    console.log(allInjected)
    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider('wss://ws.aishow.hamsternet.io');
    const api = await ApiPromise.create({provider: wsProvider});
    // 以上需要配置为全局
    const client = new PolkadotAiChanClient(api,account)
    const model: CreateModelVO =  {
        hash: fileInfo.value.hash,
        name: formData.name,
        link: fileInfo.value.link,
        images: imageInfo.value,
        downloadPrice: +formData.price,
        comment: formData.description,
        size: fileInfo.value.size,
        filename: fileInfo.value.filename
    }
    console.log(11111111111,model,JSON.stringify(model))
    try {
      await client.createModel(model,(info:any) => {
        console.log('status~~~~~~',info)
        if(info.status === "inBlock") {
          router.push(`/detail?hash=${info.id}`)
        }else if(info.status === "error"){
          message.error(info.error)
        }
        loading.value = false
      })
    } catch (error:any) {
      message.error('Failed ',error)
      loading.value = false
    }
    
}
const handleChange = async(info: any) => {
  console.log("info:",info);
  if (info.event !== undefined) {

  }
}
const handleDrop = (e: DragEvent) => {
  console.log("e:",e);
}
// 点击上传图片回调
const uploadImageList = async()=>{
  console.log('点击上传图片回调',imageList.value.length,imageList.value)
  imageLoading.value = true
  let images = []
  try {
    for(let i=0;i<imageList.value.length;i++){
      const getImageUrl = await uploadFile(imageList.value[i],'',imageList.value[i].name)
      // http://35.227.119.161:8081/45371a83c83734a8ccb8eeb1da3107d2582fde1ff7d0c31ad7b23c29936411aa/990.jpeg
      images[i] = {
        image:getImageUrl,
        imageLink:`http://35.227.119.161:8081/${getImageUrl}/${imageList.value[i].name}`
      }
      console.log('getImageUrl',getImageUrl,images)
    }
    imageInfo.value = images
    imageLoading.value = false
  } catch (error:any) {
    imageInfo.value = images
    message.error('Image upload encountered an issue, please try again')
    imageLoading.value = false
  }
}
const handleFileChange = async(info: UploadChangeParam)=>{
  console.log('handleFileChange',info)
  if (info.event !== undefined) {

  }
}
const handleFileDrop = (e: DragEvent) => {
  console.log("handleFileDrop",e);
}
// 点击上传文件回调
const uploadFileList = async()=>{
  console.log('点击上传文件回调',fileList.value)
  try{
    fileLoading.value = true
    const fileHash = await uploadFile(fileList.value[0],'',fileList.value[0].name)
    const getFileUrl = fileList.value[0]
    console.log('getFileUrl',getFileUrl,'fileSize')
    fileInfo.value = {
      hash:fileHash,
      link:'',
      size:fileList.value[0].size,
      filename:getFileUrl.name
    }
    fileLoading.value = false
    console.log('11111111111111111',fileInfo.value)
  }catch(error:any){
    message.error('File upload encountered an issue, please try again')
    fileLoading.value = false
  }
}
</script>
<style lang="less" scoped>
</style>
