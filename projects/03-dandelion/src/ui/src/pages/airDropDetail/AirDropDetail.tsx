import { useNavigate, useParams } from "react-router-dom";
import { Button, Progress } from "antd";
import { AIR_DROP_LIST } from "../../assets";
import { Address, useAccount, useBlockNumber, useSendTransaction } from "wagmi";
import {
  useWagmiTransaction,
  WagmiTransaction,
} from "../../libs/wagmi/hook/UseContractWrite";
import { stakeTokenContract, VEToken } from "../../web3/contracts/Contracts";
import { NoArgs } from "../../libs/wagmi/abi/WagmiAbiType";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { useWagmiRead } from "../../libs/wagmi/hook/UseContractRead";
// import InputModal from "components/InputModal";
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
      {/* <InputModal visible /> */}
      <div className="flex flex-row h-screen py-10 px-10 max-w-[1500px] m-0 mx-auto ">
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
            <StakeOrApproveButton stakeToken={airdrop.StakeToken} />
            <GainButton stakeToken={airdrop.StakeToken} />
            <UnstakeButton stakeToken={airdrop.StakeToken} />
            <TipButton to="0x5543e4b0768FD806Ba51130BC885d1d2f34ccC80" />
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

function AirDropProgress({
  startblock,
  endblock,
}: {
  startblock: number;
  endblock: number;
}) {
  const { data } = useBlockNumber();
  const percentage = percent(startblock, endblock, data).toFixed(0);
  return (
    <div className="flex flex-col items-center mt-5">
      <span className="text-[24px text-white]">空投进度：{percentage}%</span>
      <Progress
        percent={percent(startblock, endblock, data)}
        trailColor="#fff"
        className="text-center w-[120px] m-0"
        showInfo={false}
      />
    </div>
  );
}

function percent(start: number, end: number, current?: number): number {
  if (!current) {
    return 0;
  }
  if (current > end) return 100;
  if (current < start) {
    return 0;
  }
  return ((current - start) / (end - start)) * 100;
}

function StakeOrApproveButton({ stakeToken }: { stakeToken: Address }) {
  const input: string = "1000"; // TODO
  const amount = parseEther(input);

  const { address } = useAccount();
  const { data } = useWagmiRead(VEToken, "allowance", [address!, stakeToken], {
    watch: true,
  });

  if (data === undefined) {
    return (
      <Button className="my-3 bg-blue rounded-full w-[120px] h-[40px]" disabled>
        加载中...
      </Button>
    );
  }

  if (data.gte(amount)) {
    return <StakeButton stakeToken={stakeToken} amount={amount} />;
  } else {
    return <ApproveButton stakeToken={stakeToken} amount={amount} />;
  }
}

function StakeButton({
  stakeToken,
  amount,
}: {
  stakeToken: Address;
  amount: BigNumber;
}) {
  const contract = stakeTokenContract(stakeToken);
  const [stake, write] = useWagmiTransaction(contract, "stake", [amount], {
    waitForTransaction: {
      onSuccess: () => {
        // 成功
      },
      onError: () => {
        // 失败
      },
    },
  });
  console.log("[stake]", stake);

  return <TransactionBtn text="质押" transaction={stake} onClick={write} />;
}

function ApproveButton({
  stakeToken,
  amount,
}: {
  stakeToken: Address;
  amount: BigNumber;
}) {
  const [approve, write] = useWagmiTransaction(
    VEToken,
    "approve",
    [stakeToken, amount],
    {
      waitForTransaction: {
        onSuccess: () => {
          // 成功
        },
        onError: () => {
          // 失败
        },
      },
    }
  );
  console.log("[approve]", approve);

  return (
    <TransactionBtn text="质押前授权" transaction={approve} onClick={write} />
  );
}

function GainButton({ stakeToken }: { stakeToken: Address }) {
  const contract = stakeTokenContract(stakeToken);
  const [gainBlockReward, write] = useWagmiTransaction(
    contract,
    "gainBlockReward",
    NoArgs,
    {
      waitForTransaction: {
        onSuccess: () => {
          // 成功
        },
        onError: () => {
          // 失败
        },
      },
    }
  );
  console.log("[gainBlockReward]", gainBlockReward);

  return (
    <TransactionBtn
      text="Claim"
      transaction={gainBlockReward}
      onClick={write}
    />
  );
}

function UnstakeButton({ stakeToken }: { stakeToken: Address }) {
  const contract = stakeTokenContract(stakeToken);
  const [unStake, write] = useWagmiTransaction(contract, "unStake", NoArgs, {
    waitForTransaction: {
      onSuccess: () => {
        // 成功
      },
      onError: () => {
        // 失败
      },
    },
  });
  console.log("[unStake]", unStake);

  return <TransactionBtn text="解押" transaction={unStake} onClick={write} />;
}

function TipButton({ to }: { to: Address }) {
  const input: string = "0.01"; // TODO
  const amount = parseEther(input);

  const { isLoading, sendTransaction } = useSendTransaction({
    mode: "recklesslyUnprepared",
    request: {
      to: to,
      value: amount,
    },
  });

  return (
    <Button
      className="my-3 bg-blue rounded-full w-[120px] h-[40px]"
      disabled={!sendTransaction || isLoading}
      onClick={() => sendTransaction?.()}
    >
      打赏
    </Button>
  );
}

function TransactionBtn({
  text,
  transaction,
  onClick,
}: {
  text: string;
  transaction: WagmiTransaction;
  onClick?: () => void;
}) {
  return (
    <Button
      className="my-3 bg-blue rounded-full w-[120px] h-[40px]"
      disabled={!onClick || transaction.busy}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
