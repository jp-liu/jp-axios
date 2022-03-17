import axios from 'axios'

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface JPRequestConfig extends AxiosRequestConfig {
  interceptors: JPInterceptors
}

export interface JPInterceptors {
  requestInterceptor?: (config: JPRequestConfig) => JPRequestConfig
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: <T = AxiosResponse>(res: T) => T
  responseInterceptorCatch?: (err: any) => any
}

export class JPAxios {
  instance: AxiosInstance
  interceptors: JPInterceptors | undefined
  constructor(config?: JPRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config?.interceptors
  }

  request<T>(config: JPRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      // 定义请求拦截器
      if (config.interceptors?.requestInterceptor)
        config = config.interceptors?.requestInterceptor(config)

      // 进行请求
      this.instance
        .request<any, T>(config)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
        .finally(() => {})
    })
  }

  get<T>(config: JPRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T>(config: JPRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T>(config: JPRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch<T>(config: JPRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export default JPAxios
