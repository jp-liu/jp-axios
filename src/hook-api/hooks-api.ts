
import type { AxiosInstance, AxiosResponse } from 'axios'
import { JPAxios } from '../jp-axios/jp-axios'
import type { Interceptor, JPRequestConfig } from '../jp-axios/jp-axios'

type Method = JPRequestConfig['method']

interface UseHttp {
  <T = AxiosResponse>(url: string): Promise<T>
  <T = AxiosResponse, K extends boolean = false>(config: JPRequestConfig<Interceptor<T, K>, T>): Promise<T>
  <T = AxiosResponse, K extends boolean = false>(url: string, config?: Omit<JPRequestConfig<Interceptor<T, K>, T>, 'url'>): Promise<T>
  <T = AxiosResponse, K extends boolean = false>(url: string, method: Method, config?: Omit<JPRequestConfig<Interceptor<T, K>, T>, 'url'| 'method'>): Promise<T>
  instance: AxiosInstance
  get: typeof jpAxiosInstance.get
  post: typeof jpAxiosInstance.post
  put: typeof jpAxiosInstance.put
  delete: typeof jpAxiosInstance.delete
  head: typeof jpAxiosInstance.head
  patch: typeof jpAxiosInstance.patch
  options: typeof jpAxiosInstance.options
  use: typeof jpAxiosInstance.use
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
useHttp.get = jpAxiosInstance.get.bind(jpAxiosInstance)
useHttp.post = jpAxiosInstance.post.bind(jpAxiosInstance)
useHttp.put = jpAxiosInstance.put.bind(jpAxiosInstance)
useHttp.delete = jpAxiosInstance.delete.bind(jpAxiosInstance)
useHttp.head = jpAxiosInstance.head.bind(jpAxiosInstance)
useHttp.patch = jpAxiosInstance.patch.bind(jpAxiosInstance)
useHttp.options = jpAxiosInstance.options.bind(jpAxiosInstance)
useHttp.use = jpAxiosInstance.use.bind(jpAxiosInstance)

export default useHttp
