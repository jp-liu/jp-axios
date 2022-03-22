import { describe, expect, test } from 'vitest'
import { useHttp } from '../src'

describe('jp-axios hooks api', () => {
  test('happy path, useHttp', async() => {
    const res = await useHttp<{ data: { name: string; age: number; height: number } }>({ url: 'http://localhost:3000/user/info', method: 'get' })
    expect(res.data).toMatchObject({
      name: '小明',
      age: 18,
      height: 1.88
    })
  })
})
