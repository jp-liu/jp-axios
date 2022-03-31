import { cwd } from 'process'
import type { GenerateConfig, GenerateContext } from './types/jp-axios-module'

export function createGenerateContext(config: GenerateConfig): GenerateContext {
  return {
    rootPath: cwd(),
    config,
    ...config,
  }
}
