import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type BreadcrumbItem from './breadcrumb-item.vue'

export const breadcrumbItemProps = buildProps({
  active: Boolean,
  disabled: Boolean,
  to: String,
  separator: {
    type: String,
    default: undefined,
  },
  hideSeparator: Boolean,
} as const)

export type BreadcrumbItemProps = ExtractPropTypes<typeof breadcrumbItemProps>
export type BreadcrumbItemInstance = InstanceType<typeof BreadcrumbItem>
