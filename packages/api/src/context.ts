import { resolve } from 'path'
import type { ArrayInputOrOutputModel, EntryType, GenerateConfig, GenerateContext } from './types'
import { isWin } from './utils'

const cwd = process.cwd()
export function createGenerateContext(config: GenerateConfig, entryType: EntryType): GenerateContext {
  const context: GenerateContext = {
    rootPath: cwd,
    env: 'dev',
    config,
    isWin: isWin(),
    entryType,
    modulePath: '',
    templatePath: '',
    isArrayInput: Array.isArray(config.input) || Array.isArray(config.url),
    isArrayOutput: Array.isArray(config.output),
    ...config
  }
  handleEnv(context)
  handleEntry(context)
  handleOutput(context)
  handleModulePath(context)
  handleTemplatePath(context)

  return context
}

function handleEntry(context: GenerateContext) {
  const { input, url, entryType } = context
  if (entryType === 'input')
    context.input = arrayInputOrOutput(input)

  if (entryType === 'url')
    context.url = arrayInputOrOutput(url)
}

function handleOutput(context: GenerateContext) {
  const { isArrayInput, input, output, splitApi } = context
  let out = arrayInputOrOutput(output)
  const isArr = Array.isArray(out)
  if (isArr && !isArrayInput)
    throw new Error('single entry can not output multiple modules')

  /**
   * + output
   *   + dirName1
   *     + module
   *     + instance
   *     + ...
   *
   *   + dirName2
   *     + module
   *     + instance
   *     + ...
   */
  if (splitApi) {
    if (isArrayInput && !Array.isArray(out)) {
      out = (input as ArrayInputOrOutputModel[]).map(p => ({ dirName: p.dirName, path: resolve(out as string, `./${p.dirName}`) }))
      context.isArrayOutput = true
    }
  }

  context.output = out
}

function handleModulePath(context: GenerateContext) {
  const { output, isArrayOutput, splitApi } = context
  if (splitApi && isArrayOutput)
    context.modulePath = (output as ArrayInputOrOutputModel[]).map(p => ({ dirName: p.dirName, path: resolve(p.path, './module') }))
  else
    context.modulePath = resolve(output as string, './module')
}

function handleTemplatePath(context: GenerateContext) {
  const { env } = context
  const paths = {
    debug: './templates/eta',
    dev: './packages/api/templates/eta',
    npm: './node_modules/@jp-axios/api/templates/eta' // TODO: 寻址,全局安装,或者`monorepo`
  }

  context.templatePath = paths[env]
}

function arrayInputOrOutput(inputOrOutput: string | ArrayInputOrOutputModel[]) {
  if (Array.isArray(inputOrOutput))
    return inputOrOutput.map(p => ({ dirName: p.dirName, path: p.path.includes(cwd) ? p.path : resolve(cwd, `./${p.path}`) }))
  else
    return resolve(cwd, inputOrOutput)
}

function handleEnv(context: GenerateContext) {
  const { isWin } = context
  const debugPath = isWin ? '\\packages\\api' : '/packages/api'
  const devPath = isWin ? '\\jp-axios' : '/jp-axios'
  // 1./Users/xxx/project/jp-axios/packages/api  => 调试断点
  // 2./Users/xxx/project/jp-axios               => 开发调试
  // 3./Users/xxx/project                        => 被`npm`调用(TODO: `template` 寻址)
  const isDebug = cwd.includes(debugPath)
  const isDev = cwd.includes(devPath)
  context.env = isDebug ? 'debug' : isDev ? 'dev' : 'npm'
}
