export interface ILanguage {
    [key: string]: any;
    id?: number;
    userId: number;
    // createTime: null | string;
    // updateTime: null | string;
    // remark: null | string;
    // params: any;
    nativeLang?: string;
    // nativeLangValue: string;
    workLang: string;
    workLangValue: string;
    certification: string;
    // certificationUrl: string;
}

export default interface IUserInfo {
    [key: string]: any;
    id: number;
    address?: string;
    username?: string;
    profile?: string;
    backgroundUrl?: string;
    email?: string;
    languageList?: ILanguage[];
    industry?: string;
    jobFunction?: string;

    // createTime?: null | string;
    // updateTime?: null | string;
    // remark?: null | string;
    // params?: any;
    // workload?: number;
    // workloadType?: number;
    // socialMediaList?: any[];
    // introduction?: string;
    // themeColor?: string;
    // expireTime?: null | string;
}
