import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type List from './list.vue'

export const listProps = buildProps({} as const)

export type ListProps = ExtractPropTypes<typeof listProps>
export type ListInstance = InstanceType<typeof List>
