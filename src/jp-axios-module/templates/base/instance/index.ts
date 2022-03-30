import JPAxios from 'jp-axios'
import {
  requestInterceptor,
  requestInterceptorCatch,
  responseInterceptor,
  responseInterceptorCatch,
} from '../interceptor/interceptor'

export const enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded'
}

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
export const request = instance.request
