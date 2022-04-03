import type { JPRequestConfig } from '@jp-liu/axios'
import type { RequestConfig } from '..'
import { useHttp } from '..'
import { request } from '../service'
import type { UserInfo } from '../types/user'

export default {
  getUserInfo(params: UserInfo['request'], otherConfig: RequestConfig<UserInfo['response']>) {
    return useHttp<UserInfo['response']>({
      url: '/user/getUserInfo',
      method: 'GET',
      params,
      ...otherConfig
    })
  },
  setUserInfo(data: { user: string; abc: string }, otherConfig: JPRequestConfig<UserInfo['response'], UserInfo['response']>) {
    return request<UserInfo['response']>({
      url: '/user/getUserInfo',
      method: 'GET',
      data,
      ...otherConfig
    })
  }
}
