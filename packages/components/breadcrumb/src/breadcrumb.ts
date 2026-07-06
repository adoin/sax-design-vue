import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Breadcrumb from './breadcrumb.vue'

export interface BreadcrumbItem {
  title: string
  url?: string
  active?: boolean
  disabled?: boolean
}

export const breadcrumbProps = buildProps({
  items: {
    type: definePropType<BreadcrumbItem[]>(Array),
    default: () => [],
  },
  separator: {
    type: String,
    default: '/',
  },
  color: {
    type: String,
    default: 'primary',
  },
  align: {
    type: String,
    values: ['left', 'center', 'right'],
    default: 'left',
  },
} as const)

export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>
export type BreadcrumbInstance = InstanceType<typeof Breadcrumb>
