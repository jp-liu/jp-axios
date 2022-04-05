import { resolve } from 'path'
import type { ArrayInputOrOutputModel, EntryType, GenerateConfig, GenerateContext } from './types'

const cwd = process.cwd()
export function createGenerateContext(config: GenerateConfig, entryType: EntryType): GenerateContext {
  const context: GenerateContext = {
    rootPath: cwd,
    modulePath: '',
    entryType,
    config,
    templatePath: '',
    isArrayInput: Array.isArray(config.input) || Array.isArray(config.url),
    isArrayOutput: Array.isArray(config.output),
    ...config
  }

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
  const { isArrayInput, input, output } = context
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
  if (isArrayInput && !Array.isArray(out)) {
    out = (input as ArrayInputOrOutputModel[]).map(p => ({ dirName: p.dirName, path: resolve(out as string, `./${p.dirName}`) }))
    context.isArrayOutput = true
  }

  context.output = out
}

function handleModulePath(context: GenerateContext) {
  const { output, isArrayOutput } = context
  if (isArrayOutput)
    context.modulePath = (output as ArrayInputOrOutputModel[]).map(p => ({ dirName: p.dirName, path: resolve(p.path, './module') }))
  else
    context.modulePath = resolve(output as string, './module')
}

function handleTemplatePath(context: GenerateContext) {
  const isDebug = cwd.includes('/packages/api')
  const isNodeModules = !cwd.includes('/jp-axios') && isDebug
  context.templatePath = isDebug
    ? './templates/eta'
    : !isNodeModules
      ? './packages/api/templates/eta'
      : './node_modules/@jpliu/api/templates/eta'
}

function arrayInputOrOutput(inputOrOutput: string | ArrayInputOrOutputModel[]) {
  if (Array.isArray(inputOrOutput))
    return inputOrOutput.map(p => ({ dirName: p.dirName, path: p.path.includes(cwd) ? p.path : resolve(cwd, `./${p.path}`) }))
  else
    return resolve(cwd, inputOrOutput)
}
