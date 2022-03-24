import type { AxiosRequestConfig } from 'axios'
import JPAxios from '../../src'

export const instance = new JPAxios({
  interceptors: {
    requestInterceptor(config) {
      if (config.method === 'GET')
        config.params.t = Date.now()

      return config
    },
    responseInterceptor(res) {
      if (res.data.code !== 200) {
        // 错误处理
        console.log('错误', res.data.message)
      }
      return res.data
    }
  }
})

export const get = <T>(url: string, params: AxiosRequestConfig['params']) => instance.get<T>({ url, params })
export const post = <T>(url: string, params: AxiosRequestConfig['data']) => instance.post<T>({ url, params })
