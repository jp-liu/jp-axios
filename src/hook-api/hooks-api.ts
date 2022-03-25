
import type { AxiosInstance, AxiosResponse } from 'axios'
import { JPAxios } from '../jp-axios/jp-axios'
import type { JPInterceptors, JPRequestConfig } from '../jp-axios/jp-axios'

type Method = JPRequestConfig['method']

interface UseHttp {
  <T = AxiosResponse>(config: JPRequestConfig<T>): Promise<T>
  <T = AxiosResponse>(url: string, config?: Omit<JPRequestConfig, 'url'>): Promise<T>
  <T = AxiosResponse>(url: string, method: Method, config?: Omit<JPRequestConfig, 'url'| 'method'>): Promise<T>
  instance: AxiosInstance
  get<U>(config: JPRequestConfig<U>): Promise<U>
  post<U>(config: JPRequestConfig<U>): Promise<U>
  put<U>(config: JPRequestConfig<U>): Promise<U>
  delete<U>(config: JPRequestConfig<U>): Promise<U>
  head<U>(config: JPRequestConfig<U>): Promise<U>
  patch<U>(config: JPRequestConfig<U>): Promise<U>
  options<U>(config: JPRequestConfig<U>): Promise<U>
  use(interceptors: JPInterceptors): void
}

const jpAxiosInstance = new JPAxios()

export const useHttp: UseHttp = function us<T>(
  urlOrConfig: any,
  methodOrConfig?: any,
  config?: any
): Promise<T> {
  const len = arguments.length
  if (len === 1) {
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
useHttp.get = jpAxiosInstance.get.bind(jpAxiosInstance)
useHttp.post = jpAxiosInstance.post.bind(jpAxiosInstance)
useHttp.put = jpAxiosInstance.put.bind(jpAxiosInstance)
useHttp.delete = jpAxiosInstance.delete.bind(jpAxiosInstance)
useHttp.head = jpAxiosInstance.head.bind(jpAxiosInstance)
useHttp.patch = jpAxiosInstance.patch.bind(jpAxiosInstance)
useHttp.options = jpAxiosInstance.options.bind(jpAxiosInstance)
useHttp.use = jpAxiosInstance.use.bind(jpAxiosInstance)

export default useHttp
