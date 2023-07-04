import Base from '@/components/common/Base'
import Sidebar from '@/components/common/Sidebar'
import Header from '@/components/common/Header'
import Button from '@/components/ui/BaseButton'
import BaseCtx from '@/utils/context'
import { useState, useContext, useMemo } from 'react'
import * as U from '@/utils'
import useApi from '@/hooks/use-api'
import { Injected, InjectedWeb3, PrivateWalletStateInfo } from '@/utils/interfaces'
import { ApiPromise, HttpProvider, WsProvider, Keyring } from '@polkadot/api';
import BN from 'bn.js'
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToBn, hexToU8a, u8aToHex, u8aWrapBytes, u8aUnwrapBytes } from '@polkadot/util';
import axios from 'axios'

const injectedWeb3 = window.injectedWeb3
  ? (window.injectedWeb3['manta-wallet-js'] as InjectedWeb3)
  : null;


export default function Service() {
  const { zkAddress, drumbeatAddress } = useContext(BaseCtx)
  const [zkAdd, setZkAdd] = useState('')
  const [data, setData] = useState('')
  const [timer, setTimer] = useState('')
  const [sbt, setSBT] = useState('')
  const [isInjected] = useState(!!injectedWeb3);
  const [injected, setInjected] = useState<Injected | null>(null);
  const [proofKey, setProofKey] = useState('')


  const { api } = useApi(U.C.DRUMBEAT_NETWORK)
  const _api = useMemo(() => api, [api])


  return (
    <Base>
      <div className='flex'>
        <Sidebar
          currentPage='Service'
        />
        <div className='flex-1 bg-gray-100 px-[3.375rem]'>
          <Header
            currentPage='Service'
          />
          <div className='bg-white rounded-[20px] p-[2rem] mb-[1.875rem]'>
            <div className='mb-[3.125rem] text-[24px] font-semibold'>Data Service</div>
            <div className='flex flex-col items-center'>
              <div className='text-[1.5rem] mb-[1.875rem]'>Last Blockchain Data Sync Time : {timer}</div>
              <div className='text-[1.5rem] mb-[1.875rem]'>{data}</div>
              <Button
                label='Data Sync'
                handleClick={() => {
                  const d = localStorage.getItem('sync_data')
                  if (d) {
                    setData(d)
                    setTimer(U.H.getTimer())
                  }
                }}
                bg='bg-black'
                color='text-white'
                borderColor='border-black'
              />
              {
                data
                &&
                <div className='text-[1.5rem] mt-[1.875rem] text-[#6EBB5B] font-semibold'>Data Synchronization Completed! </div>
              }
            </div>
          </div>
          <div className='bg-white rounded-[20px] p-[2rem] mb-[1.875rem]'>
            <div className='mb-[3.125rem] text-[24px] font-semibold'>Zk Service</div>
            <div className='flex justify-between'>
              <div className='p-[1.25rem] rounded-[10px] bg-[#F8F8F8] border border-dashed w-[49%]'>
                <div className='text-[1.5rem] font-bold mb-[1.75rem]'>Get ZK address </div>
                <div className='text-[1rem] font-bold mb-[1.75rem]'>ZK Address: {zkAdd}</div>
                <Button
                  label='Get ZK Address'
                  handleClick={() => {
                    setZkAdd(zkAddress || '')
                  }}
                  bg='bg-black'
                  color='text-white'
                  borderColor='border-black'
                />
                {
                  zkAdd
                  &&
                  <div className='text-[1rem] mt-[1.875rem] text-[#6EBB5B] font-semibold'>Your ZK address is! </div>
                }

              </div>
              <div className='p-[1.25rem] rounded-[10px] bg-[#F8F8F8] border border-dashed w-[49%]'>
                <div className='text-[1.5rem] font-bold mb-[1.75rem]'>Generate zkSBT</div>
                <div className='text-[1rem] font-bold'>SBT Info:</div>
                <div className='text-[1rem] font-bold mb-[3.75rem]'>{sbt}</div>
                <Button
                  label='Generate ZK SBT'
                  handleClick={async () => {

                    const injected = await injectedWeb3?.enable(U.C.EXTENSION_NAME);
                    if (!injected) {
                      return;
                    }
                    await injected?.privateWallet.walletSync()
                    setInjected(injected);

                    console.log(injected)
                    const provider = new WsProvider(U.C.MANTA_NETWORK);


                    const api = await ApiPromise.create({ provider });
                    api.setSigner(injected.signer);


                    // const publicAddress = "dmxo4jnCHcDqMKqnUyQg2GuiMJHY48nfdeFcLgstZyxKNcVvg"
                    const publicAddress = drumbeatAddress!

                    // const reserverTx = await api.tx.mantaSbt.reserveSbt(null);
                    // await reserverTx.signAndSend(publicAddress);

                    const assetIdRange: any = await api.query.mantaSbt.reservedIds(publicAddress);
                    const [startAssetId, endAssetId] = assetIdRange.unwrap();
                    // console.log(startAssetId.toString(), endAssetId.toString())

                    const { posts, transactionDatas }: any = await injected?.privateWallet.multiSbtPostBuild({
                      sbtInfoList: [
                        { assetId: startAssetId.toString(), amount: '1' },
                      ],
                      network: "Calamari",
                    });

                    console.log('transactionDatas---->>>', transactionDatas)
                    if (data) {
                      const d = JSON.parse(data)
                      const { tag, score } = U.H.calculationTag(d)
                      const level = U.H.calculationSingleLevel(score)
                      const metadata = `{level: ${level}, tag: ${tag}, score: ${score}}`

                      const post = posts[0];
                      const zkp = post[0];
                      const tx = api.tx.mantaSbt.toPrivate(null, null, null, zkp, metadata);
                      await tx.signAndSend(publicAddress, { nonce: -1 }, async ({ events = [], status, txHash, dispatchError }) => {
                        if (status.isInBlock || status.isFinalized) {
                          let tx_data = transactionDatas[0];
                          const proofId = u8aToHex(
                            tx_data[0].ToPrivate[0]['utxo_commitment_randomness']
                          );
                          console.log("ProofKey:" + proofId);
                          setProofKey(proofId)
                        }
                      });
                    }

                  }}
                  bg='bg-black'
                  color='text-white'
                  borderColor='border-black'
                />
                <div className='w-2 h-2'></div>
                <Button
                  label='Get SBT in NPO'
                  handleClick={() => {
                    // Get NPO
                    // axios.post('https://dev.asmatch-api-npo.nonprod-asmatch.xyz/npo/proof', {
                    //   proof_id: proofKey || '0x83ff681585248771920ff1d35887de303942a9b9a5229e6810d2119891022303',
                    //   api_key: 'YcwG2dtsyhb5i8F3QZMJzWztdHFcAWwG',
                    //   project: 'TEST0703'
                    // }).then(() => {

                    // })

                    // set sbt metadata
                    if (data) {
                      const d = JSON.parse(data)
                      const { tag, score } = U.H.calculationTag(d)
                      const level = U.H.calculationSingleLevel(score)
                      setSBT(`{level: ${level}, tag: ${tag}, score: ${score}}`)
                    }
                  }}
                  bg='bg-black'
                  color='text-white'
                  borderColor='border-black'
                />
                <div className='w-2 h-2'></div>
                <Button
                  label='UpDate User Drumbeat'
                  handleClick={async () => {
                    const P = new U.P(drumbeatAddress!, _api!)
                    console.log(data)
                    if (data) {
                      const d = JSON.parse(data)
                      const { tag, score } = U.H.calculationTag(d)
                      const level = U.H.calculationSingleLevel(score)
                      console.log(tag, score, level)

                      await P.updateUserProfile(30, tag, level, true)
                    }
                  }}
                  bg='bg-black'
                  color='text-white'
                  borderColor='border-black'
                />
                {
                  sbt
                  &&
                  <div className='text-[1rem] mt-[1.875rem] text-[#6EBB5B] font-semibold'>zkSBT Generate Successfully!</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Base>
  )
}
