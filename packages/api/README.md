## @jp-axios/api

**@jp-axios/api** 是一个根据提供的配置, 自动生成 `API` 模块的工具.

<img src="https://cdn.jsdelivr.net/gh/sudongyuer/image-bed@master/20220225/api-logo.2n9m692p1i80.webp" align="left"
     title="swagger-typescript-api logo by js2me" width="110" height="230">
Generate api via swagger scheme.
Supports OA 3.0, 2.0, JSON, yaml

Generated api module [**@jp-axios/core**](https://github.com/jp-liu/jp-axios/tree/main/packages/core) to make requests.

非常简单的帮助你生成typeScript api模块

(支持 swagger2.0 和 OpenApi 3.0 规范)

玩得开心 ^_^


---

### Why

![generate](https://user-images.githubusercontent.com/79979500/161927613-3a0cc0f6-d67b-40c9-882f-63e0f330f76e.jpg)

![jp-api](https://user-images.githubusercontent.com/79979500/161933386-04ad663e-843f-4ea5-a187-734890705195.gif)



### 安装

```bash
$ npm install @jp-liu/api --save-dev
# or
$ pnpm install @jp-liu/api --save-dev
# or
$ yarn add @jp-liu/api --save-dev
```



### 如何使用

如果你没有全局安装, 那么可以使用 `npx` 或者 `pnpx` 工具辅助执行

```bash
$ npx jp-api
# or
$ pnpx jp-api
```

你也可以将它加入你的 `package.json` 作为脚本命令

```json
{
    "scripts": {
        "jp-api": "jp-api",
        // ...
    }
}
```

也支持在 `node` 中, 扩展,自行运行

```ts
import { generate } from '@jp-liu/api'

const config = {
  // ...
}
generate(config)
```



### 配置信息

配置我们可以写在 `package.json` 中, 也可以在根目录创建 `jp-api.config.js/json`

```ts
interface GenerateConfig {
  /**
   * swagger 文档地址,可以使`json`或`yaml`,输入绝对路径
   */
  input: string | ArrayInputOrOutputModel[]
  /**
   * url to swagger schema
   */
  url: string | ArrayInputOrOutputModel[]
  /**
   * swagger schema JSON
   */
  spec: import('swagger-schema-official').Spec
  /**
   * 生成输出路径
   */
  output: string | ArrayInputOrOutputModel[]
  /**
   * 是否覆盖,除`module`文件夹外的其他文件,默认:false
   * 其他文件都是提供的模板,会存在变更,所以默认不覆盖
   */
  overwrite?: boolean
}
```

| 字段      | 描述( 入口支持数组形式 )                                     |
| :-------- | ------------------------------------------------------------ |
| input     | 直接提供入口文件, 支持 `json` `yaml` 可以让后端生成, 参考入参一 |
| url       | 后端 `GitHub` 仓库地址, 或者是开启的 `swagger` 网页的接口信息, 参考入参二 |
| overwrite | 默认值: **false**  <br />是否覆盖基础模板, 由于提供的基础模板是会产生修改的部分, 如果接口更新,需要重新生成, 则由该开关控制是否将通用部分覆盖 |
| useAxios  | 是否采用 `axios` 模板生成代码                                |
| splitApi  | 默认值: **false**<br />多入口，是否对应多出口。<br />有时候后端分为多个模块，统一在网关对外暴露调用，前端开发针对后端模块分包，但仅仅只需要一个出口调用 |
| output    | 代码出口路径。example：`"./src/api"`                         |

> 示例:
>
> 入参一:
>
> 当 `input` 为多个的时候, `dirName` 和 `path` 参数都是必传的, 我们需要知道他们是所处的模块.
>
> `output` 推荐输入一个,这样内部会帮你在同一文件夹导出不同模块的模板, 文件夹名字将会是 `input` 对应模块的 `dirName`
>
> ```json
> {
>     "jp-api": {
>         // "input": "./src/api/swagger.json", // or "./src/api/swagger.yaml"
>         "input": [
>             {
>                 "dirName": "test1",
>                 "path": "./src/api/swagger.json"
>             },
>             {
>                 "dirName": "test2",
>                 "path": "./src/api/swagger.yaml"
>             }
>         ],
>         "output": "./src/api"
>     }
> }
> ```
>
> 1. `json` 如: [swagger.json](https://github.com/jp-liu/jp-axios/blob/main/packages/api/src/test/swagger.json)
> 2. `yaml` 如: [swagger.yaml](https://github.com/jp-liu/jp-axios/blob/main/packages/api/src/test/swagger.yaml)
>
> 入参二:
> 
> ```json
> {
>    "jp-api": {
>       // "url": "http://xxx:8080/xxx-server/v2/api-docs" // or 'git'
>       "url": [
>           {
>               "dirName": "test1",
>               "path": "http://xxx:8080/xxx-server/v2/api-docs",
>           },
>           {
>               "dirName": "test2",
>               "path": "http://xxx:8080/xxx-server/v2/api-docs1",
>           },
>       ],
>       "output": "./src/api"
>    }
> }
> ```
>
> `url`: `http://xxx:8080/xxx-server/v2/api-docs?`是后端同事开的 `swagger` 文档地址请求的 `api` 内容,如
> ![image](https://user-images.githubusercontent.com/79979500/161214860-4a593702-92fd-4325-837c-44aca2321a62.png)
