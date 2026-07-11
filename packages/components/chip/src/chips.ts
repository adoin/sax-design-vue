import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useColorProp } from '@vuesax-alpha/hooks'
import { buildProps, definePropType, isArray } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Chips from './chips.vue'

export const chipsProps = buildProps({
  modelValue: {
    type: definePropType<string[]>(Array),
    default: () => [],
  },
  color: { ...useColorProp, default: 'primary' },
  placeholder: {
    type: String,
    default: '',
  },
  iconPack: {
    type: String,
    default: 'material-icons',
  },
  removeIcon: {
    type: String,
    default: 'close',
  },
} as const)

export const chipsEmits = {
  [UPDATE_MODEL_EVENT]: (val: string[]) => isArray(val),
}

export type ChipsProps = ExtractPropTypes<typeof chipsProps>
export type ChipsInstance = InstanceType<typeof Chips>
