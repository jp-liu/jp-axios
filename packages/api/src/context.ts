import { resolve } from 'path'
import type { ArrayInputOrOutputModel, EntryType, GenerateConfig, GenerateContext } from './types'
import { isWin } from './utils'

const cwd = process.cwd()
export function createGenerateContext(config: GenerateConfig, entryType: EntryType): GenerateContext {
  const context: GenerateContext = {
    rootPath: cwd,
    config,
    isWin: isWin(),
    entryType,
    modulePath: '',
    templatesPath: resolve(__dirname, '../templates'),
    etaPath: resolve(__dirname, '../templates/eta'),
    isArrayInput: Array.isArray(config.input) || Array.isArray(config.url),
    isArrayOutput: Array.isArray(config.output),
    ...config
  }
  handleEntry(context)
  handleOutput(context)
  handleModulePath(context)

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

function arrayInputOrOutput(inputOrOutput: string | ArrayInputOrOutputModel[]) {
  if (Array.isArray(inputOrOutput))
    return inputOrOutput.map(p => ({ dirName: p.dirName, path: p.path.includes(cwd) ? p.path : resolve(cwd, `./${p.path}`) }))
  else
    return resolve(cwd, inputOrOutput)
}
