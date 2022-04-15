// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/**
 * @description 限制并发数
 * @param maxConcurrency 最大并发
 */
export async function runParallel<T>(maxConcurrency: number, taskList, iteratorFn) {
  const ret: Promise<T>[] = []
  const executing = []
  for (const item of taskList) {
    const p = Promise.resolve().then(() => iteratorFn(...item))
    ret.push(p)

    if (maxConcurrency <= taskList.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency)
        await Promise.race(executing)
    }
  }
  return Promise.all(ret)
}
