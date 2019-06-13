/*
 * @Description: 文件描述
 * @Author: yb001
 * @Date: 2019-06-10 10:58:38
 * @LastEditTime: 2019-06-13 11:12:43
 * @LastEditors: yb001
 */
import axios from "./axios"

export const globalApi = {
  base: "https://api.it120.cc"
}

const instance = (config = {}) => {
  return axios.create({
    base: globalApi.base,
    ...config
  })
}

/**
 * 返回拦截器
 */
axios.interceptors.response.use(
  response => {
    if (response.statusCode != 200) {
      return Promise.reject(response)
    } else {
      return response.data
    }
  },
  err => {
    return Promise.reject(err)
  }
)

export function request(options) {
  const { baseConfig, url, method, data } = options
  // try {
  //   const res = await instance(baseConfig).request({
  //     url,
  //     method: method || "GET",
  //     data
  //   })
  //   options.success && options.success(res)
  // } catch (err) {
  //   options.error && options.error(err)
  // }
  instance(baseConfig)
    .request({
      url,
      method: method || "GET",
      data
    })
    .then(res => {
      options.success && options.success(res)
    })
    .catch(err => {
      options.error && options.error(err)
    })
}

export function httpGet(options) {
  request({
    method: "GET",
    ...options
  })
}

export function httpPost(options) {
  request({
    method: "POST",
    ...options
  })
}
