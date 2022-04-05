import path, { resolve } from 'path'
import { cleanDir, copyFile, createDir, pathIsDir, pathIsExist, readDir } from './files'

/**
 * @description 生成通用请求模板
 */
export function renderBaseTemplate(outputPath: string, overwrite: boolean): void {
  const baseFilePath = resolve(__dirname, '../templates/base')
  const baseTemplateFn = baseTemplate.bind(null, overwrite!, baseFilePath)
  baseTemplateFn(outputPath)
}

function baseTemplate(overwrite: boolean, basePath: string, output: string) {
  // 如果不需要重写,并且出口文件夹存在,则看看内部有没有缺失部分
  if (!overwrite && pathIsExist(output)) {
    const baseFilesName = ['error', 'instance', 'interceptor', 'types', 'index.ts']
    const files = readDir(output)
    baseFilesName.forEach((fileName) => {
      if (files.includes(fileName)) return
      renderTemplate(`${basePath}/${fileName}`, `${output}/${fileName}`)
    })
  }
  // 如果需要重写,或者出口文件夹不存在,则为第一次创建
  // 先清空文件夹,然后拷贝模板
  else {
    cleanDir(output)
    renderTemplate(basePath, output)
  }
}

/**
 * @description 拷贝文件到指定目录
 */
export function renderTemplate(src: string, dest: string) {
  if (pathIsDir(src)) {
    // skip node_module
    if (path.basename(src) === 'node_modules') return

    // if it's a directory, render its subdirectories and files recursively
    createDir(dest)
    for (const file of readDir(src))
      renderTemplate(path.resolve(src, file), path.resolve(dest, file))
    return
  }
  copyFile(src, dest)
}
