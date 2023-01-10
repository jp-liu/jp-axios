import path from 'path'
import { generate } from '..'

// const input = path.resolve(__dirname, './swagger.yaml')
const input = path.resolve(__dirname, './swagger.json')
const output = path.resolve(__dirname, './module')

// generateModule({ input, output })
// generateModule({ input, output, useAxios: true })
// generate({ input, output, useAxios: true, unwrapResponse: false, splitApi: false })
generate({ input, output, useAxios: false })
