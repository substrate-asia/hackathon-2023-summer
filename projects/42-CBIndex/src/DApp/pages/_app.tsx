import type { AppProps } from 'next/app'
import { ThemeProvider } from '~/lib/theme'
import '../styles/globals.css'
import '../styles/swiper.css'
import Layout from '~/components/Layout'
import Head from 'next/head'
import { ConfigProvider, theme, Button } from 'antd'
import { u8aToHex } from '@polkadot/util'
// import { HexString } from '@polkadot/util/types';
import {
  ApiProvider as GearApiProvider,
  AlertProvider as GearAlertProvider,
  AccountProvider,
  ProviderProps,
  useAccount,
} from '@gear-js/react-hooks'
// import { Alert, alertStyles } from '@gear-js/ui'
import { useEffect, useState } from 'react'
import { readFileSync } from 'fs'
import {
  getProgramMetadata,
  GearApi,
  GearKeyring,
  MessageQueued,
  UserMessageSent,
} from '@gear-js/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { Keyring, WsProvider, ApiPromise } from '@polkadot/api'
import { HexString } from '@polkadot/util/types'
// import { withProviders } from '../components/hocs'
// import
let alice: KeyringPair
export function waitForReply(
  api: GearApi,
  programId: string
): (messageId: string) => Promise<UserMessageSent> {
  const messages = {}
  api.query.system.events((events) => {
    events.forEach(({ event }) => {
      if (api.events.gear.UserMessageSent.is(event)) {
        const {
          data: {
            message: { source, details },
          },
        } = event as UserMessageSent
        if (
          source.eq(programId) &&
          details.isSome &&
          details.unwrap().isReply
        ) {
          messages[details.unwrap().asReply.replyTo.toHex()] =
            event as UserMessageSent
        }
      }
    })
  })
  return (messageId: string) => {
    return messages[messageId]
  }
}
export function decodeAddress(publicKey: string): HexString {
  return u8aToHex(new Keyring().decodeAddress(publicKey))
}
let [programId] = process.argv.slice(2) as [HexString]
console.log(programId)

const metaF =
  '0100000000000104000000010b0000000000000000010c000000011540000820656e7472795f696f28496e697446546f6b656e00000c014473746f726167655f636f64655f686173680401104832353600014866745f6c6f6769635f636f64655f686173680401104832353600013c73686172655f636f64655f6861736804011048323536000004083c7072696d69746976655f74797065731048323536000004000801205b75383b2033325d000008000003200000000c000c0000050300100820656e7472795f696f3046546f6b656e416374696f6e0001181c4d6573736167650801387472616e73616374696f6e5f696414010c75363400011c7061796c6f616418012c4c6f676963416374696f6e0000004c5570646174654c6f676963436f6e747261637408014866745f6c6f6769635f636f64655f686173680401104832353600014473746f726167655f636f64655f68617368040110483235360001002847657442616c616e636504001c011c4163746f7249640002002c4765745065726d6974496404001c011c4163746f72496400030014436c6561720400040110483235360004005c4d69677261746553746f7261676541646472657373657300050000140000050600180820656e7472795f696f2c4c6f676963416374696f6e00011c104d696e74080124726563697069656e741c011c4163746f724964000118616d6f756e7420011075313238000000104275726e08011873656e6465721c011c4163746f724964000118616d6f756e7420011075313238000100205472616e736665720c011873656e6465721c011c4163746f724964000124726563697069656e741c011c4163746f724964000118616d6f756e74200110753132380002001c417070726f7665080140617070726f7665645f6163636f756e741c011c4163746f724964000118616d6f756e7420011075313238000300185065726d69741401346f776e65725f6163636f756e741c011c4163746f724964000140617070726f7665645f6163636f756e741c011c4163746f724964000118616d6f756e74200110753132380001247065726d69745f6964200110753132380001107369676e2401104835313200040018496e766573740c011873656e6465721c011c4163746f724964000124726563697069656e741c011c4163746f724964000118616d6f756e742001107531323800050018466f6c6c6f7704011c6163636f756e741c011c4163746f724964000600001c10106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000020000005070024083c7072696d69746976655f74797065731048353132000004002801205b75383b2036345d000028000003400000000c002c0820656e7472795f696f2c46546f6b656e4576656e7400011c084f6b0000000c4572720001001c42616c616e6365040020011075313238000200205065726d6974496404002001107531323800030018496e7665737408001c011c4163746f72496400002001107531323800040020496e76657374656408001c011c4163746f72496400002001107531323800050018466f6c6c6f7700060000300820656e7472795f696f2c46546f6b656e537461746500000c011461646d696e1c011c4163746f72496400012c66745f6c6f6769635f69641c011c4163746f7249640001307472616e73616374696f6e733401785665633c28483235362c205472616e73616374696f6e537461747573293e00003400000238003800000408043c003c0820656e7472795f696f445472616e73616374696f6e53746174757300010c28496e50726f67726573730000001c537563636573730001001c4661696c75726500020000'
function MyApp({ Component, pageProps }: AppProps) {
  // const { account, accounts } = useAccount()
  // console.log(account, accounts)

  async function connect() {
    programId =
      '0x0843eda4f4cb3097ea2ccca7d516c4b45413d15fb0b29c0f1c23cfaad99ba0d1'
    const api = await GearApi.create({
      providerAddress: 'wss://testnet.vara.rs',
    })
    const alice = await GearKeyring.fromSuri('//Alice')
    const metaFile = metaF
    // console.log(metaFile)
    const meta = getProgramMetadata(`0x${metaFile}`)
    console.log(meta)

    const payload = {
      GetBalance:
        '0x6884b1d1c926ca020628027f21f3739a7e69a8143a6ed58d0f8f3e064f7be56d',
    }
    const gas = await api.program.calculateGas.handle(
      decodeAddress(alice.address),
      programId,
      payload,
      0,
      true,
      meta
    )
    console.log(gas.min_limit.toString())
    console.log(
      decodeAddress('5Deo9wkThVsrQE5er4rTLxThEBE25oyVuwNLdg8EqacUyEcA')
    )

    const tx = api.message.send(
      {
        destination: programId,
        payload,
        gasLimit: gas.min_limit,
        value: 0,
      },
      meta,
      meta.types.handle.input
    )
    // const waitForReply = api.message.listenToReplies(programId)
    // console.log(waitForReply)
    // const [txData] = await sendTransaction(tx, alice, ['MessageQueued'])
    console.log(tx)
    console.log(programId)
    console.log(alice.address)

    const reply = waitForReply(api, programId)
    let messageId: HexString
    try {
      await new Promise((resolve, reject) => {
        tx.signAndSend(alice, ({ events, status }) => {
          console.log(events)

          console.log(`STATUS: ${status.toString()}`)
          console.log(status.isFinalized)
          if (status.isFinalized) resolve(status.asFinalized)
          // console.log(events);
          events.forEach(({ event }) => {
            console.log(event)

            console.log(event.method)
            if (event.method === 'MessageQueued') {
              messageId = (event as MessageQueued).data.id.toHex()
              console.log(messageId)
            } else if (event.method === 'ExtrinsicFailed') {
              reject(api.getExtrinsicFailedError(event).docs.join('/n'))
            } else {
              console.log(event.method)
            }
          })
        })
      })
      const replyEvent = await reply(messageId)
      let num = replyEvent.data.toHuman().message.payload
      console.log(num.toHuman())
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    connect()
  }, [])

  async function LoginEvt() {
    // 连接到指定的节点
    const provider = new WsProvider('wss://testnet.vara.rs')
    const api = await ApiPromise.create({ provider })

    // 创建钱包
    const keyring = new Keyring({ type: 'sr25519' })

    // 添加钱包账户
    const account = keyring.addFromMnemonic(
      'disease edit fossil fame moral menu fade track purchase aerobic link hour'
    )
    console.log(decodeAddress(account.address))

    console.log('Connected wallet address:', account.address)

    // 其他操作...
  }

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
          <Button onClick={() => LoginEvt()}>connect wallet</Button>
          {/* <Modal /> */}
          <Layout>
            {/* {withProviders()} */}
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </ConfigProvider>
    </>
  )
}

export default MyApp
