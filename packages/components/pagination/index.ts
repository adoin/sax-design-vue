import { withInstall } from '@vuesax-alpha/utils'
import Pagination from './src/pagination'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SPagination: SFCWithInstall<typeof Pagination> =
  withInstall(Pagination)
export default SPagination

export * from './src/pagination'
