import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * @description 扩展 `AxiosRequestConfig`, 使用时可以传递专属拦截器
 */
export interface JPRequestConfig<T = JPResponse, K = JPResponse> extends AxiosRequestConfig {
  /**
   * @description 拦截器
   */
  interceptors?: JPInterceptors<T, K>

  /**
   * @description 请求状态开始,是否展示loading
   */
  loading?: boolean
}

/**
 * @description 封装拦截器接口
 */
export interface JPInterceptors<T = JPResponse, K = JPResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: (res: T) => K
  responseInterceptorCatch?: (err: any) => any
}

/**
 * @description 将响应类型给外部使用
 */
export interface JPResponse<T = any> extends AxiosResponse<T, any> {}

/**
 * @description 判断拦截器的入参和出参
 */
export type Interceptor<T, K extends boolean = false> = K extends true ? JPResponse<T> : T

export class JPAxios<T = JPResponse> {
  instance: AxiosInstance
  interceptors?: JPInterceptors<JPResponse<T>, T>
  constructor(config?: JPRequestConfig<JPResponse<T>, T>) {
    this.instance = axios.create(config)
    this.interceptors = config?.interceptors

    // 定义的组件实例拦截器
    this.interceptors && this.use(this.interceptors as any)
  }

  request<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T> {
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

  get<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T> {
    return this.request({ ...config, method: 'PATCH' })
  }

  head<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T> {
    return this.request({ ...config, method: 'HEAD' })
  }

  options<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T> {
    return this.request({ ...config, method: 'OPTIONS' })
  }

  put<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T> {
    return this.request({ ...config, method: 'PUT' })
  }

  use<T = JPResponse, K extends boolean = false>(interceptors: JPInterceptors<Interceptor<T, K>, T>) {
    /**
     * Tips: 拦截器执行结构
     *    - Q:请求  S: 响应  F: 服务器
     *    - 如果对顺序要求,可以通过设置对应的拦截顺序进行修改,机制如下
     *    - Q1/S1 拦截器1
     *    - Q2/S2 拦截器2
     *    - Q3/S3 拦截器3
     *
     *         F         F  服务器响应
     *    Q1   ↑    S1   ↓
     *    Q2   ↑    S2   ↓
     *    Q3   ↑    S3   ↓
     * 浏览器发送
     */
    // 实例请求拦截器
    this.instance.interceptors.request.use(
      interceptors?.requestInterceptor,
      interceptors?.requestInterceptorCatch
    )
    // 实例响应拦截器
    this.instance.interceptors.response.use(
      interceptors?.responseInterceptor as any,
      interceptors?.responseInterceptorCatch
    )
  }
}

export default JPAxios
