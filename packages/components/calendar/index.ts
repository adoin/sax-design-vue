import { withInstall } from '@vuesax-alpha/utils'
import Calendar from './src/calendar.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SCalendar: SFCWithInstall<typeof Calendar> = withInstall(Calendar)
export default SCalendar

export * from './src/calendar'
