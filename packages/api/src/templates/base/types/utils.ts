/**
 * @description 获取函数参数类型
 */
export type GetParams<T extends Function> = T extends (...args: infer A) => any
  ? A
  : never

/**
 * @description 生成路径节点
 */
export type GenNode<
  K extends string | number,
  IsRoot extends boolean
> = IsRoot extends true
  ? `${K}`
  : `/${K}` | (K extends number ? `[${K}]` | `/[${K}]` : never)

/**
 * @description 提供对象类型的路径
 * @example ObjectKeyPaths<{ user: { getUserInfo: number } }> // 'user' | 'user/getUserInfo'
 */
export type ObjectKeyPaths<
  T extends object,
  IsRoot extends boolean = true,
  K extends keyof T = keyof T
> = K extends string | number
  ?
  | GenNode<K, IsRoot>
  | (T[K] extends object
    ? `${GenNode<K, IsRoot>}${ObjectKeyPaths<T[K], false>}`
    : never)
  : never

/**
 * @description 根据提供路径查找对象对应属性类型
 * @example Get<{ foo: { bar: number } }, 'foo/bar'> // number
 */
export type Get<T, K> = K extends `${infer A}/${infer B}`
  ? A extends keyof T
    ? Get<T[A], B>
    : never
  : K extends keyof T
    ? T[K]
    : never
