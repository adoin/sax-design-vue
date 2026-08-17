import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { PopperTriggerType } from '@vuesax-alpha/components/popper'

import type { ExtractPropTypes } from 'vue'
import type Breadcrumb from './breadcrumb.vue'

export interface BreadcrumbItem {
  title: string
  url?: string
  active?: boolean
  disabled?: boolean
  children?: BreadcrumbItem[]
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
  trigger: {
    type: definePropType<PopperTriggerType | PopperTriggerType[]>([
      String,
      Array,
    ]),
    default: 'hover',
  },
} as const)

export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>
export type BreadcrumbInstance = InstanceType<typeof Breadcrumb>
