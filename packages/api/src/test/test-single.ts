import path from 'path'
import { generateModule } from '../generate'

const input = path.resolve(__dirname, './swagger.json')
const output = path.resolve(__dirname, './module')

generateModule({ input, output, useAxios: true })
