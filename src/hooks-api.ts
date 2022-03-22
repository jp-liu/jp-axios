import type { AxiosResponse } from 'axios'
import type { JPRequestConfig } from './jp-axios'
import { JPAxios } from './jp-axios'

const jpAxiosInstance = new JPAxios()

export function useHttp<T = AxiosResponse>(config: JPRequestConfig<T>) {
  return jpAxiosInstance.request<T>(config)
}
