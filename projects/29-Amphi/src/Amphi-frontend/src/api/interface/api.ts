import { stringify } from 'qs';
import { get, post } from '../axios';

/* 
    首页-Earn Bounties by Translating
    `/translation/list?params[orderByBounty]=${order}&pageNum=1&pageSize=10`
    "params[orderByBounty]":传1是top ，latest:latest时去掉这个参数
 */
/**
 *
 * @param {object} params    配置对象
 * @param {string} params.order   1 | undefined ; 1是top ，latest:latest时去掉这个参数
 * @returns {Promise}
 */
export const ranking = ({ order }: { order: '1' | '2' }) =>
    get(
        `/translation/list?${order === '1' ? 'params[orderByBounty]=1&' : ''}pageNum=1&pageSize=10`
    );

/**
 * 翻译者列表
 * url: /translator/list    请求地址
 * @param {object} params    配置对象
 * @param {string} params.language   语言
 * @param {number} params.pageNum    页码
 * @param {number} params.pageSize   每页多少条数据
 * @returns {Promise}
 */
export const getTranslatorList = (params: any = { pageNum: 1, pageSize: 10 }) =>
    get(`/translator/list?${stringify(params)}`);

/**
 * 翻译任务列表
 * url: /translation/list    请求地址
 * @param {object} params    配置对象
 * @param {array}  params.translationTypeArray 类型
 * @param {object} params.params 时间范围
 * @param {string} params.params.beginCreateTime 开始时间
 * @param {string} params.params.endCreateTime 结束时间
 * @param {number} params.pageNum    页码
 * @param {number} params.pageSize   每页多少条数据
 * @returns {Promise}
 */
export const getTranslationList = (params: any = { pageNum: 1, pageSize: 10 }) =>
    get(`/translation/list?${stringify(params)}`);

/**
 * 修改用户信息
 * url: /user/update    请求地址
 * @param {object} params    配置对象
 * @returns {Promise}
 */
export const updateUserInfo = (params: any) => post(`/user/update`, params);

/**
 * 获取用户信息
 * url: /user/info    请求地址
 * @param {object} params    配置对象
 * @param {string} params.address    钱包地址
 * @returns {Promise}
 */
export const getUserInfo = ({ address }: { address: string }) =>
    get(`/user/info?address=${address}`);

/**
 * 获取projects列表
 * url: /translation/acceptedList    请求地址
 * @param {object} params    配置对象
 * @param {string} params.address   钱包地址
 * @returns {Promise}
 */
export const getProjectList = ({ address }: { address: string }) =>
    get(`/translation/acceptedList?address=${address}&translationState=7`);

// `/ipfs/getJson?${uris.join('&')}`
export const getIpfsJson = ({ uris }: { uris: string[] }) => get(`/ipfs/getJson?${uris.join('&')}`);

// /badge/slot 徽章插槽
export const getBadgeSlot = ({ address }: { address: string }) =>
    get(`/badge/slot?address=${address}`);

// /badge/wear 佩戴和脱下徽章
// "address": "0x0b0746f6776536cf1fa1dd6c920ac982dafefd0e", --用户地址
// "wordsSbt": "0x31437867827384", --words工作量徽章sbt的tokenId,脱下时传""空串
export const wearBadge = (params: any) => post(`/badge/wear`, params);

// 21. /badge/isRemind 提醒完用户有新徽章后调用
export const isRemindBadge = (params: any) => post(`/badge/isRemind`, params);

// 20. /badge/list 获取拥有的徽章列表
// "address":"0x0b0746f6776536cf1fa1dd6c920ac982dafefd0e" --用户地址
// "isRemind": 0 --是否已提醒用户 查询是否需要弹窗时使用，
// 当有为0的记录时弹窗
export const getBadgeList = ({ address, isRemind }: { address: string; isRemind: number }) =>
    get(`/badge/list?address=${address}${isRemind === 0 ? '&isRemind=0' : ''}`);
