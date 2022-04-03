// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import modules, { useModule } from './module/http-client'
export { instance } from './instance'

export { modules, useModule }
export default {
  install(Vue: any) {
    Vue.prototype.$api = modules
    Vue.prototype.$useModule = useModule
  },
}
