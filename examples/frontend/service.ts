// import type { AxiosRequestConfig } from 'axios'
import JPAxios from '@jp-liu/axios'

export const instance = new JPAxios<{ code: number; data: any; message: string }>({
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
export const request = instance.request
