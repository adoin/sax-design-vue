import { buildProps, definePropType, isNumber } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type LogoLoading from './logo-loading.vue'

export const logoLoadingPhases = [
  'idle',
  'starting',
  'running',
  'stopping',
] as const

export type LogoLoadingPhase = (typeof logoLoadingPhases)[number]

export const logoLoadingProps = buildProps({
  /** Start the logo-to-orbit loading motion. */
  active: { type: Boolean, default: true },
  /** Square display size. Numbers use pixels; strings accept any CSS length. */
  size: {
    type: definePropType<number | string>([Number, String]),
    default: '1em',
  },
  /** Playback multiplier for the complete motion. */
  speed: {
    type: Number,
    default: 2.5,
    validator: (value: number) => isNumber(value) && value > 0,
  },
  /** Override the operating-system reduced-motion preference. */
  reducedMotion: { type: Boolean, default: undefined },
  /** Accessible status label. Omit it when the parent already exposes aria-busy. */
  label: String,
} as const)

export const logoLoadingEmits = {
  phaseChange: (phase: LogoLoadingPhase) => logoLoadingPhases.includes(phase),
  restored: () => true,
}

export type LogoLoadingProps = ExtractPropTypes<typeof logoLoadingProps>
export type LogoLoadingInstance = InstanceType<typeof LogoLoading>
