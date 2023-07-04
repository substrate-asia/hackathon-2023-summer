"use client";
import React, { useEffect, useState } from "react";
import {
  useWaitForTransaction,
  useWalletClient,
  usePublicClient,
  useAccount,
} from "wagmi";
import { parseEther, hashMessage, recoverPublicKey, stringToBytes } from "viem";
import { currentCybrosAddress, useAppStatus } from "@/utils/atoms";
import {
  JOB_CONTRACT_ABI,
  JOB_CONTRACT_ADDRESS,
  ON_POLKADOT_QUERY_URL,
} from "@/constants";
import {
  blake2AsU8a,
  encodeAddress,
  secp256k1Compress,
} from "@polkadot/util-crypto";
import { hexToU8a, u8aToHex } from "@polkadot/util";
import { useSetAtom } from "jotai";
import { Spin, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function PromptInput() {
  const account = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [currentTxHash, setCurrentTxHash] = useState();

  const [prompt, setPrompt] = React.useState("");
  const { data: statusData } = useAppStatus();

  const { isSuccess } = useWaitForTransaction({
    currentTxHash,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const setCurrentCybrosAddress = useSetAtom(currentCybrosAddress);

  useEffect(() => {
    // console.log("sending tx", currentTxHash);
    if (currentTxHash && currentTxHash !== "") {
      console.log("currentTx: ");
      console.log(currentTxHash);
      setShow(true);
    }
  }, [currentTxHash]);

  const sendTx = async () => {
    const p = prompt.trim();
    const input = JSON.stringify({ e2e: false, data: p });
    const hashedMessage = hashMessage(input);
    const signatureHex = await walletClient.signMessage({ message: input });
    const recoveredPublicKey = await recoverPublicKey({
      hash: hashedMessage,
      signature: signatureHex,
    });
    const recoveredPublicKeyHex = hexToU8a(recoveredPublicKey);
    const recoveredPublicKeyEx = u8aToHex(
      recoveredPublicKeyHex.slice(1, recoveredPublicKeyHex.length)
    );
    const compressedEvmPublicKey = secp256k1Compress(
      hexToU8a(recoveredPublicKey)
    );
    const subAddressFromEvmPublicKey = encodeAddress(
      blake2AsU8a(compressedEvmPublicKey),
      42
    );
    setCurrentCybrosAddress(subAddressFromEvmPublicKey);

    const r = signatureHex.slice(0, 66);
    const s = "0x" + signatureHex.slice(66, 130);
    const v = parseInt(signatureHex.slice(130, 132), 16);
    const args = [
      input,
      `${stringToBytes(input).length}`,
      v,
      r,
      s,
      recoveredPublicKeyEx,
    ];

    const { request } = await publicClient.simulateContract({
      address: JOB_CONTRACT_ADDRESS,
      functionName: "request",
      value: parseEther("0.02"),
      args,
      abi: JOB_CONTRACT_ABI,
      account: account.address,
    });
    console.log("writing contract");
    setIsLoading(true);
    const hash = await walletClient
      .writeContract(request)
      .finally(() => setIsLoading(false));
    setCurrentTxHash(hash);
  };

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const SpinIndicator = (tint?: string) => {
    return (
      <LoadingOutlined
        style={{ fontSize: 34, color: tint ?? undefined }}
        spin
      />
    );
  };

  return (
    <Spin
      indicator={SpinIndicator("4F4F4F")}
      spinning={isLoading}
      size="large"
      className="my-8"
      style={{ borderRadius: "44px" }}
    >
      <div className="flex flex-col gap-[18px] bg-white/[0.72] shadow-cb rounded-15">
        <Modal
          open={show}
          centered
          width={490}
          footer={null}
          className="cb-modal"
          onCancel={() => setShow(false)}
          maskClosable={true}
        >
          <div className="flex flex-col justify-items-center bg-white">
            <Spin
              indicator={SpinIndicator()}
              spinning={true}
              size="large"
              className="my-8"
              style={{ borderRadius: "44px" }}
            />
            <p className=" text-black text-[34px] leading-[40px] text-center font-bold">
              Your request is being
              <br />
              processed
            </p>
            <p className="text-[14px] leading-[25px] font-medium ext-cb-normal mt-[22px] text-center mx-[20px]">
              It may take some time
              <br />
              for the transaction to be processed and finalized on the chain.
            </p>
            <a
              href={`${"https://polygonscan.com/tx/"}${currentTxHash}`}
              className="text-[14px] text-blue-500 text-center my-[28px] font-medium"
              target="_blank"
            >
              View on Polygonscan
            </a>
          </div>
        </Modal>
        <div className="flex justify-between items-start ml-[39px] mr-[42px] mt-[27px]">
          <div className="text-[21px] font-medium leading-[25.41px]">
            Generate
          </div>
          <div className="font-medium text-[15px] leading-[29px] text-cb-normal">
            finalized height:{" "}
            {typeof statusData?.height === "number" ? statusData.height : "..."}
            {" | "}
            pending jobs:{" "}
            {typeof statusData?.queueSize === "number"
              ? statusData.queueSize
              : "..."}
          </div>
        </div>
        <div className="flex rounded-15 mx-[30px] bg-[#F1F1F1] text-[16px] min-h-[90px]">
          <textarea
            className="mt-[18px] mb-[8px]  mx-6 w-full border-none outline-none shadow-none text-cb-normal bg-[#F1F1F1] leading-21 font-normal"
            placeholder="Prompt goes here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          ></textarea>
        </div>
        <div className="flex justify-start mx-[33px] mb-6">
          <button
            className=" justify-center items-center shadow-cb shadow-entrance-aigc hover:shadow-faucetEn text-entrance-aigc font-medium leading-[21px] rounded-15 bg-white/[0.72] text-[16px] h-[45px]"
            onClick={sendTx}
            disabled={isLoading || prompt.trim() === ""}
          >
            <p className="mx-6">{isLoading ? "Generating" : "Generate"}</p>
          </button>
        </div>
      </div>
    </Spin>
  );
}

export default PromptInput;
