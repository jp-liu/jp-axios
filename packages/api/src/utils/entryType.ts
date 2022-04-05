import type { EntryType, GenerateConfig } from '../types'

/**
 * @description 获取入口类型
 */
export function getEntryType(config: GenerateConfig): EntryType {
  const { input, url, spec } = config

  if (input) {
    if (Array.isArray(input) && input.some(u => !u.dirName && !u.path))
      throw new Error('when there are multiple modules, the input dirName and path are required')
    return 'input'
  }

  if (url) {
    if (typeof url === 'string'
      && !/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/.test(
        url
      )
    )
      throw new Error(`url ${url} is not a network address`)
    if (Array.isArray(url) && url.some(u => !u.dirName && !u.path))
      throw new Error('when there are multiple modules, the output dirName and path are required')

    return 'url'
  }

  if (spec) return 'spec'

  throw new Error('input, url or spec must be provided')
}
