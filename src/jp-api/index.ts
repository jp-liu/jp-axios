import path from 'path'
import { generateModuleApi } from './generate'

const input = path.resolve(__dirname, './test/swagger.yaml')
const output = path.resolve(__dirname, './test/module')

generateModuleApi({ input, output })
