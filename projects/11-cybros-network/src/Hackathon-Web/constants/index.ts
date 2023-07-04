import { IndexEntranceProps } from "@/types";
import { DM_Mono } from "next/font/google";
import { FormatAbi } from "abitype";

export const GITHUB_URL = "https://github.com/cybros-network";
export const DC_URL = "https://discord.gg/NXwGRzTnCS";
export const FAUCET_URL = "https://faucet.cybros.network/";
export const ON_POLKADOT_URL =
  "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fnode-rpc.cybros.network%2F#/explorer";
export const JOB_CONTRACT_ADDRESS =
  "0x6B77FE5436d4AC1e2b6E4DBAaCA5704b1560C68a";

export const ALCHEMY_KEY =
  process.env.NEXT_PUBLIC_ALCHEMY_KEY || "ArM_wvoZ1OKmMayQEMtNJeWLrh8yqUhs";
export const ON_POLKADOT_QUERY_URL =
  "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fnode-rpc.cybros.network%2F#/explorer/query/";

export const API_URL = "https://demo-api.cybros.network";

export const JOB_CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "input",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "publicKey",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "simple",
        type: "bool",
      },
    ],
    name: "PromptRequested",
    type: "event",
  },
  {
    inputs: [],
    name: "minAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_input",
        type: "string",
      },
      {
        internalType: "string",
        name: "length",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "_v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "_r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_s",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_publicKey",
        type: "bytes",
      },
    ],
    name: "request",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_prompt",
        type: "string",
      },
    ],
    name: "requestSimple",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minAmount",
        type: "uint256",
      },
    ],
    name: "setMinAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const dm_mono_font = DM_Mono({
  weight: "300",
  subsets: ["latin"],
});

export const entranceConfig: {
  main: IndexEntranceProps;
  subs: IndexEntranceProps[];
} = {
  main: {
    primaryColor: "#A43737",
    borderColor: "shadow-entrance-aigc",
    titleDirection: "row",
    title: "The Imaginator Demo",
    description:
      "Generate ERC-721 NFTs with distributed AI compute power, mint NFTs and share on social media.",
    goLink: "/imaginator",
    iconURL: "/entran-aigc.svg",
    width: 646,
  },
  subs: [
    {
      primaryColor: "#3C3C3C",
      borderColor: "shadow-entrance-github",
      titleDirection: "col",
      title: "Github",
      description: "Check us out on Github.",
      goLink: GITHUB_URL,
      iconURL: "/entran-github.svg",
      width: 314,
    },
    {
      primaryColor: "#374FA6",
      borderColor: "shadow-entrance-discord",
      titleDirection: "col",
      title: "Discord",
      description: "Join our Discord server!",
      goLink: DC_URL,
      iconURL: "/entran-discord.svg",
      width: 314,
    },
    {
      primaryColor: "#A45E37",
      borderColor: "shadow-entrance-testnet",
      titleDirection: "col",
      title: "Cybros on Polkadot.js",
      description: "Play directly with Cybros testnet.",
      goLink: ON_POLKADOT_URL,
      iconURL: "/entran-testnet.svg",
      width: 314,
      addtion: {
        className:
          "flex flex-row justify-center items-center rounded-15 w-[101px] shadow-cb transition-shadow duration-100  shadow-entrance-testnet hover:shadow-faucetEn bg-white text-[16px] font-medium leading-21 text-entrance-testnet",
        title: "Faucet",
        link: FAUCET_URL,
      },
    },
  ],
};
