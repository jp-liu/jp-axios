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
   */
  overwrite?: boolean
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
   * 是否覆盖,除`module`文件夹外的其他文件,默认:false
   * 其他文件都是提供的模板,会存在变更,所以默认不覆盖
   */
  overwrite?: boolean
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
