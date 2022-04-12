import type { JPRequestConfig, JPResponse } from '@jp-axios/core'

import { handlerError } from '../error/error'

/**
 * @description 请求成功拦截器
 * @tips 可以配置全局请求状态, 如`nprogress`设置请求进度条 | `loading`设置请求加载动画
 */
export function requestInterceptor(config: JPRequestConfig): JPRequestConfig {
  // if (config.loading) GlobalLoading.start()
  return config
}

/**
 * @description 请求发送失败拦截器(取消请求)
 */
export function requestInterceptorCatch(err: any): any {
  return err
}

/**
 * @description 响应成功拦截器
 * @generic T 第一组响应拦截器的出参类型,可以在这里控制全局接口响应处理,如有需要,要自己更改,如:
 *  - responseInterceptor<{ code: number, data: any, success: boolean }>
 *  - responseInterceptor<{ code: 200 | 302 | 404, data: any, success: boolean }>
 */
export function responseInterceptor<T>(response: JPResponse<T>): T | JPResponse {
  // if (GlobalLoading.isStart) GlobalLoading.done()
  // if (response.data.code !== 200) handlerError(response.data, 'success')

  // 1.解包,返回接口实体数据,不用`axios`包装的类型
  // 2.个别接口需要包装,返回`axios`包装的类型,可以通过在`config`中设置开关
  return response.data
}

/**
 * @description 接口失败
 */
export function responseInterceptorCatch(err: any): any {
  // if (GlobalLoading.isStart) GlobalLoading.done()
  handlerError(err, 'error')
  return err
}
