import {Account} from "../connector/Account";
import {Connectors} from "../connector/Connectors";
import {Address, useNetwork} from "wagmi";
import {useState} from "react";
import {
    isWagmiLoading,
    isWagmiSuccess,
    useWagmiTransaction,
    WagmiStatus,
    WagmiWrite
} from "../../libs/wagmi/hook/UseContractWrite";
import {VEToken} from "../../web3/contracts/Contracts";
import {BigNumber} from "ethers";
import {Hash} from "@wagmi/core";
import {useConnected} from "../../libs/wagmi/hook/UseAccount";

export function Demo() {
    const connected = useConnected()

    return <>
        <Account/>
        <Connectors/>
        {/*<NetworkSwitcher/>*/}
        {connected && <Approve/>}
    </>
}

// 授权
function Approve() {
    // 授权给谁
    const [spender, setSpender] = useState<Address>('0x5543e4b0768FD806Ba51130BC885d1d2f34ccC80')
    // 授权金额
    const [amount, setAmount] = useState('0')

    // 授权操作
    const [result, write] = useWagmiTransaction(VEToken, 'approve', [spender, BigNumber.from(amount)], {
        prepareWrite: {
            enabled: Boolean(spender && amount),
        },
    })
    console.log('approve:', result)

    return (
        <div>
            <div>
                Spender:
                <input
                    disabled={result.busy}
                    onChange={(e) => setSpender(e.target.value as Address)}
                    placeholder="spender address"
                    value={spender}
                    style={{ width: 400 }}
                />
            </div>
            <div>
                Amount:
                <input
                    disabled={result.busy}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="amount (units)"
                    value={amount}
                />
            </div>
            <SendTransaction
                text='Approve'
                prepareErr={result.prepareErr}
                txHash={result.txHash}
                txStatus={result.txStatus}
                write={write}
            />
        </div>
    )
}

// 发送交易按钮
function SendTransaction({text, prepareErr, write, txHash, txStatus}: {
    text: string
    prepareErr: Error | null
    txHash: Hash | undefined
    txStatus: WagmiStatus
    write: WagmiWrite | undefined
}) {
    return <>
        <button disabled={!write} onClick={() => write?.()}>{text}</button>
        {isWagmiLoading(txStatus) && <ProcessingMessage hash={txHash} />}
        {isWagmiSuccess(txStatus) && <div>Success!</div>}
        {prepareErr && <div>Error: {prepareErr?.message}</div>}
    </>
}

// 发送交易后，等待交易状态
function ProcessingMessage({ hash }: { hash?: Hash }) {
    const { chain } = useNetwork()
    const etherscan = chain?.blockExplorers?.etherscan
    return <span>
        Processing transaction...{' '}
        {etherscan && <a href={`${etherscan.url}/tx/${hash}`}>{etherscan.name}</a>}
    </span>
}
