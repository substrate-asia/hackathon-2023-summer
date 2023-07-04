import {
  AIR_DROP_LIST,
  Tree1,
  Tree2,
  Tree3,
  Tree4,
  Tree5,
  Tree6,
} from "assets";
import { balanceStr } from "../../web3/wagmi/Balance";
import {
  useMyNativeBalance,
  useMyVEBalance,
  useMySignBalance,
  useMyBalance,
} from "../../web3/hook/UseBalance";
import {
  isWagmiError,
  useWagmiTransaction,
} from "../../libs/wagmi/hook/UseContractWrite";
import { SignToken } from "../../web3/contracts/Contracts";
import { BigNumber } from "ethers";
import { NoArgs } from "../../libs/wagmi/abi/WagmiAbiType";
import "./AssetsList.css";
import { FetchBalanceResult } from "@wagmi/core";
import { Button, message } from "antd";
import { AirDrop } from "../../constants";
import { useAccount } from "wagmi";
import { useWagmiRead } from "../../libs/wagmi/hook/UseContractRead";
import { WagmiContract } from "../../libs/wagmi/contract/WagmiContract";
import { StakeTokenAbi } from "../../web3/contracts/abi/StakeTokenAbi";

export default function AssetsList() {
  const nativeBalance = useMyNativeBalance(true);
  const veBalance = useMyVEBalance(true);

  return (
    <div className="flex flex-row justify-between w-full">
      <div className="w-[40%] max-w-[700px]:">
        <div className="container h-72">
          <div className="container-title">用户持有代币列表</div>
          <MyToken name="Dandelion" balance={nativeBalance} />
          <MyToken name="VEToken" balance={veBalance} />
        </div>
        <div className="separator w-full mt-10 h-[2px] max-w-[700px]"></div>

        <div className="container  mt-10">
          <div className="container-title">参与的空投项目</div>
          {AIR_DROP_LIST.map((airDrop) => (
            <MyAirDropTokenOrNull key={airDrop.id} airDrop={airDrop} />
          ))}
        </div>
      </div>
      <MyTree />
    </div>
  );
}

function MyAirDropTokenOrNull({ airDrop }: { airDrop: AirDrop }) {
  const contract = new WagmiContract(airDrop.StakeToken, StakeTokenAbi);
  const { address } = useAccount();
  const { data } = useWagmiRead(contract, "depositTimestamps", [address!], {
    enabled: address !== undefined,
    watch: true,
  });

  if (data && data.lt(BigNumber.from(0))) {
    return <MyAirDropToken airDrop={airDrop} />;
  } else {
    return null;
  }
}

function MyAirDropToken({ airDrop }: { airDrop: AirDrop }) {
  const balance = useMyBalance(airDrop.AIToken, true);
  return <MyToken name={airDrop.name} balance={balance} />;
}

function MyToken({
  name,
  balance,
}: {
  name: string;
  balance: FetchBalanceResult | undefined;
}) {
  return (
    <div className="border-line asset-item flex flex-row justify-between">
      <div className="flex flex-row">
        <img
          src="data:image/png;base64,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"
          alt=""
          className="w-[24px] h-[24px] mr-2"
        />
        <span className="asset-title">{name}</span>
      </div>
      <div className="">{balanceStr(balance, 4)}</div>
    </div>
  );
}

function MyTree() {
  // 签到token的余额
  const balance = useMySignBalance(true);
  // 树的状态
  const treeImage = treeImageOf(balance?.value);

  //
  const [messageApi, contextHolder] = message.useMessage();
  // 签到操作
  const [signIn3day, write] = useWagmiTransaction(
    SignToken,
    "signIn3day",
    NoArgs,
    {
      waitForTransaction: {
        onSuccess: () => {
          // 成功
          console.log("succeess");
        },
        onError: () => {
          // 失败
          console.log("failed");
        },
      },
    }
  );
  // TODO: 逻辑待确定
  const clickCheckIn = () => {
    const enableCheckIn = !isWagmiError(signIn3day.prepareStatus);
    if (enableCheckIn && write) {
      write();
    } else {
      messageApi.info({
        content: "现在不能浇水，晚点再来吧",
        className: "custom-tip",
      });
    }
  };
  // signIn3day.busy 正在进行合约写操作
  console.log("[signIn3day]", signIn3day);

  return (
    <>
      {contextHolder}
      <div className="flex flex-col flex-1 items-center ">
        <div className="flex flex-col bg-cardbg tree-card-bg rounded-md  items-center justify-center tooltip relative">
          <img src={treeImage} alt="" className="w-[300px] self-center" />
          {/* onClick={write} */}
          <span className="tooltip-text absolute hidden bg-gray-800 text-white px-2 py-1 rounded-md text-sm -translate-x-1/2 left-1/2 ">
            {/* TODO: 逻辑待确定 */}
            {isWagmiError(signIn3day.prepareStatus) || !write
              ? "现在不能浇水，晚点再来吧"
              : "给植物浇个水签到吧"}
          </span>
        </div>
        <div className="mt-7">
          <span>{`活跃度：${balanceStr(balance, 0) || "0"}`}</span>
          <Button
            className="w-[80px]  bg-blue border-none ml-4"
            onClick={clickCheckIn}
          >
            浇水
          </Button>
        </div>
      </div>
    </>
  );
}

// 0=图1 ，1到10=图2，11到30=图3，31到60等于图4，61到100=图5，100到150=图6
function treeImageOf(balance?: BigNumber): string {
  if (!balance) {
    return Tree1; // 还未获取树的状态
  }
  if (balance.lte(BigNumber.from(0).pow(18))) {
    return Tree1;
  }
  if (balance.lte(BigNumber.from(10).pow(18))) {
    return Tree2;
  }
  if (balance.lte(BigNumber.from(30).pow(18))) {
    return Tree3;
  }
  if (balance.lte(BigNumber.from(60).pow(18))) {
    return Tree4;
  }
  if (balance.lte(BigNumber.from(100).pow(18))) {
    return Tree5;
  }
  return Tree6;
}
