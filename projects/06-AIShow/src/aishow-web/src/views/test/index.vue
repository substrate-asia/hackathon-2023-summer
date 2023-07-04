<script setup lang="ts">

import {PolkadotAiChanClient} from "@/components/polkadot/ai-model";
import {ApiPromise, WsProvider} from "@polkadot/api";
import {web3Accounts, web3Enable} from "@polkadot/extension-dapp";
import {onMounted, reactive} from "vue";
import {getUUID} from "ant-design-vue/es/vc-dialog/util";

// const wsAddress = 'ws://127.0.0.1:9944'
const wsAddress = 'wss://ws.aishow.hamsternet.io'
const modelHash = "some-model-hash"
const postUUID = "some-uuid-20230630"
const imageHash = "some-image-hash"

web3Enable('my cool dapp').then(() => {
    console.log("enable success")
})

const createModel = async () => {


    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider(wsAddress);
    const api = await ApiPromise.create({provider: wsProvider});
    const client = new PolkadotAiChanClient(api, account)


    const result = await client.createModel({
        name: modelHash,
        // 模型hash， 文件上传后返回的hash值
        hash: modelHash,
        // 模型下载链接
        link: "https://img.zcool.cn/community/01dcd059117b12a801216a3e9c4fd5.jpg@1280w_1l_2o_100sh.jpg",
        // 图片列表
        images: [{
            image: "image",
            imageLink: "https://img.zcool.cn/community/01dcd059117b12a801216a3e9c4fd5.jpg@1280w_1l_2o_100sh.jpg",
        }],
        // 下载价格
        downloadPrice: 1000,
        size: 1000,
        // markdown 备注
        comment: `<p><span style=\\"color: rgb(36, 41, 47); background-color: rgb(244, 246, 248); font-size: 14px;\\">As the temperature rises and the days get longer, we know that summer has arrived. It's a season of sunshine, warmth, and endless possibilities. Whether it's spending lazy days by the beach, exploring new places, or simply enjoying the company of friends and family, summer brings us joy and relaxation</span></p >`,
        filename: "filename.zip",
    }, data => {
        console.log(data)
    })
    console.log("modelDetail: ", result)

}

const createPost = async ()=> {


    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider(wsAddress);
    const api = await ApiPromise.create({provider: wsProvider});
    const client = new PolkadotAiChanClient(api, account)

    const result = await client.createPost({
        modelHash: modelHash,
        uuid: postUUID,
        name: "some name",
        images: [{
           image: imageHash,
           imageLink: "https://img.zcool.cn/community/01dcd059117b12a801216a3e9c4fd5.jpg@1280w_1l_2o_100sh.jpg",
        }],
        comment: "comment",
    },undefined)

    console.log(result)
}

const userModelSelect = async () => {


    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider(wsAddress);
    const api = await ApiPromise.create({provider: wsProvider});
    const client = new PolkadotAiChanClient(api, account)

    const result = await client.userModelSelect(account)
    console.log(result)
}

const modelList = async () => {

    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider(wsAddress);
    const api = await ApiPromise.create({provider: wsProvider});
    const client = new PolkadotAiChanClient(api, account)

    const result = await client.modelList()
    console.log(result)
}

const mint = async () => {
    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider(wsAddress);
    const api = await ApiPromise.create({provider: wsProvider});
    const client = new PolkadotAiChanClient(api, account)

    const result = await client.nftMint(modelHash,postUUID,imageHash, undefined)
    console.log(result)
}

const userPost = async ()=> {

    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider(wsAddress);
    const api = await ApiPromise.create({provider: wsProvider});
    const client = new PolkadotAiChanClient(api, account)

    const result = await client.userPostList(account)
    console.log(result)
}

const nftDetail = async () => {
    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider(wsAddress);
    const api = await ApiPromise.create({provider: wsProvider});
    const client = new PolkadotAiChanClient(api, account)

    const detail = await client.nftDetail(0,1)
    console.log("detail: ", detail)
}

const postList = async () => {

    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider(wsAddress);
    const api = await ApiPromise.create({provider: wsProvider});
    const client = new PolkadotAiChanClient(api, account)

    const result = await client.postList(modelHash)
    console.log(result)
}

const setAttribute = async () => {
    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider("ws://127.0.0.1:9944");
    const api = await ApiPromise.create({provider: wsProvider});
    const client = new PolkadotAiChanClient(api, account)

    const result = await client.setAttribute(1,0,"filename","somefilevalue",undefined)
    console.log(result)
}

</script>

<template>

  <div>
      <h1>test</h1>
      <a-card>
          <p>
              <a-button type="primary" @click="createModel">create model</a-button>
          </p>
          <p>
              <a-button type="primary" @click="createPost">create post</a-button>
          </p>
          <p>
              <a-button type="primary" @click="mint">mint</a-button>
          </p>

          <p>
              <a-button type="primary" @click="userModelSelect"> userModelSelect </a-button>
          </p>

          <p>
              <a-button type="primary" @click="modelList">modelList</a-button>
          </p>

          <p>
              <a-button type="primary" @click="userPost">userPost</a-button>
          </p>
          <p>
              <a-button type="primary" @click="postList" >postList</a-button>
          </p>

          <p>
              <a-button type="primary" @click="nftDetail">nftDetail</a-button>
          </p>

          <p>
              <a-button type="primary" @click="setAttribute">setAttribute</a-button>
          </p>
      </a-card>
  </div>
</template>

<style scoped lang="less">

</style>
