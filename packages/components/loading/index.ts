import { loading } from './src/method'
import { vLoading } from './src/directive'

import type { App } from 'vue'

export const SLoading = {
  install(app: App) {
    app.directive('loading', vLoading)
    app.config.globalProperties.$loading = loading
  },
  directive: vLoading,
  service: loading,
}

export default SLoading
export { vLoading, vLoading as SLoadingDirective, loading as SLoadingFn }

export * from './src/loading'
