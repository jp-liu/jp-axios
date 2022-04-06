## @jp-axios/hook

**@jp-axios/hook** 是补全和 `axios` 的功能, 让其也可以通过函数调用的方式来调用接口, 提供了多种重载, 支持各种参数提示

### 下载

```bash
$ npm install @jp-axios/hook -D
```

### 使用

```ts
import { useHttp } from 'jp-axios'

// 1.支持四种普通调用方式
// 1.1 传递请求对象
useHttp({
  url: '/users',
  method: 'get',
  params: {
    name: 'jp',
  },
})
// 1.2 提供请求地址,方法默认为 `get`
useHttp('/users')
// 1.3 提供请求地址和方法
useHttp('/users', 'post')
// 1.4 提供清漆地址方法和请求参数
useHttp('/users', 'post', { data: { name: 'jp' } })

// 2.指定方法
useHttp.get('/users')
useHttp.post('/users', { data: { name: 'jp' } })
useHttp.put('/users', { data: { name: 'jp' } })
// 等等...

// 3.当然我们也可以通过 `useHttp` 来创建拦截器
// 3.1 全局拦截器, 你可以注册多组拦截器
useHttp.use({
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

// 4.指定接口拦截器
useHttp({
  url: '/users',
  data: {
    name: 'jp',
  },
  interceptors: {
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
  },
})
// 也可以像这样
useHttp.get({
  url: '/users',
  params: {
    name: 'jp',
  },
  interceptors: {
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
  },
})
// 这样
useHttp.get('/users', {
  params: {
    name: 'jp',
  },
  interceptors: {
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
  },
})
```

###
