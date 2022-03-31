import { resolve } from 'path'
import { generateApi } from 'swagger-typescript-api'
import { createGenerateContext } from './context'
import { cleanDir, pathIsExist, readDir, removeHeadComment, renameFileOrDir, renderTemplate } from './utils'

import type { GenerateConfig, GenerateContext } from './types/jp-axios-module'

/**
 * @description 获取入口类型
 */
function getEntryType(context: GenerateContext): 'input' | 'url' | 'spec' {
  const { input, url, spec } = context

  if (input)
    return 'input'

  if (url) {
    if (
      !/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/.test(
        url
      )
    )
      throw new Error(`url ${url} is not a network address`)
    return 'url'
  }

  if (spec) return 'spec'

  throw new Error('input, url or spec must be provided')
}

/**
 * @description 生成通用请求模板
 */
function generateBaseTemplate(context: GenerateContext) {
  const { output, overwrite } = context
  const baseFilePath = resolve(__dirname, './templates/base')

  // 如果不需要重写,并且出口文件夹存在,则看看内部有没有缺失部分
  if (!overwrite && pathIsExist(output)) {
    const baseFilesName = ['error', 'instance', 'interceptor', 'types', 'index.ts']
    const files = readDir(output)
    baseFilesName.forEach((fileName) => {
      if (files.includes(fileName)) return
      renderTemplate(`${baseFilePath}/${fileName}`, `${output}/${fileName}`)
    })
  }
  // 如果需要重写,或者出口文件夹不存在,则为第一次创建
  // 先清空文件夹,然后拷贝模板
  else {
    cleanDir(output)
    renderTemplate(baseFilePath, output)
  }
}

/**
 * @description 变更`Api`文件名字,并迁移到`types`文件夹内
 */
function renameApiFile(outputPath: string) {
  if (!outputPath) return

  renameFileOrDir(
    `${outputPath}/module/data-contracts.ts`,
    `${outputPath}/types/interface.ts`
  )
}

export function generateModuleApi(config: Omit<GenerateConfig, 'input' | 'url'>): void
export function generateModuleApi(config: Omit<GenerateConfig, 'input' | 'spec'>): void
export function generateModuleApi(config: Omit<GenerateConfig, 'url' | 'spec'>): void
export function generateModuleApi(config: any): void {
  const { output } = config
  if (!output) throw new Error('output must be provided')

  const context = createGenerateContext(config)

  const inputType = getEntryType(context)

  generateBaseTemplate(context)

  generateApi({
    modular: true,
    [inputType as 'input']: context[inputType] as string,
    output: resolve(output, './module'),
    extractRequestParams: true,
    // because this script was called from package.json folder
    templates: './src/jp-axios-module/templates/eta',
  }).then(() => {
    // 1.去除头部注释
    removeHeadComment(output)
    // 2.重命名`api`文件,使其更具语义化
    renameApiFile(output)
  })
}
