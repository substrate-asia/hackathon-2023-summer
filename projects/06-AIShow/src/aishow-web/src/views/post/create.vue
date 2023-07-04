<template>
  <div class="mx-[20%]">
    <div class="text-[30px] font-bold my-6">Post your image</div>
    <a-form :model="formData" layout="vertical" ref="formRef" :rules="formRules">
      <a-form-item  name="postName">
        <a-upload-dragger
          v-model:fileList="fileList"
          name="file"
          :multiple="true"
          @change="handleChange"
          @drop="handleDrop"
          :maxCount="5"
          accept=".jpg,.jpeg,.png,.svg,.gif,.tiff,.bmp,.webp"
        >
          <p class="ant-upload-drag-icon">
            <img src="@/assets/icons/picture.svg" class="w-[60px]" />
          </p>
          <p class="ant-upload-text">Drag images here or click to select files</p>
          <p class="ant-upload-hint">
            Attach up to 5 files
          </p>
        </a-upload-dragger>
        <a-button :disabled="fileList.length ? false : true" type="primary" class="w-full mt-4" @click="uploadPost" :loading="uploadLoading">Start Upload</a-button>
      </a-form-item>
      <a-form-item label="Choose the model you use" name="model">
        <a-select :options="modelOption" v-model:value="formData.model" placeholder="Choose a model" allow-clear  autocomplete="off">
        </a-select>
      </a-form-item>
      <a-form-item label="Name" name="name">
        <a-input v-model:value="formData.name" placeholder="Please enter Name" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="About your image" name="description">
        <div>What your image does</div>
        <Wangeditor
          v-model:value="formData.description"
          placeholder="About your image"
        />
      </a-form-item>
    </a-form>
    <div class="mt-8 text-center">
      <a-button type="primary" class="mr-10 w-[120px]" @click="cancelPost">Cancel</a-button>
      <a-button type="primary" @click="handleSubmit" class="w-[120px]" :loading="loading">Post</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { message, type UploadChangeParam } from 'ant-design-vue';
import Wangeditor from '@/components/Wangeditor.vue';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import {CreatePostVO, PolkadotAiChanClient} from "@/components/polkadot/ai-model"
import {ApiPromise, WsProvider} from "@polkadot/api";
import {web3Accounts, web3Enable} from "@polkadot/extension-dapp";
import { uploadFile } from '@/utils/deoss'
const router = useRouter()

const fileList = ref<any>([]);
const loading = ref(false)
const uploadLoading = ref(false)
const formRef = ref();
const formData = reactive({
  model:null,
  name: '',
  description: ''
});
const postImageInfo = ref()
const modelOption = ref()
const formRules = computed(() => {

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    model: [requiredRule('Please choose the model!')],
    name: [requiredRule('Please enter name!')],
    description: [requiredRule('Please enter description!')],
  };
});
const cancelPost = ()=>{
  router.push('/')
}
const handleSubmit = async () => {
  await formRef.value.validate();
  loading.value = true
  let uuid = uuidv4()
  console.log('uuid',uuid)
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  const createPostParams:CreatePostVO = {
    // 模型hash
    modelHash: formData.model,
    // uuid
    uuid: uuid,
    // 主题名
    name: formData.name,
    // 图片列表
    images: postImageInfo.value,
    // markdown 备注
    comment: formData.description,
  }
  console.log('createPostParams',createPostParams)
  try {
    await client.createPost(createPostParams,(info:any) => {
      console.log('createPost info',info)
      if(info.status === "inBlock") {
        router.push(`/postDetail?hash=${info.id}&id=${uuid}`)
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
const handleChange = (info: UploadChangeParam) => { 
  console.log("info:",info);
}
const handleDrop = (e: DragEvent) => {
  console.log("e:",e);
}
const uploadPost = async()=>{
  console.log('uploadPost',fileList.value)
  let images = []
  uploadLoading.value = true
  try {
    for(let i=0;i<fileList.value.length;i++){
      const getPostImageUrl = await uploadFile(fileList.value[i],'',fileList.value[i].name)
      // http://35.227.119.161:8081/45371a83c83734a8ccb8eeb1da3107d2582fde1ff7d0c31ad7b23c29936411aa/990.jpeg
      images[i] = {
        image:getPostImageUrl,
        imageLink:`http://35.227.119.161:8081/${getPostImageUrl}/${fileList.value[i].name}`
      }
      console.log('getPostImageUrl',getPostImageUrl,images)
    }
    postImageInfo.value = images
    uploadLoading.value = false
    console.log(1111111111,postImageInfo.value)
  } catch (error:any) {
    postImageInfo.value = images
    message.error('Image upload encountered an issue, please try again')
    uploadLoading.value = false
  }
}
// model选项
const getModelOption = async()=>{
  const { api, account } = await connectCommonPolk()
  const client = new PolkadotAiChanClient(api,account)
  const res = await client.userModelList(account)
  modelOption.value = res.map((item:any)=>{
    return {
      value:item.hash,
      label:item.name,
      // name:item.name
    }
  })
  console.log('model选项',modelOption.value)
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
  getModelOption()
})
</script>
<style lang="less" scoped>
</style>