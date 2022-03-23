import { describe, expect, test } from 'vitest'
import { useHttp } from '../src'

describe('jp-axios hooks api', () => {
  test('happy path, useHttp', async() => {
    const res1 = await useHttp<{ data: { name: string; age: number; height: number } }>('http://localhost:3000/user/info', 'GET')
    const res2 = await useHttp<{ data: { name: string; age: number; height: number } }>({ url: 'http://localhost:3000/user/info', method: 'get' })
    const res3 = await useHttp.get<{ data: { name: string; age: number; height: number } }>({ url: 'http://localhost:3000/user/info' })
    expect(res1.data).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })
    expect(res2.data).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })
    expect(res3.data).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })
  })
  test('useHttp hooks interface interceptor', async() => {
    const reqArr: string[] = []
    const resArr: string[] = []
    const res1 = await useHttp<{ data: { name: string; age: number; height: number } }>(
      'http://localhost:3000/user/info',
      'GET',
      {
        interceptors: {
          requestInterceptor(config) {
            reqArr.push('first request')
            return config
          },
          responseInterceptor(res) {
            resArr.push('first response')
            return res.data
          }
        }
      })
    expect(reqArr).toMatchObject(['first request'])
    expect(resArr).toMatchObject(['first response'])
    expect(res1).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })
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
      }
    })
    const res1 = await useHttp<{ data: { name: string; age: number; height: number } }>(
      'http://localhost:3000/user/info',
      'GET',
      {
        interceptors: {
          requestInterceptor(config) {
            reqArr.push('second request')
            return config
          },
          responseInterceptor(res) {
            resArr.push('second response')
            return res
          }
        }
      })
    expect(reqArr).toMatchObject(['second request', 'first request'])
    expect(resArr).toMatchObject(['first response', 'second response'])
    expect(res1).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })
  })
})
