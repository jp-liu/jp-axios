import { resolve } from 'path'
import type { GenerateContext } from '../types'
import { getFileContent, writeFile } from './files'

export function wrapResponse(context: GenerateContext) {
  const { output } = context
  const instancePath = resolve(output as string, './instance/index.ts')
  const content = getFileContent(instancePath)
  writeFile(instancePath, content.replace('.then(res => res.data)', ''))
}
