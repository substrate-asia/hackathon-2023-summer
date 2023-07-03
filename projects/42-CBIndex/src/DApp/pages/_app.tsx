import type { AppProps } from 'next/app'
import { ThemeProvider } from '~/lib/theme'
import '../styles/globals.css'
import '../styles/swiper.css'
import Layout from '~/components/Layout'
import Head from 'next/head'
import { ConfigProvider, theme } from 'antd'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
// import {WalletConnectProvider} from '@walletconnect'
// import { web3Enable } from '@polkadot/extension-dapp'
import { useEffect, useState } from 'react'
import { getProgramMetadata, GearApi, GearKeyring } from '@gear-js/api'
import { readFileSync } from 'fs'
import { formatBytes32String } from 'ethers/lib/utils'

function MyApp({ Component, pageProps }: AppProps) {
  async function connect() {
    const keyring = await GearKeyring.fromSuri('//Alice')
    const { createType } = require('@polkadot/types')
    console.log(keyring.address)

    const gearApi = await GearApi.create({
      providerAddress: 'wss://testnet.vara.rs',
    })
    const metadata =
      '0x0100000000000104000000010b0000000000000000010c000000011540000820656e7472795f696f28496e697446546f6b656e00000c014473746f726167655f636f64655f686173680401104832353600014866745f6c6f6769635f636f64655f686173680401104832353600013c73686172655f636f64655f6861736804011048323536000004083c7072696d69746976655f74797065731048323536000004000801205b75383b2033325d000008000003200000000c000c0000050300100820656e7472795f696f3046546f6b656e416374696f6e0001181c4d6573736167650801387472616e73616374696f6e5f696414010c75363400011c7061796c6f616418012c4c6f676963416374696f6e0000004c5570646174654c6f676963436f6e747261637408014866745f6c6f6769635f636f64655f686173680401104832353600014473746f726167655f636f64655f68617368040110483235360001002847657442616c616e636504001c011c4163746f7249640002002c4765745065726d6974496404001c011c4163746f72496400030014436c6561720400040110483235360004005c4d69677261746553746f7261676541646472657373657300050000140000050600180820656e7472795f696f2c4c6f676963416374696f6e00011c104d696e74080124726563697069656e741c011c4163746f724964000118616d6f756e7420011075313238000000104275726e08011873656e6465721c011c4163746f724964000118616d6f756e7420011075313238000100205472616e736665720c011873656e6465721c011c4163746f724964000124726563697069656e741c011c4163746f724964000118616d6f756e74200110753132380002001c417070726f7665080140617070726f7665645f6163636f756e741c011c4163746f724964000118616d6f756e7420011075313238000300185065726d69741401346f776e65725f6163636f756e741c011c4163746f724964000140617070726f7665645f6163636f756e741c011c4163746f724964000118616d6f756e74200110753132380001247065726d69745f6964200110753132380001107369676e2401104835313200040018496e766573740c011873656e6465721c011c4163746f724964000124726563697069656e741c011c4163746f724964000118616d6f756e742001107531323800050018466f6c6c6f7704011c6163636f756e741c011c4163746f724964000600001c10106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000020000005070024083c7072696d69746976655f74797065731048353132000004002801205b75383b2036345d000028000003400000000c002c0820656e7472795f696f2c46546f6b656e4576656e7400011c084f6b0000000c4572720001001c42616c616e6365040020011075313238000200205065726d6974496404002001107531323800030018496e7665737408001c011c4163746f72496400002001107531323800040020496e76657374656408001c011c4163746f72496400002001107531323800050018466f6c6c6f7700060000300820656e7472795f696f2c46546f6b656e537461746500000c011461646d696e1c011c4163746f72496400012c66745f6c6f6769635f69641c011c4163746f7249640001307472616e73616374696f6e733401785665633c28483235362c205472616e73616374696f6e537461747573293e00003400000238003800000408043c003c0820656e7472795f696f445472616e73616374696f6e53746174757300010c28496e50726f67726573730000001c537563636573730001001c4661696c75726500020000'
    const message: any = {
      destination:
        '0x0843eda4f4cb3097ea2ccca7d516c4b45413d15fb0b29c0f1c23cfaad99ba0d1', // 合约的程序 ID
      payload: {
        //  createType(EntryIoFTokenAction){}
        // createType()
        // GetBalance: {
        // Mint: {'0x28bf2133af1e7bfa7951835462cbc5e368c017efdb55b2f8a871c33fba7c055a'},
        Message: {
          _variants: {
            Message: {
              payload: {
                _variants: {
                  Mint: {
                    recipient: keyring.addressRaw,
                    amount: 10,
                  },
                },
              },
            },
          },
        },
        // "
      },
      gasLimit: 10000000, // 燃气限制
      value: 1000, // 附带的代币数量
    }
    const message2: any = {
      destination:
        '0x0843eda4f4cb3097ea2ccca7d516c4b45413d15fb0b29c0f1c23cfaad99ba0d1', // 合约的程序 ID
      payload: {
        //  createType(EntryIoFTokenAction){}
        // createType()
        // GetBalance: {
        // Mint: {'0x28bf2133af1e7bfa7951835462cbc5e368c017efdb55b2f8a871c33fba7c055a'},
        GetBalance: keyring.addressRaw,
        // "
      },
      gasLimit: 250000000000, // 燃气限制
      value: 1000, // 附带的代币数量
    }

    const extrinsic = gearApi.message.send(
      message,
      getProgramMetadata(metadata)
    )
    await extrinsic.signAndSend(keyring, (event) => {
      console.log(event.toHuman())
    })

    // await extrinsic.signAndSend(keyring, (event) => {
    //   console.log(event.toHuman())
    // })
    // } catch (error) {
    //   console.error(`${error.name}: ${error.message}`)
    // }
    // const message = {
    //   destination:
    //     '0x0843eda4f4cb3097ea2ccca7d516c4b45413d15fb0b29c0f1c23cfaad99ba0d1', // programId
    //   payload: somePayload,
    //   gasLimit: 10000000,
    //   value: 1000,
    // }
    // const message = {
    //   destination:
    //     '0x0843eda4f4cb3097ea2ccca7d516c4b45413d15fb0b29c0f1c23cfaad99ba0d1', // 合约的程序 ID
    //   payload: {
    //     Mint: {
    //       recipient: recipientAddress, // 接收代币的账户地址
    //       amount: 10, // 要铸造的代币数量
    //     },
    //   },
    //   gasLimit: 10000000, // 燃气限制
    //   value: 1000, // 附带的代币数量
    // }
    // // const fomt = formatBytes32String(message)
    // const reply = {
    //   replyToId: messageId,
    //   payload: somePayload,
    //   gasLimit: 10000000,
    //   value: 1000,
    // }
    // In this case payload will be encoded using `meta.types.reply.input` type.
    // const extrinsic = gearApi.message.sendReply(reply, meta)
    // let extrinsic = gearApi.message.send(message, getProgramMetadata(metadata))
    // console.log(extrinsic)

    // const resut = await gearApi.programState.read(
    //   {
    //     programId:
    //       '0x0843eda4f4cb3097ea2ccca7d516c4b45413d15fb0b29c0f1c23cfaad99ba0d1',
    //     at: '0xa2992d3788e70fdd30ecec51e2bdf768880f9d08afe777d760059a84f94d3efb',
    //   },
    //   getProgramMetadata(metadata)
    // )
    // console.log(resut)
  }
  useEffect(() => {
    connect().catch(console.error)
  }, [])

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#5bfb91',
          },
          components: {
            Table: {
              // colorBg: "transpanrent",
              borderRadius: 4,
              borderRadiusLG: 6,
              colorFillAlter: 'rgba(255, 255, 255, 0.02)',
              fontSize: 14,
            },
            Button: {
              fontSize: 14,
              colorLink: '#42aa65',
              colorLinkHover: '#5bfb91',
              colorLinkActive: '#5bfb91',
            },
            Popover: {
              colorBgElevated: 'rgba(48,48,48, 0.9)',
              padding: 8,
            },
            // Modal: {
            //   color: 'red',
            // },
            Segmented: {
              colorText: 'white',
              colorBorder: 'white',
            },
          },
        }}
      >
        <ThemeProvider>
          <Head>
            <title>
              CBIndex | One-stop Toolkit for Decentralized Investment
            </title>
            <meta name="description"></meta>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {/* <ConnectKitButton /> */}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </ConfigProvider>
    </>
  )
}

export default MyApp
