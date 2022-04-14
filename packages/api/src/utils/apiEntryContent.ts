import type { GenerateContext } from '../types'

export function apiEntryContent(context: GenerateContext) {
  const { useAxios } = context
  const content
    = `${useAxios ? 'import type { AxiosRequestConfig } from "axios"' : 'import type { JPRequestConfig, JPResponse } from "@jp-axios/core";'}
import type { Get, GetParams, ObjectKeyPaths } from '../types/utils';

type Modules = typeof modules
type ModuleKeys = keyof Modules
type AllModulePath = ObjectKeyPaths<Modules>
type ModuleFnPath = Exclude<AllModulePath, ModuleKeys>
type RequestFn<T extends ModuleFnPath> = Get<Modules, T>
${useAxios ? 'export type RequestConfig = Omit<AxiosRequestConfig, \'url\' | \'method\' | \'data\' | \'params\'>' : 'export type RequestConfig<T = JPResponse> = Omit<JPRequestConfig<T, T>, \'url\' | \'method\' | \'data\' | \'params\'>'}
type RequestParams<T extends ModuleFnPath> = Get<Modules, T> extends Function ? GetParams<Get<Modules, T>>[0] : never

export function useModule<T extends ModuleFnPath>(
  module: T,
  moduleParams: RequestParams<T> | null,
  ${useAxios ? 'config?: RequestConfig' : 'config?: RequestConfig<ReturnType<RequestFn<T>>>'}
): ReturnType<RequestFn<T>> {
  type Module<K> = K extends \`\${infer A}/\${infer B}\` ? A extends ModuleKeys ? Module<B> : never : K extends ModuleKeys ? Modules[K] : never
  const modulePath = module.split("/")

  if (modulePath.length === 1)
    throw new Error(\'请输入正确的方法路径\')

  const moduleName = modulePath[0] as ModuleKeys
  const moduleFnName = modulePath[1] as Module<T>
  const moduleFnParams = moduleParams || {}
  const moduleFnConfig = config || {}
  const request = modules[moduleName][moduleFnName] as RequestFn<T>
  return request(moduleFnParams as any, moduleFnConfig as any) as ReturnType<RequestFn<T>>
}

export default modules`
  return content
}
