import { getGenerateModuleConfig } from './config'
import { generateModule } from './generate'
import type { GenerateConfig } from './types'

/**
 * @description 开始生成模块`api`
 * @param config 可以自行获取并调用
 */
export function generate(config?: GenerateConfig) {
  config = config || getGenerateModuleConfig()
  generateModule(config)
}

// 任务清单, 保持现有逻辑不变
// 0.`context`增加一个状态判定,是什么环境下使用, `jp-axios` | `jp-api` | 'node_modules`
// 1.增加 `useAxios` 模板
// 2.增加 `splitApi` 功能
// 3.使用 `axios` 模板的时候,添加一个 `unwrapResponse` 功能
