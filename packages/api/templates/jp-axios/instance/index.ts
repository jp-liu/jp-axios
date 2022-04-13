import JPAxios from '@jp-axios/core'
import type { JPRequestConfig, JPResponse } from '@jp-axios/core'
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
