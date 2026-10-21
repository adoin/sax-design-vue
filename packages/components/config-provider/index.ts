import { withInstall } from '@vuesax-alpha/utils'

import ConfigProvider from './src/config-provider'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SConfigProvider: SFCWithInstall<typeof ConfigProvider> =
  withInstall(ConfigProvider)
export default SConfigProvider

export * from './src/config-provider'
