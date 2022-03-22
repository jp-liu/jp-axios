import { describe, expect, test } from 'vitest'
import JPAxios from '../src'

describe('jp-axios', () => {
  test('happy path, use jp-axios', async() => {
    const instance = new JPAxios()
    const res = await instance.get({ url: 'http://localhost:3000/user/info' })
    expect(res.data).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })

    const res1 = await instance.post({
      url: 'http://localhost:3000/user/post',
      data: {
        id: '123321'
      }
    })

    expect(res1.data).toBe(true)
  })

  test('instance interceptor', async() => {
    let dummy = 0
    let response = 0
    const instance = new JPAxios({
      interceptors: {
        requestInterceptor(config) {
          dummy++
          return config
        },
        responseInterceptor(res) {
          response++
          return res.data
        }
      }
    })
    const res = await instance.get({ url: 'http://localhost:3000/user/info' })
    expect(dummy).toBe(1)
    expect(response).toBe(1)
    expect(res).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })
    const res1 = await instance.get({ url: 'http://localhost:3000/user/info' })
    expect(dummy).toBe(2)
    expect(res1).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })
  })

  test('instance call use for add interceptor', async() => {
    const requestArr: string[] = []
    const responseArr: string[] = []
    const instance = new JPAxios()

    /**
     * 拦截器:
     *  请求: 自下而上
     *  响应: 自上而下
     */
    instance.use({
      requestInterceptor(config) {
        requestArr.push('first request')
        return config
      },
      responseInterceptor(res) {
        responseArr.push('first response')
        return res.data
      }
    })

    instance.use({
      requestInterceptor(config) {
        requestArr.push('second request')
        return config
      },
      responseInterceptor(res) {
        responseArr.push('second response')
        return res
      }
    })
    const res = await instance.get({ url: 'http://localhost:3000/user/info' })
    expect(requestArr).toMatchObject(['second request', 'first request'])
    expect(responseArr).toMatchObject(['first response', 'second response'])
    expect(res).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })
  })

  test('interface interceptor', async() => {
    const requestArr: string[] = []
    const responseArr: string[] = []
    const instance = new JPAxios()
    instance.use({
      requestInterceptor(config) {
        requestArr.push('first request')
        return config
      },
      responseInterceptor(res) {
        responseArr.push('first response')
        return res.data
      }
    })

    const res = await instance.get<{ name: string;age: number;height: number; job?: string }>({
      url: 'http://localhost:3000/user/info',
      interceptors: {
        requestInterceptor(config) {
          requestArr.push('second request')
          return config
        },
        responseInterceptor(res) {
          responseArr.push('second response')
          if (res.name === '小明')
            res.job = 'xdm'

          return res
        }
      }
    })
    expect(requestArr).toMatchObject(['second request', 'first request'])
    expect(responseArr).toMatchObject(['first response', 'second response'])
    expect(res).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88,
      job: 'xdm'
    })
  })

  // test('support hook usage', async() => {
  //   const res = await useHttp({ url: 'http://localhost:3000/user/info', method: 'get' })
  // })
})
