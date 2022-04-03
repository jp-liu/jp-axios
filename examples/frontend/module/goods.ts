import type { JPRequestConfig } from '@jp-liu/axios'
import { request } from '../service'
import type { GoodsInfo } from '../types/goods'

export default {
  getGoodsName(data: { id: string; name: string; price: number }, otherConfig: JPRequestConfig<GoodsInfo['response'], GoodsInfo['response']>) {
    return request<GoodsInfo['response']>({
      url: '/user/getUserInfo',
      method: 'GET',
      data,
      ...otherConfig
    })
  }
}
