import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    console.log(data)
    data = await encryptedData(data)
    console.log(data)
  }
  return request({
    url: '/api/login/',
    method: 'post',
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/api/user/info/',
    method: 'post',
    data: {
      // [tokenName]: accessToken,
      token: accessToken,
      // username: 'blue',
      // password: 'deep-diary666',
    },
  })
}

export function getFace(params) {
  return request({
    url: '/api/face/' + params.id + '/',
    method: 'get',
    // params,
  })
}

export function getUserProfile(params, id) {
  return request({
    url: '/api/user/' + id + '/',
    method: 'get',
    // params,
  })
}

export function logout() {
  return request({
    url: '/api/user/logout/',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/api/register',
    method: 'post',
  })
}
