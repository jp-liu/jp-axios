
import { resolve } from 'path'
import { generateApi } from 'swagger-typescript-api'
generateApi({
  modular: true,
  input: resolve(__dirname, './test/swagger.json'),
  output: resolve(__dirname, './module'),
  extractRequestParams: true,
  // because this script was called from package.json folder
  templates: './src/jp-axios-module/templates/eta',
})
  .then(() => {
    // 1.将`base`文件夹内的内容拷贝到`outputPath`文件夹内
    // 2.将`module`文件夹的内容剪切到`outputPath`文件夹内
  })
