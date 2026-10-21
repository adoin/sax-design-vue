import { withInstall } from '@vuesax-alpha/utils'
import PrintPageBreak from './src/print-page-break.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SPrintPageBreak: SFCWithInstall<typeof PrintPageBreak> =
  withInstall(PrintPageBreak)
export default SPrintPageBreak
