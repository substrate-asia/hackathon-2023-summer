export default interface ITranslator {
    [key: string]: any;
    id: number;
    userId: number;
    username: string;
    address: string;
    profile: any;
    languages: null | any[];
    orders: number;
    score: number;
    latestAcceptTime: string;
}
