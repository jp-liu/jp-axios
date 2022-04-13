import { describe, expect, it } from 'vitest'
import JPAxios from '..'
import type { JPResponse } from '../../dist'

const delay = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

describe('jp-axios', () => {
  it('happy path, use jp-axios', async() => {
    const instance = new JPAxios()
    const res = await instance.get<JPResponse<{ name: string; age: number; height: number }>>({ url: 'http://localhost:3000/user/info' })
    expect(res.data).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88,
    })

    const res1 = await instance.post({
      url: 'http://localhost:3000/user/post',
      data: {
        id: '123321',
      },
    })

    expect(res1.data).toBe(true)
  })

  it('instance interceptor', async() => {
    let dummy = 0
    let response = 0
    const instance = new JPAxios<{ id: 123 }>({
      interceptors: {
        requestInterceptor(config) {
          dummy++
          return config
        },
        responseInterceptor(res) {
          response++
          return res.data
        },
      },
    })
    const res = await instance.get({ url: 'http://localhost:3000/user/info' })
    expect(dummy).toBe(1)
    expect(response).toBe(1)
    expect(res).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88,
    })
    const res1 = await instance.get({ url: 'http://localhost:3000/user/info' })
    expect(dummy).toBe(2)
    expect(res1).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88,
    })
  })

  it('instance call use for add interceptor', async() => {
    const requestArr: string[] = []
    const responseArr: string[] = []
    const instance = new JPAxios()

    /**
     * 拦截器:
     *  请求: 自下而上
     *  响应: 自上而下
     */
    instance.use<{ id: 123 }, true>({
      requestInterceptor(config) {
        requestArr.push('first request')
        return config
      },
      responseInterceptor(res) {
        responseArr.push('first response')
        return res.data
      },
    })

    instance.use<{ name: '13321' }>({
      requestInterceptor(config) {
        requestArr.push('second request')
        return config
      },
      responseInterceptor(res) {
        responseArr.push('second response')
        return res
      },
    })
    const res = await instance.get({ url: 'http://localhost:3000/user/info' })
    expect(requestArr).toMatchObject(['second request', 'first request'])
    expect(responseArr).toMatchObject(['first response', 'second response'])
    expect(res).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88,
    })
  })

  it('interface interceptor', async() => {
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
      },
    })

    const res = await instance.get<{
      name: string
      age: number
      height: number
      job?: string
    }>({
      url: 'http://localhost:3000/user/info',
      interceptors: {
        requestInterceptor(config) {
          requestArr.push('second request')
          return config
        },
        responseInterceptor(res) {
          responseArr.push('second response')
          if (res.name === '小明') res.job = 'xdm'

          return res
        },
      },
    })
    expect(requestArr).toMatchObject(['second request', 'first request'])
    expect(responseArr).toMatchObject(['first response', 'second response'])
    expect(res).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88,
      job: 'xdm',
    })
  })

  it('should remove repeat request for a instance all request', async() => {
    let res1, res2, res3
    const instance = new JPAxios({ removeRepeat: true })
    instance.request({
      url: 'http://localhost:3000/user/info',
      method: 'GET',
      params: {
        id: '123321',
        delay: 3000
      }
    }).then(res => res1 = res).catch(err => res1 = err)
    await delay()
    instance.request({
      url: 'http://localhost:3000/user/info',
      method: 'GET',
      params: {
        id: '123321',
        delay: 3000
      }
    }).then(res => res2 = res).catch(err => res2 = err)
    await delay()
    await instance.request({
      url: 'http://localhost:3000/user/info',
      method: 'GET',
      params: {
        id: '123321',
        delay: 3000
      }
    }).then(res => res3 = res).catch(err => res3 = err)

    expect(res1).toMatchObject({
      message: 'http://localhost:3000/user/info&get&{"id":"123321","delay":3000}&'
    })
    expect(res2).toMatchObject({
      message: 'http://localhost:3000/user/info&get&{"id":"123321","delay":3000}&'
    })
    expect((res3 as any).data).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88,
    })
  }, 10000)

  it('remove repeat request for single request', async() => {
    const instance = new JPAxios()
    let res1, res2, res3
    const req = () =>
      instance.request({
        url: 'http://localhost:3000/user/info',
        method: 'get',
        params: {
          id: '123321',
          delay: 3000
        },
        removeRepeat: true
      })
    req().catch(err => res1 = err)
    await delay()
    req().catch(err => res2 = err)
    await delay()
    res3 = req().catch(err => res3 = err)
    res3 = await res3

    expect(res1).toMatchObject({
      message: 'http://localhost:3000/user/info&get&{"id":"123321","delay":3000}&'
    })
    expect(res2).toMatchObject({
      message: 'http://localhost:3000/user/info&get&{"id":"123321","delay":3000}&'
    })
    expect((res3 as any).data).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88,
    })
  }, 10000)

  // test('support hook usage', async() => {
  //   const res = await useHttp({ url: 'http://localhost:3000/user/info', method: 'get' })
  // })
})
