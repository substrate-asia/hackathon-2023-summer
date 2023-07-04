import type { Unsubcall } from '@polkadot/extension-inject/types';
import type { Injected as PolkadotInjected } from '@polkadot/extension-inject/types';

declare global {
  interface Window {
    injectedWeb3: {
      'manta-wallet-js': {
        version: string;
        enable: (originName: string) => Promise<Injected>;
      };
    };
  }
}

export interface Injected extends PolkadotInjected {
  privateWallet: InjectedPrivateWallet;
}

export type InjectedWeb3 = {
  version: string;
  enable: (originName: string) => Promise<Injected>;
};

export type Network = 'Dolphin' | 'Calamari' | 'Manta';

export interface PrivateWalletStateInfo {
  isWalletInitialized: boolean;
  isWalletAuthorized: boolean;
  isWalletReady: boolean;
  isWalletBusy: boolean;
  isWalletSyncing: boolean;
  isWalletConsolidating: boolean;
}

export interface RequestBasePayload {
  assetId: string;
  network: Network;
}

export interface RequestMultiZkBalancePayload {
  assetIds: string[];
  network: Network;
}

export interface RequestTransactionPayload extends RequestBasePayload {
  amount: string;
  polkadotAddress: string;
}

export interface RequestTransferTransactionPayload
  extends RequestTransactionPayload {
  toZkAddress: string;
}

export interface ResponseBuildMultiSbtPost {
  transactionDatas: any[];
  posts: any[];
}

export type RequestSbtInfo = {
  assetId: string;
  amount?: string;
};

export interface RequestBuildMultiSbtPostPayload {
  sbtInfoList: RequestSbtInfo[];
  network: Network;
}

export type TransactionPost = any;
export type TransactionData = any;

export interface RequestGetSbtTransactionDatasPayload {
  posts: TransactionPost[];
  network: Network;
}

export interface RequestGetIdentityProofPayload {
  virtualAsset: string;
  polkadotAddress: string;
  network: Network;
}

export interface RequestMatchPrivateTransaction {
  extrinsicHash: string;
  method: string;
  network: Network;
}

export type PrivateTransactionType =
  | 'publicToPrivate'
  | 'privateToPrivate'
  | 'privateToPublic';

export interface RequestEstimateTransactionPayload {
  transactionType: PrivateTransactionType;
  assetId: string;
  amount: string;
  zkAddressOrPolkadotAddress?: string;
  network: Network;
}

export interface InjectedPrivateWallet {
  getWalletState(): Promise<PrivateWalletStateInfo>;
  walletSync(): Promise<boolean>;
  getZkBalance(payload: RequestBasePayload): Promise<string | null>;
  getMultiZkBalance(
    payload: RequestMultiZkBalancePayload,
  ): Promise<string[] | null>;
  toPrivateBuild(payload: RequestTransactionPayload): Promise<string[] | null>;
  privateTransferBuild(
    payload: RequestTransferTransactionPayload,
  ): Promise<string[] | null>;
  toPublicBuild(payload: RequestTransactionPayload): Promise<string[] | null>;
  sbtWalletSync(): Promise<boolean>;
  getZkSbtBalance(payload: RequestBasePayload): Promise<string | null>;
  getMultiZkSbtBalance(
    payload: RequestMultiZkBalancePayload,
  ): Promise<string[] | null>;
  multiSbtPostBuild(
    payload: RequestBuildMultiSbtPostPayload,
  ): Promise<ResponseBuildMultiSbtPost | null>;
  getSbtTransactionDatas(
    payload: RequestGetSbtTransactionDatasPayload,
  ): Promise<TransactionData[] | null>;
  getSbtIdentityProof(payload: RequestGetIdentityProofPayload): Promise<any>;
  matchPrivateTransaction(
    payload: RequestMatchPrivateTransaction,
  ): Promise<boolean>;
  estimateTransferPostsCount(
    payload: RequestEstimateTransactionPayload,
  ): Promise<number>
  subscribeWalletState: (
    cb: (state: PrivateWalletStateInfo) => void | Promise<void>,
  ) => Unsubcall;
}
