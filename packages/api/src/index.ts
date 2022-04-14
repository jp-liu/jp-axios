import { getGenerateModuleConfig } from './config'
import { generateModule } from './generate'
import type { GenerateConfig } from './types'

/**
 * @description 开始生成模块`api`
 * @param config 可以自行获取并调用
 */
export function generate(config?: Omit<GenerateConfig, 'input' | 'url'>): void
export function generate(config?: Omit<GenerateConfig, 'input' | 'spec'>): void
export function generate(config?: Omit<GenerateConfig, 'url' | 'spec'>): void
export function generate(config?: any) {
  config = getGenerateModuleConfig(config)
  generateModule(config)
}
