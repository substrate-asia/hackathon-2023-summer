import { useContext, useEffect, useState } from 'react'
import { SubsocialContext } from './subsocial/provider'
import polkadotjs from './subsocial/wallets/polkadotjs'
import { IpfsContent } from '@subsocial/api/substrate/wrappers'
import { SpaceData } from '@subsocial/api/types'
import { CustomNetwork, Mainnet, Testnet } from './subsocial/config'
import Button from './components/Button'
import './App.css'
import Chip from './components/Chip'
import Space from './components/Space'
import React from 'react'
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import { Link } from 'react-router-dom';

// This is the start of the React app built using Subsocial Starter.
export default function  App() {
  // SubsocialContext can be used using useContext hook and it provides
  // access to the [api] module i.e. SubsocialApi and other methods like
  // changeNetwork (changing from testnet(default) to mainnet/localnet).
  // It also gives you access to getters like [isReady] that helps you know [api]
  // initlaization status.
  // isReady不是一个方法，它是一个getter属性。用于检查API初始化状态是否就绪
  // api是从SubsocialContext上下文中获取到的SubsocialApi模块的实例对象。这个api对象包含了与Subsocial网络的交互所需的所有方法（如获取Space数据，创建Space等）
  // network和changeNetwork的作用分别是获取当前网络连接和更改网络连接。
  // 使用解构赋值：eg. const numbers = [1, 2, 3];
  // const [a, b, c] = numbers; a, b, c 分别是 1, 2, 3
  const { isReady, api, network, changeNetwork } = useContext(SubsocialContext)
  
  // space的状态变量，用于存储查询到的Space数据或者为空值
  // setSpace是一个方法，用于更新space状态变量的值
  const [space, setSpace] = useState<SpaceData>()

  // useEffect函数接受两个参数：一个回调函数和一个依赖项数组
  // 并且每当依赖项数组中的任何一个值发生变化时，都会重新执行回调函数。
  // 在这个代码中，回调函数的作用是在控制台输出一条消息，显示API是否准备就绪。
  useEffect(() => {
    console.log(`Is API ready: ${isReady}`)
  }, [isReady, api])

  // Maps the network to the network name string.
  // 定义了一个名为getNetworkName的函数，该函数接受一个名为network的参数
  // 返回的是一个字符串类型
  const getNetworkName = (network: CustomNetwork) => {
    if (network === Testnet) return 'Testnet'
    if (network === Mainnet) return 'Mainnet'
    return 'Custom Network'
  }

  // Once [api] is initialized, all the API methods from Subsocial SDK are in
  // ready-to-use condition. For example: Fetching data about a Space.
  //
  // To know more about Subsocial SDK methods, Checkout:
  // Quick Reference Guide: https://docs.subsocial.network/docs/develop/quick-reference
  // Subsocial Playground:  https://play.subsocial.network
  // 这段代码定义了一个异步函数getSpace，用于获取空间（Space）的数据。
  const getSpace = async () => {
    // 如果space已经存在（非空），则通过setSpace(undefined)将其重置为空
    if (space) {
      setSpace(undefined)
      return
    }
    // 如果isReady为false，表示无法连接到API，它会打印一条错误消息
    // 通过在api后面加上!，即api!，我们告诉编译器我们确信api不会为null或undefined
    if (!isReady) {
      console.log({ message: 'Unable to connect to the API.' })
      return
    }
    
    const spaceId = '1005'
    // 调用api!.findSpace({ id: spaceId })异步地获取与该空间ID对应的空间数据。
    // api可能是一个可选的属性，也就是它的类型可以是SubsocialApi | undefined  
    // 通过在api后面加上!，即api!，我们告诉编译器我们确信api不会为null或undefined
    const res = await api!.findSpace({ id: spaceId })
    // 
    setSpace(res) 
    console.log(res)
  }

  // Creating a space on Subsocial network.
  const createSpace = async () => {
    // ，它通过调用setSpace(undefined)将space状态设置为undefined，以便在创建新的空间之前清除现有的空间数据。
    setSpace(undefined)

    // Always assure, the [api] is not null using [isReady] property.
    // 通过检查isReady变量，它确保了与 API 的连接已建立。如果isReady为false，即无法连接到 API
    if (!isReady) {
      console.log({ message: 'Unable to connect to the API.' })
      return
    }

    // 检查当前网络的名称，如果是Mainnet，它会在控制台输出一条消息，指示需要使用自己的 IPFS 端点来存储数据
    if (getNetworkName(network) === 'Mainnet') {
      console.log({
        message: 'You need to use your own IPFS endpoint to store data.',
      })
      return
    }

    // Saves this data on IPFS.
    // On testnet, the data is stored on CRUST IPFS test mnemonic automatically.
    //
    // To change the IPFS either pass [CustomNetwork] or call [setupCrustIPFS] with
    // your mnemonic (MAKE SURE TO HIDE MNEOMIC BEFORE UPLOADING TO PUBLIC NETWORK).
    // 保存数据到 IPFS。它提供了一些关于空间的信息，例如名称、描述和标签。该方法返回一个 CID
    const cid = await api!.ipfs.saveContent({
      about:
        'Subsocial is an open protocol for decentralized social networks and marketplaces. It`s built with Substrate and IPFS',
      image: null,
      name: 'Subsocial',
      tags: ['subsocial'],
    })  
    // 获取到底层的 Substrate 区块链 API
    const substrateApi = await api!.blockchain.api

    // 创建一个空间的交易。它将之前获得的 CID 作为参数，还可以选择性地提供权限配置
    const spaceTransaction = substrateApi.tx.spaces.createSpace(
      IpfsContent(cid),
      null // Permissions config (optional)
    )

    // Using the [polkadotjs] property, imported from context hook.
    // This gives you with a set of methods like [getAllAccounts], [logTransaction],
    // [signAndSendTx], etc. These are using Polkadotjs extension library internally.
    const accounts = await polkadotjs.getAllAccounts()
    // 获取所有账户，并如果存在账户，则使用polkadotjs.signAndSendTx()方法对空间交易进行签名和发送
    if (accounts.length > 0) {
      await polkadotjs.signAndSendTx(spaceTransaction, accounts[0].address)
      alert('API response added in browser console logs.')
    }
  }

  const toggleNetwork = async () => {
    if (network === Testnet) {
      changeNetwork(Mainnet)
    } else {
      changeNetwork(Testnet)
    }
  }


// 用户当前登陆的地址
let userAddr = null;
// 选择账户
const SelectComponent = async () => {
  try {
    await web3Enable('Your DApp Name');
    const accounts = await web3Accounts();

    // 获取所有账户地址
    const accountAddresses = accounts.map((account) => account.address);

    // 弹出对话框展示账户地址供用户选择
    const selectedAddress = window.prompt('Please select an account:', accountAddresses.join(','));

    // 根据用户选择的地址查找对应的账户对象
    const selectedAccount = accounts.find((account) => account.address === selectedAddress);

    if (selectedAccount) {
      // 用户选择了一个账户进行登录，可以进行后续操作
      console.log('来自于SelectComponent，Selected Account:', selectedAccount);
      userAddr = selectedAccount;
    } else {
      // 用户取消了选择或选择无效的地址·
      console.log('No account selected');
    }
  } catch (error) {
    // 处理错误情况
    console.error('Error:', error);
  }
};


const handleButtonClick = async () => {

}


  // 返回一个 React 组件的 JSX 表示。它渲染了一个页面的主要内容，包括标题、连接状态、按钮和空间数据的展示
  return (
    <main>    
      <div className='header'>
        <h1 className='title'>Welcome to ColossusVault</h1>
        <div className='connection-container'>
          <div className='connection'>
            You are{' '}
            {isReady ? (
              <Chip className='connection-chip' size='small' color='green'>
                connected subsocial
              </Chip>
            ) : (
              <Chip className='connection-chip' size='small' color='blue'>
                connecting
              </Chip>
            )}{' '}
            to Subsocial's {getNetworkName(network)}
          </div>

          <div className='connection'>
            and the configuration can be seen in{' '}
            <Chip className='connection-chip' size='small' color='blue'>
              subsocial/config.ts
            </Chip>
          </div>
        </div>
      </div>
      <div className='button-container'>
      <Button onClick={SelectComponent} title='Login with PolkadotJS Wallet' loadingText='Logging in...' />
    </div>

    <div>
      <Link to="/userProfile">
        <Button onClick={handleButtonClick} title="User Profile" loadingText="跳转中...">
          点击跳转
        </Button>
      </Link>
    </div>

    <div>
      <Link to="/createPost">
        <Button onClick={handleButtonClick} title="CreatePost" loadingText="跳转中...">
          点击跳转
        </Button>
      </Link>
    </div>  

    <div>
      <Link to="/fetchSubscribe">
        <Button onClick={handleButtonClick} title="FetchSubscribe" loadingText="跳转中...">
          点击跳转
        </Button>
      </Link>
    </div>

    </main>
  )
}
