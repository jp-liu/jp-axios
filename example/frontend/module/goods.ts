import { post } from '../service'
import type { GoodsInfo } from './../types/goods'

export default {
  getGoodsName: (data: GoodsInfo['request']) => {
    return post<GoodsInfo['response']>('/goods/info', data)
  }
}
