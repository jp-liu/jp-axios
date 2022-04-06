# @jp-axios/core

**@jp-axios/core** 是 `axios` 的封装.增加了接口拦截器和去除重复请求的功能, 我们可以在这里获得更多代码提示, 良好的开发体验

> 如果你要自己试试, 做出更好的更多自定义功能, 可以查看这篇文章, 了解是如何做的 [基于TS对axios的封装和api自动生成](https://juejin.cn/post/7083434985356525598)

![axios](https://user-images.githubusercontent.com/79979500/161889967-275492ae-60d1-47ab-94b5-9b0c793cbc6e.gif)

## 下载

```bash
$ npm install @jp-axios/core --save
# or
$ pnpm install @jp-axios/core --save
```

## 使用

```ts
import JPAxios from '@jp-liu/axios'
// 1.创建实例
const instance = new JPAxios({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

// 2.正常使用
instance
  .get('/users')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })

// 3.如果需要拦截器可以使用实例拦截器
const instance1 = new JPAxios({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  interceptors: {
    requestInterceptor: (config) => {
      // 可以在请求前做一些处理
      return config
    },
    requestInterceptorCatch: (err) => {
      // 如果发送请求失败,可以在这里做一些处理
      console.log(err)
    },
    responseInterceptor: (response) => {
      // 可以在请求后做一些处理
      return response
    },
    responseInterceptorCatch: (err) => {
      // 如果请求失败,可以在这里做一些处理
      console.log(err)
    },
  },
})
// 4.你也可以使用实例的方法来创建拦截器
instance1.use({
  requestInterceptor(params) {
    // you can do something
  },
  requestInterceptorCatch(params) {
    // you can do something
  },
  responseInterceptor(params) {
    // you can do something
  },
  responseInterceptorCatch(params) {
    // you can do something
  },
})

// 5.如果你需要针对单独接口做特殊处理,也可以定义接口拦截器
instance1.get({
  url: '/users',
  requestInterceptor(params) {
    // you can do something
  },
  requestInterceptorCatch(params) {
    // you can do something
  },
  responseInterceptor(params) {
    // you can do something
  },
  responseInterceptorCatch(params) {
    // you can do something
  },
})
```

## 取消重复请求

```ts
// 1.取消重复请求
// 1.1 实例开启, 当前实例所有接口,都会检测是否重复
const instance1 = new JPAxios({ removeRepeat: true })

// 1.2 单独接口使用
instance.request({ url: '/user/info', loading: true, removeRepeat: true })
```

## 关于拦截器

```ts
// 1.全局的`loading`什么时候开启, 大多数情况下,`loading`都在我们的组件内部,但是有时候我们需要控制全屏的 `loading` 效果, 又不是全部接口都需要,所以可以这样用
const instance = new JPAxios({
  interceptors: {
    requestInterceptor: (config) => {
      if (config.loading) GlobalLoading.start()
      return config
    },
    responseInterceptor: (response) => {
      // 可以在请求后做一些处理
      if (GlobalLoading.isStart) GlobalLoading.done()
      return response
    },
    responseInterceptorCatch: (err) => {
      // 如果请求失败,可以在这里做一些处理
      if (GlobalLoading.isStart) GlobalLoading.done()
      console.log(err)
    },
  },
})

instance.request({ url: '/user/info', loading: true }) // 这样可以再拦截器中获取到,并且针对特定接口开启全局`loading`效果了

// 2.取消重复请求
// 2.1 实例开启, 当前实例所有接口,都会检测是否重复
const instance1 = new JPAxios({ removeRepeat: true })

// 2.2 单独接口使用
instance.request({ url: '/user/info', loading: true, removeRepeat: true })
```

:::tips
使用拦截器之前,你需要了解多组拦截器执行机制,具体如下:

```ts
/**
 * Tips: 拦截器执行结构
 *    - Q:请求  S: 响应  F: 服务器
 *    - 如果对顺序要求,可以通过设置对应的拦截顺序进行修改,机制如下
 *    - Q1/S1 拦截器1
 *    - Q2/S2 拦截器2
 *    - Q3/S3 拦截器3
 *
 *         F         F  服务器响应
 *    Q1   ↑    S1   ↓
 *    Q2   ↑    S2   ↓
 *    Q3   ↑    S3   ↓
 * 客户端发送
 */
```

:::
