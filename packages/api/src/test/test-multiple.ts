import path from 'path'
import { generateModule } from '../generate'

const input = path.resolve(__dirname, './swagger.json')
const output = path.resolve(__dirname, './module')

generateModule({
  input: [
    {
      dirName: 'test1',
      path: input
    },
    {
      dirName: 'test2',
      path: input
    }
  ],
  output,
  splitApi: false,
  useAxios: true,
  unwrapResponse: false
})
