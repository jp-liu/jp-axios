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
  constructor(config?: JPRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config?.interceptors

    // 定义的组件实例拦截器
    this.interceptors && this.use(this.interceptors)
  }

  request<T = AxiosResponse>(config: JPRequestConfig<T>): Promise<T> {
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

  get<T = AxiosResponse>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = AxiosResponse>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T = AxiosResponse>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch<T = AxiosResponse>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PATCH' })
  }

  head<T = AxiosResponse>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'HEAD' })
  }

  options<T = AxiosResponse>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'OPTIONS' })
  }

  put<T = AxiosResponse>(config: JPRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PUT' })
  }

  use(interceptors: JPInterceptors) {
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
      interceptors?.responseInterceptor,
      interceptors?.responseInterceptorCatch
    )
  }
}

export default JPAxios
