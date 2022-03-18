import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * @description 扩展 `AxiosRequestConfig`, 使用时可以传递专属拦截器
 */
export interface JPRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: JPInterceptors<T>
}

/**
 * @description 封装拦截器接口
 */
export interface JPInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (err: any) => any
}

export class JPAxios {
  instance: AxiosInstance
  interceptors?: JPInterceptors
  constructor(config: JPRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config.interceptors
  }

  request<T>(config: JPRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 定义请求拦截器
      if (config.interceptors?.requestInterceptor)
        config = config.interceptors?.requestInterceptor(config)

      // 进行请求
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 定义接口响应拦截器
          if (config.interceptors?.responseInterceptor)
            res = config.interceptors?.responseInterceptor(res)

          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get<T>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch<T>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PATCH' })
  }

  head<T>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'HEAD' })
  }

  options<T>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'OPTIONS' })
  }

  put<T>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PUT' })
  }
}

export default JPAxios
