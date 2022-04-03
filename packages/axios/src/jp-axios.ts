import axios from 'axios'
import type { AxiosError, AxiosInstance, Canceler } from 'axios'
import type { Interceptor, JPInterceptors, JPRequestConfig, JPResponse } from './types'

export default class JPAxios<T = JPResponse> {
  instance: AxiosInstance
  removeRepeat: boolean
  private abortControllers = new Map<string, Canceler>()
  constructor(config?: JPRequestConfig<JPResponse<T>, T>) {
    this.instance = axios.create(config)
    this.removeRepeat = !!config?.removeRepeat

    if (this.removeRepeat) {
      const requestInterceptor = (config: JPRequestConfig) => {
        this.removePending(config)
        this.addPending(config)
        return config
      }

      const responseInterceptor = (response: JPResponse) => {
        this.removePending(response.config)
        return response
      }

      const responseInterceptorCatch = (error: AxiosError) => {
        error.config && this.removePending(error.config)
        return Promise.reject(error)
      }
      this.use({ requestInterceptor, responseInterceptor, responseInterceptorCatch })
    }

    // 定义的组件实例拦截器
    config?.interceptors && this.use(config?.interceptors as any)
  }

  request<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 定义请求拦截器
      if (config.interceptors?.requestInterceptor)
        config = config.interceptors?.requestInterceptor(config)

      // 单接口开启取消重复请求,如果全局开启了,则不处理
      if (config.removeRepeat && !this.removeRepeat) {
        this.removePending(config as any)
        this.addPending(config as any)
      }

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
        .finally(() => {
          if (config.removeRepeat && !this.removeRepeat)
            this.removePending(config as any)
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

  /** ******* 根据配置提供是否删除重复请求  **********/
  /**
   * 生成每个请求唯一的键
   */
  private getPendingKey(config: JPRequestConfig): string {
    let { data } = config
    const { url, method, params } = config
    if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  /**
   * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
   */
  private addPending(config: JPRequestConfig) {
    const pendingKey = this.getPendingKey(config)
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
      if (!this.abortControllers.has(pendingKey))
        this.abortControllers.set(pendingKey, cancel)
    })
  }

  /**
   * 删除重复的请求
   */
  private removePending(config: JPRequestConfig) {
    const pendingKey = this.getPendingKey(config)
    if (this.abortControllers.has(pendingKey)) {
      const cancelToken = this.abortControllers.get(pendingKey)
      cancelToken!(pendingKey)
      this.abortControllers.delete(pendingKey)
    }
  }
}
