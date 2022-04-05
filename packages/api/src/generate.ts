import { generateApi } from 'swagger-typescript-api'
import { createGenerateContext } from './context'
import { getEntryType, removeHeadComment, renameApiFile, renderBaseTemplate } from './utils'

import type { ArrayInputOrOutputModel, EntryType, GenerateConfig } from './types'

export function generateModule(config: Omit<GenerateConfig, 'input' | 'url'>): void
export function generateModule(config: Omit<GenerateConfig, 'input' | 'spec'>): void
export function generateModule(config: Omit<GenerateConfig, 'url' | 'spec'>): void
export function generateModule(config: any): void {
  const { output } = config
  if (!output) throw new Error('output must be provided')

  const entryType = getEntryType(config)
  const context = createGenerateContext(config, entryType)

  // 多入口
  const overwrite = context.overwrite!
  if (context.isArrayInput) {
    const entryPaths = context[entryType] as ArrayInputOrOutputModel[]
    const outputPaths = context.output as ArrayInputOrOutputModel[]
    const modulePaths = context.modulePath as ArrayInputOrOutputModel[]
    for (let i = 0; i < entryPaths.length; i++) {
      const entry = entryPaths[i]
      const output = outputPaths.find(out => out.dirName === entry.dirName)!.path
      const module = modulePaths.find(mod => mod.dirName === entry.dirName)!.path
      renderBaseTemplate(output, overwrite)
      generateModuleApi(entry.path, module, output, entryType)
    }
    return
  }

  // 单入口
  renderBaseTemplate(context.output as string, overwrite)
  generateModuleApi(context[entryType] as string, context.modulePath as string, context.output as string, entryType)
}

function generateModuleApi<T extends EntryType>(entryPath: string, modulePath: string, output: string, entryType: T) {
  generateApi({
    modular: true,
    [entryType as 'input']: entryPath,
    output: modulePath,
    extractRequestParams: true,
    // because this script was called from package.json folder
    templates: './packages/api/src/templates/eta',
  }).then(() => {
    // 1.多出口需要拷贝多份
    // 1.去除头部注释
    removeHeadComment(output)
    // 2.重命名`api`文件,使其更具语义化
    renameApiFile(output)
  })
}
