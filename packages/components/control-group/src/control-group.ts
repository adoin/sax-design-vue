import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type ControlGroup from './control-group.vue'

export const controlGroupProps = buildProps({
  /** @description make the group fill its container */
  block: Boolean,
} as const)

export type ControlGroupProps = ExtractPropTypes<typeof controlGroupProps>
export type ControlGroupInstance = InstanceType<typeof ControlGroup>
