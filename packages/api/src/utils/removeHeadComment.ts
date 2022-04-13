import { resolve } from 'path'
import { getFileContent, pathIsDir, readDir, writeFile } from './files'

/**
 * @description 去掉文件生成模块头部的注释
 * @param src 文件路径
 */
export function removeHeadComment(src: string) {
  if (!src) return
  try {
    if (pathIsDir(src)) {
      const files = readDir(src)
      files.forEach((filename) => {
        removeHeadComment(resolve(src, filename))
      })
      return
    }
    const content = getFileContent(src)
    writeFile(src, content.slice(452))
  }
  catch (err) {}
}
