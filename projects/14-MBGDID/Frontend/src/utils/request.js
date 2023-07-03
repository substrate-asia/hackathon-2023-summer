import Vue from 'vue'
import axios from 'axios'
import {
  baseURL,
  contentType,
  debounce,
  invalidCode,
  noPermissionCode,
  requestTimeout,
  successCode,
  tokenName,
  loginInterception,
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'
import { isArray } from '@/utils/validate'

let loadingInstance

/**
 * @author https://gitee.com/chu1204505056/vue-admin-better （不想保留author可删除）
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  console.log('this is code:%d， masg: %s', code, msg)
  switch (code) {
    case invalidCode:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
      store.dispatch('user/resetAccessToken').catch(() => {})
      if (loginInterception) {
        location.reload()
      }
      break
    case noPermissionCode:
      router.push({ path: '/401' }).catch(() => {})
      break
    default:
      console.log('this is handleCode')
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
      break
  }
}

const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
})

instance.interceptors.request.use(
  (config) => {
    // console.log('here is interceptors.request %o', config)
    if (store.getters['user/accessToken']) {
      // config.headers[tokenName] = store.getters['user/accessToken'] // 增加这句话，就会报Request header field access is not allowed by Access-Control-Allow-Headers in preflight response
      config.headers['Authorization'] =
        'Bearer ' + store.getters['user/accessToken'] // 参考postman 请求头信息, 这里的Bearer后面需要带一个空格
    }
    // console.log('here is interceptors.request %o', config)
    //这里会过滤所有为空、0、false的key，如果不需要请自行注释
    if (config.data) {
      // console.log('config data is null %o', config)
      config.data = Vue.prototype.$baseLodash.pickBy(
        config.data,
        Vue.prototype.$baseLodash.identity
      )
    }

    if (
      config.data &&
      config.headers['Content-Type'] ===
        'application/x-www-form-urlencoded;charset=UTF-8'
    ) {
      // console.log('this is the second condition %o', config)
      config.data = qs.stringify(config.data)
      // console.log(' after stringify %o', config)
    }

    if (debounce.some((item) => config.url.includes(item))) {
      // console.log('this is the third condition %o', config)
      loadingInstance = Vue.prototype.$baseLoading()
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    // console.log('actually, the frontend got the response data, %o', response)
    if (loadingInstance) loadingInstance.close()

    const { data, config } = response
    const { code, msg } = data
    // 操作正常Code数组
    const codeVerificationArray = isArray(successCode)
      ? [...successCode]
      : [...[successCode]]
    // 是否操作正常
    if (codeVerificationArray.includes(code)) {
      return data
    } else {
      handleCode(code, msg)
      return Promise.reject(
        'vue-admin-beautiful请求异常拦截:' +
          JSON.stringify({ url: config.url, code, msg }) || 'Error'
      )
    }
  },
  (error) => {
    if (loadingInstance) loadingInstance.close()
    const { response, message } = error
    if (error.response && error.response.data) {
      const { status, data } = response
      handleCode(status, data.msg || message)
      return Promise.reject(error)
    } else {
      let { message } = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
        console.log('this is Network Error')
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时'
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3)
        message = '后端接口' + code + '异常'
        console.log('this is Request failed with status code')
      }
      Vue.prototype.$baseMessage(message || `后端接口未知异常`, 'error')
      return Promise.reject(error)
    }
  }
)

export default instance
