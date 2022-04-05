import { renameFileOrDir } from './files'

/**
 * @description 变更`Api`文件名字,并迁移到`types`文件夹内
 */
export function renameApiFile(outputPath: string) {
  if (!outputPath) return

  renameFileOrDir(
    `${outputPath}/module/data-contracts.ts`,
    `${outputPath}/types/interface.ts`
  )
}
