import { cpus } from 'os'
import { generateApi } from 'swagger-typescript-api'
import { createGenerateContext } from './context'
import { createApiEntry, getEntryType, removeHeadComment, renameApiFile, renderBaseTemplate, runParallel, wrapResponse } from './utils'

import type { ArrayInputOrOutputModel, GenerateConfig, GenerateContext, GenerateOutput } from './types'

export function generateModule(config: Omit<GenerateConfig, 'input' | 'url'>): void
export function generateModule(config: Omit<GenerateConfig, 'input' | 'spec'>): void
export function generateModule(config: Omit<GenerateConfig, 'url' | 'spec'>): void
export function generateModule(config: any): void {
  const { output } = config
  if (!output) throw new Error('output must be provided')

  const entryType = getEntryType(config)
  const context = createGenerateContext(config, entryType)

  const { splitApi } = context
  const result: [string, string, string, string, GenerateContext][] = []

  // 多入口 TODO 最多可同步执行任务数量
  if (context.isArrayInput) {
    const entryPaths = context[entryType] as ArrayInputOrOutputModel[]
    const outputPaths = context.output as ArrayInputOrOutputModel[]
    const modulePaths = context.modulePath as ArrayInputOrOutputModel[]
    for (let i = 0; i < entryPaths.length; i++) {
      const entry = entryPaths[i]
      let output, module
      if (splitApi) {
        output = outputPaths.find(out => out.dirName === entry.dirName)!.path
        module = modulePaths.find(mod => mod.dirName === entry.dirName)!.path
      }
      else {
        output = context.output as string
        module = context.modulePath as string
      }
      context.splitApi && renderBaseTemplate(output, context)
      result.push([entry.path, module, output, entry.dirName, context])
    }
    // 多入口不拆包,则只需要一份出口
    !context.splitApi && renderBaseTemplate(output, context)
  }
  else {
    // 单入口
    renderBaseTemplate(context.output as string, context)
    result.push([
      context[entryType] as string,
      context.modulePath as string,
      context.output as string,
      'schema',
      context
    ])
  }

  runParallel<GenerateOutput>(cpus().length, result, generateModuleApi)
    .then(finishProcess.bind(null, context))
}

function generateModuleApi(entryPath: string, modulePath: string, output: string, filename: string, context: GenerateContext) {
  const { templatePath, entryType, useAxios, splitApi } = context

  return generateApi({
    name: filename,
    modular: splitApi,
    [entryType as 'input']: entryPath,
    output: modulePath,
    extractRequestParams: true,
    // because this script was called from package.json folder
    templates: templatePath,
    httpClientType: useAxios ? 'axios' : 'fetch'
  }).then((res) => {
    return { ...res, modulePath, output, splitApi }
  })
}

function finishProcess(context: GenerateContext, outInfo: GenerateOutput[]) {
  const { splitApi } = context
  if (splitApi) {
    outInfo.forEach((item) => {
      // 1.去除头部注释
      removeHeadComment(item.modulePath)
      // 2.重命名`api`文件,使其更具语义化
      renameApiFile(item.output, context)
      // 3.`unwrapResponse`
      wrapResponse(item.output, context)
    })
  }
  else {
    // 1.去除头部注释
    removeHeadComment(outInfo[0].modulePath)
    // 2.重命名`api`文件,使其更具语义化
    renameApiFile(outInfo[0].output, context)
    // 3.`unwrapResponse`
    wrapResponse(outInfo[0].output, context)
    // 4.`splitApi`多仓库导出一个实例
    createApiEntry(context)
  }
}
