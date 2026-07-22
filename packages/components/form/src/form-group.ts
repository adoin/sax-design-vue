import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type FormGroup from './form-group.vue'

export const formGroupProps = buildProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  border: { type: Boolean, default: true },
  collapsible: Boolean,
  collapsed: Boolean,
} as const)

export const formGroupEmits = {
  'update:collapsed': (value: boolean) => typeof value === 'boolean',
}

export type FormGroupProps = ExtractPropTypes<typeof formGroupProps>
export type FormGroupInstance = InstanceType<typeof FormGroup>
