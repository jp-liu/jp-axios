import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import {
  requestInterceptor,
  requestInterceptorCatch,
  responseInterceptor,
  responseInterceptorCatch,
} from '../interceptor/interceptor'

/**
 * @description 导出实例
 * 可以提供你自己的 `config`
 */
export const instance = axios.create()

/**
 * @description 注册第一组拦截器
 */
instance.interceptors.request.use(requestInterceptor, requestInterceptorCatch)
instance.interceptors.response.use(responseInterceptor, responseInterceptorCatch)

/**
 * @description 导出实例通用请求方法
 */
export function request<T>(config: AxiosRequestConfig) {
  // you can do something before request
  return instance.request<T>(config).then(res => res.data)
}
