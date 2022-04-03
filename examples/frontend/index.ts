import type { AxiosResponse } from 'axios'
import type { JPRequestConfig } from '@jp-liu/jp-axios'
import { useHttp as httpClient } from '../../src'
import type { UseHttp } from '../../src/hook-api/hooks-api'

import user from './module/user'
import goods from './module/goods'
export { useHttp } from '../../src'

const modules = {
  user,
  goods
}

type Get<T, K> = K extends `${infer A}/${infer B}` ? A extends keyof T ? Get<T[A], B> : never : K extends keyof T ? T[K] : never

type GenNode<K extends string | number, IsRoot extends boolean> = IsRoot extends true ? `${K}`: `/${K}` | (K extends number ? `[${K}]` | `/[${K}]` : never)

type GetParams<T extends Function> = T extends (...args: infer A) => any ? A : never

type ObjectKeyPaths<
  T extends object,
  IsRoot extends boolean = true,
  K extends keyof T = keyof T
> =
K extends string | number ?
  GenNode<K, IsRoot> | (T[K] extends object ? `${GenNode<K, IsRoot>}${ObjectKeyPaths<T[K], false>}` : never)
  :never

type Modules = typeof modules
type ModuleKeys = keyof Modules
type AllModulePath = ObjectKeyPaths<Modules>
type ModuleFnPath = Exclude<AllModulePath, ModuleKeys>

type RequestFn<T extends ModuleFnPath> = Get<Modules, T>
export type RequestConfig<T = AxiosResponse> = Omit<JPRequestConfig<T, T>, 'url' | 'method' | 'data' | 'params'>
type RequestParams<T extends ModuleFnPath> = Get<Modules, T> extends Function ? GetParams<Get<Modules, T>>[0] : never

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UseHttpForModule extends UseHttp {
  <T extends ModuleFnPath>(module: T, moduleParams: RequestParams<T> | null, config: RequestConfig<ReturnType<RequestFn<T>>>): ReturnType<RequestFn<T>>
}

function useHttp<T extends ModuleFnPath>(module: T, moduleParams: RequestParams<T> | null, config: RequestConfig<ReturnType<RequestFn<T>>>): ReturnType<RequestFn<T>> {
  type Module<K> = K extends `${infer A}/${infer B}` ? A extends ModuleKeys ? Module<B> : never : K extends ModuleKeys ? Modules[K] : never
  const modulePath = module.split('/')
  if (modulePath.length === 1)
    throw new Error('请输入正确的方法路径')

  const moduleName = modulePath[0] as ModuleKeys
  const moduleFnName = modulePath.slice(1).join('/') as Module<T>

  const requestRequest = modules[moduleName][moduleFnName] as RequestFn<T>
  return requestRequest(moduleParams as any, config as any) as ReturnType<RequestFn<T>>
}

useHttp.instance = httpClient.instance
useHttp.defaults = httpClient.instance.defaults
useHttp.request = httpClient.request
useHttp.get = httpClient.get
useHttp.post = httpClient.post
useHttp.put = httpClient.put
useHttp.delete = httpClient.delete
useHttp.head = httpClient.head
useHttp.patch = httpClient.patch
useHttp.options = httpClient.options
useHttp.use = httpClient.use

useHttp('goods/getGoodsName', { id: '123', name: '小明', price: 123 }, {
  interceptors: {
    requestInterceptor(config) {
      return config
    },
    responseInterceptor(res) {
      return res
    }
  }
})

export default modules
