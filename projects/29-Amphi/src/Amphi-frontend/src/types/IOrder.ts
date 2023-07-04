import type { TTokenId } from './ISBT';

export default interface IOrder {
    acceptAddress: string;
    bounty: number;
    buyerAddress: string;
    // 翻译者信息， 当translationState != 0 时会有这个返回值
    translator?: {
        username: string;
        address: string;
        profile: string; // 头像
        badgeSlot: {
            id: number;
            address: string;
            wordsSbt: TTokenId; // sbt tokenId
        };
    };
    createTime: string;
    deadline: string;
    id: number;
    params: any;
    remark: string;
    sourceLang: string;
    targetLang: string;
    tcount: number;
    title: string;
    instruction: string;
    tmax: number;
    translationCharacter: string;
    translationIndex: number;
    translationState: number;
    translationStateArray: string[];
    translationType: string;
    updateTime: string;
    userAcceptFiles: any;
    vcount: number;
    vmax: number;
    workload: number;
    workloadType: number;
}
