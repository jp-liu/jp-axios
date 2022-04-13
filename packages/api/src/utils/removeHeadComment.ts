import path from 'path'
import { getFileContent, pathIsDir, readDir, writeFile } from './files'
import { isWin } from '.'

/**
 * @description 去掉文件头部的注释
 * @param src 文件路径
 */
export function removeHeadComment(src: string, isModule = false) {
  if (!src) return
  try {
    const separator = isWin() ? '\\' : '/'
    const flag = src.split(separator).pop() === 'module'
    if (pathIsDir(src)) {
      const files = readDir(src)
      files.forEach((filename) => {
        removeHeadComment(path.resolve(src, filename), flag)
      })
      return
    }
    let content = getFileContent(src)
    if (isModule && !src.includes('index.ts')) {
      content = content.slice(452)
    }
    else {
      const lines = content.split('\n')
      content = lines
        .filter(line => !line.trim().startsWith('//'))
        .join('\n')
    }
    writeFile(src, content)
  }
  catch (err) {}
}
