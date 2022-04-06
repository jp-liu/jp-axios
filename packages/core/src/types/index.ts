import type { AxiosRequestConfig, AxiosResponse } from 'axios'

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

  /**
   * @description 是否删除重复请求
   */
  removeRepeat?: boolean
}

/**
 * @description 封装拦截器接口
 */
export interface JPInterceptors<T = JPResponse, K = JPResponse> {
  requestInterceptor?: (config: JPRequestConfig<T, K>) => JPRequestConfig<T, K>
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
