import { resolve } from 'path'
import { extend, pathIsExist } from './utils'
import type { GenerateConfig } from './types'
const cwd = process.cwd()

/**
 * @description 获取配置信息
 */
export function getGenerateModuleConfig(con: GenerateConfig): GenerateConfig {
  const defaultConfig: GenerateConfig = {
    input: '',
    output: '',
    spec: {} as any,
    url: '',
    useAxios: false,
    unwrapResponse: true,
    splitApi: true,
    overwrite: false
  }
  if (con)
    return extend(defaultConfig, con)

  // 1.获取包信息中的配置信息
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require(resolve(cwd, './package.json'))
  const pkgConfig = pkg['jp-api']

  // 2.判断是否提供特定配置信息
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jsConfigPath = resolve(cwd, './jp-api.config.js')
  const jsonConfigPath = resolve(cwd, './jp-api.config.json')
  let configFile
  if (pathIsExist(jsConfigPath))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
    configFile = require(jsConfigPath)
  else if (pathIsExist(jsonConfigPath))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
    configFile = require(jsonConfigPath)

  // 3.判断配置信息
  const config = configFile || pkgConfig || null
  if (!config)
    // no configuration
    throw new Error('No configuration information detected')

  return extend(defaultConfig, config)
}
