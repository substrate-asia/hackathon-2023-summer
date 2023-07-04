import { message } from 'antd';
import { AMPHI_USERTOKEN } from '@/constants/storageKeys';
import storage from '@/utils/storage';
import axios from 'axios';

axios.defaults.timeout = 100000;
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
// if (typeof window !== 'undefined') {
//     const accessToken = storage.getLocalStorage(AMPHI_USERTOKEN);
//     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
//     accessToken && (axios.defaults.headers.common.token = `${accessToken}`);
// }
/**
 * http request 拦截器
 */
axios.interceptors.request.use(
    config => {
        const accessToken = storage.getLocalStorage(AMPHI_USERTOKEN);
        if (config.url === '/nonce' || config.url === '/file/createGetUrl') return config;
        config.data = JSON.stringify(config.data);
        config.headers.set('Content-Type', 'application/json');
        config.headers.set('token', `${accessToken}`);
        return config;
    },
    error => Promise.reject(error)
);

/**
 * http response 拦截器
 */
axios.interceptors.response.use(
    response => {
        if (response.data?.status === 500 && response.data?.message?.includes('JWT')) {
            message.warning('Please Login');
        }
        return response;
    },
    error => {
        // eslint-disable-next-line no-console
        console.log('请求出错：', error);
    }
);

// 失败提示
function errorMsg(err: any) {
    if (err && err.response) {
        console.log(err.response);
        switch (err.response.status) {
            case 400:
                // eslint-disable-next-line no-alert
                alert(err.response.data.error.details);
                break;
            case 401:
                // eslint-disable-next-line no-alert
                alert('未授权，请登录');
                break;

            case 403:
                // eslint-disable-next-line no-alert
                alert('拒绝访问');
                break;

            case 404:
                // eslint-disable-next-line no-alert
                alert('请求地址出错');
                break;

            case 408:
                // eslint-disable-next-line no-alert
                alert('请求超时');
                break;

            case 500:
                // eslint-disable-next-line no-alert
                // alert('服务器内部错误');
                // message.error('服务器内部错误');

                break;

            case 501:
                // eslint-disable-next-line no-alert
                alert('服务未实现');
                break;

            case 502:
                // eslint-disable-next-line no-alert
                alert('网关错误');
                break;

            case 503:
                // eslint-disable-next-line no-alert
                alert('服务不可用');
                break;

            case 504:
                // eslint-disable-next-line no-alert
                alert('网关超时');
                break;

            case 505:
                // eslint-disable-next-line no-alert
                alert('HTTP版本不受支持');
                break;
            default:
        }
    }
}

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */

export const get = (url: string, params = {}) =>
    new Promise((resolve, reject) => {
        axios
            .get(url, { params })
            .then(res => {
                resolve(res?.data);
            })
            .catch(err => {
                errorMsg(err);
                reject(err);
            });
    });
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export const post = (url: string, data: any) =>
    new Promise((resolve, reject) => {
        axios
            .post(url, data)
            .then(res => {
                // console.log('put axios', res);
                // 关闭进度条
                resolve(res?.data);
            })
            .catch(err => {
                errorMsg(err);
                reject(err);
            });
    });

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export const put = (url: string, data: any) =>
    new Promise((resolve, reject) => {
        axios.put(url, data).then(
            response => {
                resolve(response?.data);
            },
            err => {
                errorMsg(err);
                reject(err);
            }
        );
    });

export const refreshAPIToken = () => {
    if (typeof window !== 'undefined') {
        const accessToken = storage.getLocalStorage(AMPHI_USERTOKEN);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        accessToken && (axios.defaults.headers.common.token = `${accessToken}`);
    }
};

export default axios;
