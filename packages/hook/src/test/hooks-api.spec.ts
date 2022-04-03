import { describe, expect, test } from 'vitest'
import { useHttp } from '../hooks-api'

describe('jp-axios hooks api', () => {
  test('happy path, useHttp', async() => {
    const res = {
      name: '小明',
      age: 18,
      height: 1.88,
    }

    const res1 = await useHttp<{
      data: { name: string; age: number; height: number }
    }>('http://localhost:3000/user/info', 'GET')

    const res2 = await useHttp<{
      data: { name: string; age: number; height: number }
    }>({ url: 'http://localhost:3000/user/info', method: 'get' })

    const res3 = await useHttp.get<{
      data: { name: string; age: number; height: number }
    }>({ url: 'http://localhost:3000/user/info' })

    expect(res1.data).toMatchObject(res)
    expect(res2.data).toMatchObject(res)
    expect(res3.data).toMatchObject(res)
  })
  test('useHttp hooks interface interceptor', async() => {
    const reqArr: string[] = []
    const resArr: string[] = []
    const res1 = await useHttp<{
      data: { name: string; age: number; height: number }
    }, true>('http://localhost:3000/user/info', {})
    const res2 = await useHttp<{
      data: { name: string; age: number; height: number }
    }, true>({
      url: 'http://localhost:3000/user/info',
      method: 'get',
      interceptors: {
        requestInterceptor(config) {
          reqArr.push('first request')
          return config
        },
        responseInterceptor(res) {
          resArr.push('first response')
          return res.data
        },
      },
    })
    expect(reqArr.length).toBe(1)
    expect(resArr.length).toBe(1)
    expect(res1.data).toMatchObject(res2)
  })
  test('useHttp hooks interceptor', async() => {
    const reqArr: string[] = []
    const resArr: string[] = []
    useHttp.use({
      requestInterceptor(config) {
        reqArr.push('first request')
        return config
      },
      responseInterceptor(res) {
        resArr.push('first response')
        return res.data
      },
    })
    const res1 = await useHttp<{
      data: { name: string; age: number; height: number }
    }>('http://localhost:3000/user/info', 'GET', {
      interceptors: {
        requestInterceptor(config) {
          reqArr.push('second request')
          return config
        },
        responseInterceptor(res) {
          resArr.push('second response')
          return res
        },
      },
    })
    expect(reqArr).toMatchObject(['second request', 'first request'])
    expect(resArr).toMatchObject(['first response', 'second response'])
    expect(res1).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88,
    })
  })
})
