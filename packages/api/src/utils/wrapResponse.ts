import { resolve } from 'path'
import type { GenerateContext } from '../types'
import { getFileContent, writeFile } from './files'

export function wrapResponse(output: string, context: GenerateContext) {
  const { unwrapResponse, useAxios } = context
  if (unwrapResponse && useAxios) return
  const instancePath = resolve(output as string, './instance/index.ts')
  const content = getFileContent(instancePath)
  writeFile(instancePath, content.replace('.then(res => res.data)', ''))
}
