import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Form from './form.vue'

export type FormModel = Record<string, unknown>
export type FormValidator = (
  value: unknown,
  model: FormModel,
) => boolean | string | Promise<boolean | string>
export interface FormRule {
  required?: boolean
  message?: string
  validator?: FormValidator
}
export type FormRules = Record<string, FormRule | FormRule[]>

export const formProps = buildProps({
  model: { type: definePropType<FormModel>(Object), required: true },
  rules: { type: definePropType<FormRules>(Object), default: () => ({}) },
  labelWidth: { type: [String, Number] as any, default: 96 },
  inline: Boolean,
  disabled: Boolean,
  showMessage: { type: Boolean, default: true },
} as const)

export const formEmits = {
  validate: (prop: string, valid: boolean, message: string) =>
    typeof prop === 'string' &&
    typeof valid === 'boolean' &&
    typeof message === 'string',
}

export type FormProps = ExtractPropTypes<typeof formProps>
export type FormInstance = InstanceType<typeof Form>
