import path from 'path'
import { generateModuleApi } from '../generate'

const input = path.resolve(__dirname, './swagger.json')
const output = path.resolve(__dirname, './module')

generateModuleApi({ input, output })
