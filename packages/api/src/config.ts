import { resolve } from 'path'
import { extend, pathIsExist } from './utils'
import type { GenerateConfig } from './types'
const cwd = process.cwd()

/**
 * @description 获取配置信息
 */
export function getGenerateModuleConfig(): GenerateConfig {
  const defaultConfig: GenerateConfig = {
    input: '',
    output: '',
    spec: {} as any,
    url: '',
    useAxios: false,
    splitApi: false,
    overwrite: false
  }
  // 1.获取包信息中的配置信息
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require(resolve(cwd, './package.json'))
  const pkgConfig = pkg['jp-api']

  // 2.判断是否提供特定配置信息
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jsConfigPath = resolve(cwd, './jp-api.config.js')
  const jsonConfigPath = resolve(cwd, './jp-api.config.json')
  let configfile
  if (pathIsExist(jsConfigPath))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
    configfile = require(jsConfigPath)
  else if (pathIsExist(jsonConfigPath))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
    configfile = require(jsonConfigPath)

  // 3.判断配置信息
  const config = configfile || pkgConfig || null
  if (!config)
    // no configuration
    throw new Error('No configuration information detected')

  return extend(defaultConfig, config)
}
