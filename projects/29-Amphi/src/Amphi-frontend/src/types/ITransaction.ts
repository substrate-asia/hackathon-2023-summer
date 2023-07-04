export default interface ITransaction {
    id: number;
    title: string;
    sourceLang: string;
    targetLang: string;
    acceptAddress: string;
    bounty: number;
    buyerAddress: string;
    createTime: string;
    deadline: string;
    tcount: number;
    tmax: number;
    translationCharacter: string;
    translationIndex: number;
    translationState: number;
    translationStateArray: any;
    translationType: string;
    workload: number;
    workloadType: number;
}
