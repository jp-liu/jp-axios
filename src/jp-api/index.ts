import path from 'path'
import { generateModuleApi } from './generate'

const input = path.resolve(__dirname, './test/swagger.json')
const output = path.resolve(__dirname, './test/module')

generateModuleApi({ input, output })
