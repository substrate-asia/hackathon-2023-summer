export type TTokenId = number;

export interface IBadgeItem {
    createTime: string; // 徽章创建时间
    id: number;
    tokenId: TTokenId; // sbt的tokenId
    address: string; // 用户地址
    sbtRanking: number; // 获得徽章的排名
    isRemind: number; // 是否已提醒用户, 当有为0的记录时是需要提醒的记录（弹窗）
}

export interface ISlotItem {
    id: number;
    address: string;
    wordsSbt: TTokenId; // wordsSbt为null或者空串时，代表没有佩戴对应类型的徽章
}

export interface ITokenURI {
    workload: string;
    level: number;
    tokenId: TTokenId;
    cessPNGPid: string;
    name: string;
}
