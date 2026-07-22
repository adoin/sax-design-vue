import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Print from './print.vue'

export const printProps = buildProps({
  title: {
    type: String,
    default: typeof document === 'undefined' ? 'Print' : document.title,
  },
  printStyle: { type: String, default: '' },
  autoClose: { type: Boolean, default: true },
} as const)

export const printEmits = {
  beforePrint: () => true,
  afterPrint: () => true,
  error: (error: Error) => error instanceof Error,
}

export type PrintProps = ExtractPropTypes<typeof printProps>
export type PrintInstance = InstanceType<typeof Print>
