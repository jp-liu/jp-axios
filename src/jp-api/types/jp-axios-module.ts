export interface GenerateConfig {
  /**
   * swagger 文档地址,可以使`json`或`yaml`,输入绝对路径
   */
  input: string
  /**
   * url to swagger schema
   */
  url: string
  /**
   * swagger schema JSON
   */
  spec: import('swagger-schema-official').Spec
  /**
   * 生成输出路径
   */
  output: string
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
   * swagger 文档地址,可以使`json`或`yaml`,输入绝对路径
   */
  input: string
  /**
   * url to swagger schema
   */
  url: string
  /**
   * swagger schema JSON
   */
  spec: import('swagger-schema-official').Spec
  /**
   * 生成输出路径
    */
  output: string
  /**
   * 是否覆盖,除`module`文件夹外的其他文件,默认:false
   * 其他文件都是提供的模板,会存在变更,所以默认不覆盖
   */
  overwrite?: boolean
}
