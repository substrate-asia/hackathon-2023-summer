import {useNavigate, useParams} from "react-router-dom";
import {Button, Progress} from "antd";
import {AIR_DROP_LIST} from "../../assets";
import {Address, useBlockNumber, useSendTransaction} from "wagmi";
import {useWagmiTransaction, WagmiTransaction} from "../../libs/wagmi/hook/UseContractWrite";
import {StakeToken} from "../../web3/contracts/Contracts";
import {NoArgs} from "../../libs/wagmi/abi/WagmiAbiType";
import {parseEther} from "ethers/lib/utils";

export default function AirDropDetail() {
  let { id } = useParams();
  const navigate = useNavigate();
  const idNumber = id ? Number(id) : null;
  const airdrop = AIR_DROP_LIST.find((item) => item.id === idNumber)!;
  const desc = airdrop.desc.replace(/\\n/g, "\n");
  const clickBack = () => {
    navigate("/list");
  };

  return (
    <>
      <div className=" flex flex-row  items-center px-10 pt-5 text-grey">
        <span className="ml-2 text-grey cursor-pointer" onClick={clickBack}>
          {"< 返回空投列表页"}
        </span>
      </div>
      <div className="flex flex-row h-screen py-10 px-10">
        <div className="w-[400px] flex flex-col items-center ">
          <img
            src={airdrop.logo}
            alt="logo"
            className="w-[140px] h-[140px] mb-3"
          />
          <span className="text-[28px] text-white">{airdrop.name}</span>
          <AirDropProgress
            startblock={airdrop.startblock}
            endblock={airdrop.endblock}
          />
          <div className="flex flex-col mt-2">
            <StakeButton/>
            <GainButton/>
            <UnstakeButton/>
            <TipButton
              to='0x5543e4b0768FD806Ba51130BC885d1d2f34ccC80'
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="text-[24px] font-semibold mb-4">{airdrop.title}</div>
          <div className="leading-[1.5rem] max-w-[1000px] whitespace-pre-line">
            {desc}
          </div>
          <div className="text-[24px] font-semibold mb-4 mt-6 ">空投规则</div>
          <ul className="list-none">
            {airdrop.rules.map((rule: string, index) => {
              return (
                <li key={index} className="leading-[2rem]">
                  {index + 1}) {rule}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

function AirDropProgress({startblock, endblock}: {
  startblock: number,
  endblock: number,
}) {
  const { data } = useBlockNumber()
  return (
    <Progress
      percent={percent(startblock, endblock, data)}
      size={["80%", 18]}
      trailColor="#fff"
      className="text-center mt-5"
    />
  )
}

function percent(start: number, end: number, current?: number): number {
  if (!current) {
    return 0;
  }
  return (current - start) / (end - start)
}

function StakeButton() {
  const input: string = "1"

  const [stake, write] = useWagmiTransaction(StakeToken, 'stake', [parseEther(input)], {
    waitForTransaction: {
      onSuccess: () => {
        // 成功
      },
      onError: () => {
        // 失败
      },
    },
  });
  console.log('stake', stake)

  return (
    <TransactionBtn text='质押' transaction={stake} onClick={write}/>
  );
}

function GainButton() {
  const [gainBlockReward, write] = useWagmiTransaction(StakeToken, 'gainBlockReward', NoArgs, {
    waitForTransaction: {
      onSuccess: () => {
        // 成功
      },
      onError: () => {
        // 失败
      },
    },
  });
  console.log('gainBlockReward', gainBlockReward)

  return (
    <TransactionBtn text='Claim' transaction={gainBlockReward} onClick={write}/>
  );
}

function UnstakeButton() {
  const [unStake, write] = useWagmiTransaction(StakeToken, 'unStake', NoArgs, {
    waitForTransaction: {
      onSuccess: () => {
        // 成功
      },
      onError: () => {
        // 失败
      },
    },
  });
  console.log('unStake', unStake)

  return (
    <TransactionBtn text='解押' transaction={unStake} onClick={write}/>
  );
}

function TipButton({to}: {
  to: Address
}) {
  const input: string = "0.01"

  const { isLoading, sendTransaction } = useSendTransaction({
    mode: 'recklesslyUnprepared',
    to: to,
    data: null,
    value: parseEther(input)
  })

  return (
    <Button className="my-3 bg-blue rounded-full w-[120px] h-[40px]" disabled={!sendTransaction || isLoading} onClick={() => sendTransaction?.()}>
      打赏
    </Button>
  );
}

function TransactionBtn({text, transaction, onClick}: {
  text: string
  transaction: WagmiTransaction
  onClick?: () => void
}) {
  return (
    <Button className="my-3 bg-blue rounded-full w-[120px] h-[40px]" disabled={!onClick || transaction.busy} onClick={onClick}>
      {text}
    </Button>
  );
}
