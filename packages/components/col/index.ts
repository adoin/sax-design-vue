import { withInstall } from '@vuesax-alpha/utils'
import Col from './src/col.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SCol: SFCWithInstall<typeof Col> = withInstall(Col)
export default SCol

export * from './src/col'
