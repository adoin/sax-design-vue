import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { CSSProperties, ExtractPropTypes } from 'vue'
import type Form from './form.vue'
import type { FormItemRenderOptions } from './renderer'

export type FormModel = Record<string, unknown>
export type FormValidator = (
  value: unknown,
  model: FormModel,
) => boolean | string | Promise<boolean | string>
export type FormRuleTrigger = 'blur' | 'change'
export interface FormRule {
  required?: boolean
  message?: string
  validator?: FormValidator
  trigger?: FormRuleTrigger | FormRuleTrigger[]
}
export type FormRules = Record<string, FormRule | FormRule[]>

export const FORM_DEFAULT_LABEL_WIDTH = 'calc(4em + 24px)'

export type FormItemSpan =
  | number
  | {
      xs?: number
      sm?: number
      md?: number
      lg?: number
      xl?: number
    }

export interface FormItemSlotConfig {
  label?: string
  default?: string
  error?: string
}

export interface FormItemConfig {
  key?: string | number
  label?: string
  title?: string
  prop?: string
  field?: string
  description?: string
  rules?: FormRule | FormRule[]
  required?: boolean
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  span?: FormItemSpan
  vertical?: boolean
  nested?: boolean
  align?: 'left' | 'center' | 'right'
  reserveErrorSpace?: boolean
  visible?: boolean
  visibleMethod?: (params: {
    model: FormModel
    item: FormItemConfig
  }) => boolean
  disabled?: boolean | ((model: FormModel) => boolean)
  readonly?: boolean | ((model: FormModel) => boolean)
  class?: string | string[] | Record<string, boolean>
  style?: CSSProperties
  itemRender?: FormItemRenderOptions
  slots?: FormItemSlotConfig
  children?: FormItemConfig[]
}

export const formProps = buildProps({
  model: { type: definePropType<FormModel>(Object), required: true },
  rules: { type: definePropType<FormRules>(Object), default: () => ({}) },
  items: {
    type: definePropType<FormItemConfig[]>(Array),
    default: () => [],
  },
  labelWidth: {
    type: definePropType<string | number>([String, Number]),
    default: FORM_DEFAULT_LABEL_WIDTH,
  },
  labelPosition: {
    type: String,
    values: ['left', 'right', 'top'] as const,
    default: 'right',
  },
  labelAlign: {
    type: String,
    values: ['left', 'right'] as const,
    default: 'right',
  },
  inline: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  showMessage: { type: Boolean, default: true },
  reserveErrorSpace: { type: Boolean, default: true },
  scrollToError: { type: Boolean, default: true },
  columnGap: { type: [String, Number], default: 16 },
  rowGap: { type: [String, Number], default: 4 },
} as const)

export const formEmits = {
  validate: (prop: string, valid: boolean, message: string) =>
    typeof prop === 'string' &&
    typeof valid === 'boolean' &&
    typeof message === 'string',
  submit: (model: FormModel, event?: Event) =>
    !!model && (!event || event instanceof Event),
  invalidSubmit: (
    errors: Record<string, string>,
    model: FormModel,
    event?: Event,
  ) => !!errors && !!model && (!event || event instanceof Event),
  reset: (model: FormModel, event?: Event) =>
    !!model && (!event || event instanceof Event),
}

export type FormProps = ExtractPropTypes<typeof formProps>
export type FormInstance = InstanceType<typeof Form>
