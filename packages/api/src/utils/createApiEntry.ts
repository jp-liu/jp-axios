import type { GenerateContext } from '../types'
import { apiEntryContent } from './apiEntryContent'
import { readDir, writeFile } from './files'

export function createApiEntry(context: GenerateContext) {
  const { splitApi, modulePath } = context
  if (splitApi) return

  // 1.获取所有模块
  let imports = ''
  let exp = '\nconst modules = {\n'
  readDir(modulePath as string).forEach((file) => {
    const basename = file.split('.')[0]
    imports += `import ${basename} from './${basename}';\n`
    exp += `  ${basename},\n`
  })
  exp += '}'

  // 2.生成入口文件
  const content = `${imports + exp}\n${apiEntryContent(context)}`
  writeFile(`${modulePath}/http-client.ts`, content)
}
