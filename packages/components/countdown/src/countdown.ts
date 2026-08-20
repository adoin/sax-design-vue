import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Countdown from './countdown.vue'

export type CountdownEffect = 'default' | 'flip' | 'fade' | 'particle' | 'slide'

export interface CountdownTime {
  remaining: number
  totalSeconds: number
  totalMinutes: number
  totalHours: number
  totalDays: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type CountdownFormatter = (time: Readonly<CountdownTime>) => string

export const countdownProps = buildProps({
  value: { type: Number, required: true },
  format: { type: String, default: 'HH:mm:ss' },
  formatter: {
    type: definePropType<CountdownFormatter>(Function),
  },
  autoStart: { type: Boolean, default: true },
  speed: {
    type: Number,
    default: 1,
    validator: (value: number) => Number.isFinite(value) && value >= 0,
  },
  effect: {
    type: definePropType<CountdownEffect>(String),
    values: ['default', 'flip', 'fade', 'particle', 'slide'],
    default: 'default',
  },
} as const)
export const countdownEmits = {
  finish: () => true,
  change: (value: number) => typeof value === 'number',
}
export type CountdownProps = ExtractPropTypes<typeof countdownProps>
export type CountdownInstance = InstanceType<typeof Countdown>
