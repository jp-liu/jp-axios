export function handlerError(errorInfo: any, type: 'error' | 'success') {
  // 接口调用错误
  if (type === 'error') {
    // 弹出错误提示,做下错误处理等等
    // Message.error(errorInfo.message)
    // 打印错误日志
    console.log(errorInfo)
  }

  // 服务器验证错误
  if (type === 'success') {
    // 弹出错误提示,做下错误处理等等
    // Message.error(errorInfo.message)
    // 打印错误日志
    console.log(errorInfo)
  }
}
