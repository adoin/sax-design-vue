import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Countdown from './countdown.vue'
export const countdownProps = buildProps({
  value: { type: Number, required: true },
  format: { type: String, default: 'HH:mm:ss' },
  autoStart: { type: Boolean, default: true },
} as const)
export const countdownEmits = {
  finish: () => true,
  change: (value: number) => typeof value === 'number',
}
export type CountdownProps = ExtractPropTypes<typeof countdownProps>
export type CountdownInstance = InstanceType<typeof Countdown>
