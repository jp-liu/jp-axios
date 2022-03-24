import { get } from '../service'
import type { UserInfo } from './../types/user'

export default {
  getUserInfo: (params: UserInfo['request']) => get<UserInfo['response']>('http://localhost:3000/user/info', params)
}
