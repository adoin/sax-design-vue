import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Pulldown from './pulldown.vue'

export const pulldownProps = buildProps({
  modelValue: Boolean,
  trigger: {
    type: String,
    values: ['click', 'hover', 'focus', 'contextmenu'] as const,
    default: 'click',
  },
  placement: { type: String, default: 'bottom-start' },
  offset: { type: Number, default: 8 },
  disabled: Boolean,
  teleported: { type: Boolean, default: true },
  fit: Boolean,
} as const)

export const pulldownEmits = {
  'update:modelValue': (value: boolean) => typeof value === 'boolean',
  show: () => true,
  hide: () => true,
}

export type PulldownProps = ExtractPropTypes<typeof pulldownProps>
export type PulldownInstance = InstanceType<typeof Pulldown>
