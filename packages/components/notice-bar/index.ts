import { withInstall } from '@vuesax-alpha/utils'
import NoticeBar from './src/notice-bar.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SNoticeBar: SFCWithInstall<typeof NoticeBar> =
  withInstall(NoticeBar)
export default SNoticeBar

export * from './src/notice-bar'
