import type { GenerateApiOutput } from 'swagger-typescript-api'

export interface GenerateConfig {
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
   * @default false
   */
  overwrite?: boolean
  /**
   * 是否采用 `axios` 模板生成代码
   * @default false
   */
  useAxios?: boolean
  /**
   * `axios` 输出结果是否是 `res.data`
   * @default true
   */
  unwrapResponse?: boolean
  /**
   * 多入口是否拆包: 后端分为多个模块，统一在网关对外暴露调用，前端开发针对后端模块分包，但仅仅只需要一个出口调用
   * @tips 每一个入口是否生成一个模块 `useModule`
   * @default true
   */
  splitApi?: boolean
}

export interface GenerateContext extends GenerateConfig {
  /**
   * 根路径
   */
  rootPath: string
  /**
   * 配置信息
   */
  config: GenerateConfig
  /**
   * `eta`模板地址
   */
  templatePath: string
  /**
   * 生成输出路径
    */
  modulePath: string | ArrayInputOrOutputModel[]
  /**
   * 生成输出路径
    */
  entryType: EntryType
  /**
   * 入口是否是数组类型
   */
  isArrayInput: boolean
  /**
   * 出口是否是数组类型
   */
  isArrayOutput: boolean
  /**
   * 运行环境
   */
  env: Env
  /**
   * 是否`window`系统,路径存在问题`\`
   */
  isWin: boolean
}

/**
 * @description 多url入口,参数类型
 */
export interface ArrayInputOrOutputModel {
  /**
   * @description 模块名和输出文件夹名字
   */
  dirName: string
  /**
   * @description 入口地址/输出地址
   */
  path: string
}

/**
 * @description 入口类型
 */
export type EntryType = 'input' | 'url' | 'spec'

/**
 * @description 执行环境
 */
export type Env = 'dev' | 'debug' | 'npm'

/**
 * @description 生成出口的对应信息
 */
export interface GenerateOutput extends GenerateApiOutput {
  output: string
  modulePath: string
  splitApi: boolean
}
