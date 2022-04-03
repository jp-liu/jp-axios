import path from 'path'
import { copyFile, createDir, pathIsDir, readDir } from './files'

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
