import { defineConfig } from 'tsup'
export default defineConfig({
  entry: [
    './packages/axios/src/index.ts',
    './packages/hook/src/index.ts',
    './packages/api/src/index.ts'
  ],
  splitting: false,
  sourcemap: true,
  clean: true,
})
