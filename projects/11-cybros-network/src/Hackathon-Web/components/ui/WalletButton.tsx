"use client";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { useSetAtom } from "jotai";
import { currentCybrosAddress } from "@/utils/atoms";
import { hashMessage, recoverPublicKey } from "viem";
import { hexToU8a, u8aToHex } from "@polkadot/util";
import {
  blake2AsU8a,
  encodeAddress,
  secp256k1Compress,
} from "@polkadot/util-crypto";

const WalletButton = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { data: balance } = useBalance({ address, watch: true });
  const { disconnect } = useDisconnect();
  const setCurrCybrosAdd = useSetAtom(currentCybrosAddress);
  const { data: walletClient } = useWalletClient();

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return address.slice(0, 5) + "..." + address.slice(-4);
  }, [address]);

  // useEffect(() => {
  //   if (!address) return;
  //   if (!walletClient) return;
  //   (async () => {
  //     console.log(address);
  //     const input =
  //       "Sign to get your identity on Cybros Network and mint NFTs.";
  //     const hashedMessage = hashMessage(input);
  //     const signatureHex = await walletClient?.signMessage({ message: input });
  //     const recoveredPublicKey = await recoverPublicKey({
  //       hash: hashedMessage,
  //       signature: signatureHex,
  //     });
  //     const compressedEvmPublicKey = secp256k1Compress(
  //       hexToU8a(recoveredPublicKey)
  //     );
  //     const subAddressFromEvmPublicKey = encodeAddress(
  //       blake2AsU8a(compressedEvmPublicKey),
  //       42
  //     );
  //     setCurrCybrosAdd(subAddressFromEvmPublicKey);
  //   })();
  // }, [address, walletClient]);

  const WalletTitle = () => {
    if (isLoading) {
      return "Connecting";
    } else if (!isConnected) {
      return "Connect Wallet";
    } else {
      return `${shortAddress} | ${
        balance
          ? parseFloat(balance.formatted).toFixed(4) + " " + balance.symbol
          : "--"
      }`;
    }
  };

  return (
    <div
      className="cb-border-h rounded-15 bg-white flex mt-[10px] gap-[13px] h-[49px] items-start"
      onClick={
        !isLoading && isConnected
          ? () => {
              disconnect();
            }
          : () => {
              connect({ connector: connectors[0] });
            }
      }
    >
      <Image
        className="w-[21px] h-[21px] ml-6 mt-[14px]"
        src="/wallet-icon.svg"
        alt=""
        width={21}
        height={21}
      />
      <p className="font-medium leading-[21px] text-[16px] mt-[15px] mr-[25px]">
        <WalletTitle />
      </p>
    </div>
  );
};

export default WalletButton;
