
import { resolve } from 'path'
import * as fs from 'fs'
import { cwd } from 'process'
import { generateApi } from 'swagger-typescript-api'
import { readDir } from './utils/files'
import { renderTemplate } from './generate'

const outputPath = resolve(cwd(), './jp-module-test')

renderTemplate(resolve(__dirname, './templates/base'), outputPath)

generateApi({
  modular: true,
  input: resolve(__dirname, './test/swagger.json'),
  output: `${outputPath}/module`,
  extractRequestParams: true,
  // because this script was called from package.json folder
  templates: './src/jp-axios-module/templates/eta',
})
  .then(() => {
    // 1.取出文件头部的注释
    const files = readDir(`${outputPath}/module`)
    files.forEach((filename) => {
      const content = fs.readFileSync(`${outputPath}/module/${filename}`, 'utf-8')
      fs.writeFileSync(`${outputPath}/module/${filename}`, content.slice(452))
      if (filename === 'data-contracts.ts')
        fs.renameSync(`${outputPath}/module/data-contracts.ts`, `${outputPath}/types/interface.ts`)
    })
    // 1.变更 `data-contracts` 名字
    // 1.将`base`文件夹内的内容拷贝到`outputPath`文件夹内
    // 2.将`module`文件夹的内容剪切到`outputPath`文件夹内
  })
