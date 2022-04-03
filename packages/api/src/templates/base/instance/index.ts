import JPAxios from '@jp-liu/axios'
import type { JPRequestConfig, JPResponse } from '@jp-liu/axios'
import {
  requestInterceptor,
  requestInterceptorCatch,
  responseInterceptor,
  responseInterceptorCatch,
} from '../interceptor/interceptor'

/**
 * @description 导出实例
 */
export const instance = new JPAxios()

/**
 * @description 注册第一组拦截器
 */
instance.use({
  requestInterceptor,
  requestInterceptorCatch,
  responseInterceptor,
  responseInterceptorCatch,
})

/**
 * @description 导出实例通用请求方法
 */
export function request<T = JPResponse>(config: JPRequestConfig<T, T>) {
  // you can do something before request
  return instance.request<T>(config)
}
