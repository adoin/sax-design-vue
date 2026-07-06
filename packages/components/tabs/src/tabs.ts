import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useColorProp } from '@vuesax-alpha/hooks'
import { buildProps, isNumber, isString } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Tabs from './tabs.vue'

export const tabsProps = buildProps({
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  color: { ...useColorProp, default: 'primary' },
  alignment: {
    type: String,
    values: ['left', 'center', 'right', 'fixed'],
    default: 'left',
  },
  position: {
    type: String,
    values: ['top', 'bottom', 'left', 'right'],
    default: 'top',
  },
} as const)

export const tabsEmits = {
  [UPDATE_MODEL_EVENT]: (val: string | number) =>
    isString(val) || isNumber(val),
  change: (val: string | number) => isString(val) || isNumber(val),
}

export type TabsProps = ExtractPropTypes<typeof tabsProps>
export type TabsInstance = InstanceType<typeof Tabs>
