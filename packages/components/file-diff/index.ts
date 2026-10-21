import { withInstall } from '@vuesax-alpha/utils'
import FileDiff from './src/file-diff.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SFileDiff: SFCWithInstall<typeof FileDiff> = withInstall(FileDiff)
export default SFileDiff
export * from './src/file-diff'
