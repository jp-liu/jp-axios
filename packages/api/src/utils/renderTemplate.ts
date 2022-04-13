import path, { resolve } from 'path'
import type { GenerateContext } from '../types'
import { cleanDir, copyFile, createDir, pathIsDir, pathIsExist, readDir } from './files'

/**
 * @description 准备生成通用模板
 */
export function renderBaseTemplate(outputPath: string, context: GenerateContext): void {
  const { overwrite, env, useAxios } = context

  let basePath = '../templates'
  if (env !== 'npm') basePath = `../${basePath}`
  let baseFilePath = resolve(__dirname, basePath)
  // common template
  baseTemplate(resolve(__dirname, `${basePath}/base`), outputPath, overwrite!)

  if (useAxios)
    // 1.axios
    baseFilePath = resolve(__dirname, `${basePath}/axios`)
  else
    // 2.jp-axios
    baseFilePath = resolve(__dirname, `${basePath}/jp-axios`)

  baseTemplate(baseFilePath, outputPath, overwrite!)
}
/**
 * @description 生成通用请求模板
 */
export function baseTemplate(basePath: string, output: string, overwrite: boolean) {
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
