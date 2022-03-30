
import * as path from 'path'
import { copyFile, createDir, getFileContent, pathIsDir, readDir, writeFile } from './utils/files'
/**
 * @description 拷贝文件到指定目录
 */
export function renderTemplate(src: string, dest: string) {
  if (pathIsDir(src)) {
    // skip node_module
    if (path.basename(src) === 'node_modules')
      return

    // if it's a directory, render its subdirectories and files recursively
    createDir(dest)
    for (const file of readDir(src))
      renderTemplate(path.resolve(src, file), path.resolve(dest, file))
    return
  }
  copyFile(src, dest)
}

/**
 * @description 去掉文件头部的双斜杠注释
 * @param path 文件路径
 */
export function removeFileHeaderComment(path: string) {
  if (!path) return
  try {
    const content = getFileContent(path)
    const lines = content.split('\n')
    const newContent = lines.filter(line => !line.trim().startsWith('//')).join('\n')
    writeFile(path, newContent)
  }
  catch (err) {}
}
