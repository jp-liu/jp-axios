import JPAxios from '@jp-axios/core'
import type { AxiosDefaults, AxiosInstance } from 'axios'
import type { Interceptor, JPInterceptors, JPRequestConfig, JPResponse } from '@jp-axios/core'

type Method = JPRequestConfig['method']

export interface UseHttp {
  <T = JPResponse>(url: string): Promise<T>
  <T = JPResponse, K extends boolean = false>(config: JPRequestConfig<Interceptor<T, K>, T>): Promise<T>
  <T = JPResponse, K extends boolean = false>(url: string, config?: Omit<JPRequestConfig<Interceptor<T, K>, T>, 'url'>): Promise<T>
  <T = JPResponse, K extends boolean = false>(url: string, method: Method, config?: Omit<JPRequestConfig<Interceptor<T, K>, T>, 'url'| 'method'>): Promise<T>
  instance: AxiosInstance
  defaults: AxiosDefaults
  request<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T>
  get<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T>
  post<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T>
  put<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T>
  delete<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T>
  head<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T>
  patch<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T>
  options<T = JPResponse>(config: JPRequestConfig<T, T>): Promise<T>
  use<T = JPResponse, K extends boolean = false>(interceptors: JPInterceptors<Interceptor<T, K>, T>): void
}

const jpAxiosInstance = new JPAxios()

export const useHttp: UseHttp = function useHttp<T>(
  urlOrConfig: any,
  methodOrConfig?: any,
  config?: any
): Promise<T> {
  const len = arguments.length
  if (len === 1) {
    if (typeof urlOrConfig === 'string')
      return jpAxiosInstance.request<T>({ url: urlOrConfig })

    return jpAxiosInstance.request<T>(urlOrConfig)
  }
  else if (len === 2) {
    return jpAxiosInstance.request<T>({
      url: urlOrConfig,
      ...(methodOrConfig as any),
    })
  }
  else {
    return jpAxiosInstance.request<T>({
      url: urlOrConfig,
      methodOrConfig,
      ...(config as any)
    })
  }
}

useHttp.instance = jpAxiosInstance.instance
useHttp.defaults = jpAxiosInstance.instance.defaults
useHttp.request = jpAxiosInstance.request.bind(jpAxiosInstance)
useHttp.get = jpAxiosInstance.get.bind(jpAxiosInstance)
useHttp.post = jpAxiosInstance.post.bind(jpAxiosInstance)
useHttp.put = jpAxiosInstance.put.bind(jpAxiosInstance)
useHttp.delete = jpAxiosInstance.delete.bind(jpAxiosInstance)
useHttp.head = jpAxiosInstance.head.bind(jpAxiosInstance)
useHttp.patch = jpAxiosInstance.patch.bind(jpAxiosInstance)
useHttp.options = jpAxiosInstance.options.bind(jpAxiosInstance)
useHttp.use = jpAxiosInstance.use.bind(jpAxiosInstance)

export default useHttp
