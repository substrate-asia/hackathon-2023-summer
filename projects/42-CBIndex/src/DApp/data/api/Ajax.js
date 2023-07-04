import axios from 'axios'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, Button } from 'antd'
import { FormattedMessage } from 'react-intl'
const Axios = axios.create({
  baseURL: 'https://dapp.cbindex.finance/api',
  timeout: 36000,
})

Axios.interceptors.response.use((response) => {
  // ;
  const { data } = response
  // if (response.status === 200) {
  //   return response.status;
  // }
  if (data.code != 403) {
    return data
    // return { data, code: response.status };
  }
})

/**
 * 异步请求方法
 * @param {string | {url: string, data: any, params: any, method: 'POST' | 'GET' | 'PUT' | 'DELETE'}} req 请求参数
 */
function Ajax(req) {
  if (typeof req === 'string') {
    req = {
      url: req,
    }
  }
  return new Promise((resolve) => {
    Axios.request({
      url: req.url,
      method: req.method || 'GET',
      data: req.data || {},
    })
      .then((d) => {
        resolve(d)
      })
      .catch((e) => {
        resolve(e)
      })
  })
}

export default Ajax
