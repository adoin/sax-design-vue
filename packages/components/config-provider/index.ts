import { withInstall } from '@vuesax-alpha/utils'

import ConfigProvider from './src/config-provider'

export const SConfigProvider = withInstall(ConfigProvider)
export default SConfigProvider

export * from './src/config-provider'
