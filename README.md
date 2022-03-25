# jp-axios

**jp-axios** 是 `axios` 的封装版本.它提供了一下功能

1. 支持模块分模块使用
2. 支持 `hooks` 的方式使用
3. `TODO` 提供对应信息生成 `ts` 对应接口,利于日常开发联调

## 下载

```bash
# with npm
$ npm install jp-axios

# or with yarn
$ yarn add jp-axios

# or with pnpm
$ pnpm add jp-axios
```



## 使用

1. 提供加强封装版本的 `axios`
    ```ts
    import JPAxios from 'jp-axios'
    // 1.创建实例
    const instance = new JPAxios({
      baseURL: 'http://localhost:3000',
      timeout: 5000
    })

    // 2.正常使用
    instance.get('/users')
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
      }
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

2. 使用 `hook` 的方式来使用接口
    ```ts
    import { useHttp } from 'jp-axios'

    // 1.支持四种普通调用方式
    // 1.1 传递请求对象
    useHttp({
      url: '/users',
      method: 'get',
      params: {
        name: 'jp'
      }
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
        name: 'jp'
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
      }
    })
    // 也可以像这样
    useHttp.get({
      url: '/users',
      params: {
        name: 'jp'
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
      }
    })
    // 这样
    useHttp.get('/users', {
      params: {
        name: 'jp'
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
      }
    })
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
## License

[MIT](./LICENSE) License © 2022 [jp-liu](https://github.com/jp-liu)
