import * as fs from 'fs'
import makeDir from 'make-dir'

export const getFileContent = (path: string) => {
  return fs.readFileSync(path, { encoding: 'utf-8' })
}

export const pathIsDir = (path: string) => {
  if (!path) return false

  try {
    const stat = fs.statSync(path)
    return stat.isDirectory()
  }
  catch (e) {
    return false
  }
}

export const readDir = (path: string) => {
  if (!path) return []

  try {
    return fs.readdirSync(path)
  }
  catch (e) {
    return []
  }
}

export const removeDir = (path: string) => {
  try {
    fs.rmdirSync(path, { recursive: true })
  }
  catch (e) {}
}

export const createDir = (path: string) => {
  try {
    makeDir.sync(path)
  }
  catch (e) {}
}

export const cleanDir = (path: string) => {
  removeDir(path)
  createDir(path)
}

export const pathIsExist = (path: string) => path && fs.existsSync(path)

export const copyFile = (src: string, dest: string) => {
  if (!src || !dest) return
  try {
    fs.copyFileSync(src, dest)
  }
  catch (err) {}
}
export const renameFileOrDir = (src: string, dest: string) => {
  if (!src || !dest) return
  try {
    fs.renameSync(src, dest)
  }
  catch (err) {}
}

export const writeFile = (path: string, content: string) => {
  if (!path) return
  try {
    fs.writeFileSync(path, content)
  }
  catch (err) {}
}

export const unlink = (path: string) => {
  if (!path) return
  try {
    fs.unlinkSync(path)
  }
  catch (err) {}
}
