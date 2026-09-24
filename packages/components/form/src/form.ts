import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useSizeProp } from '@vuesax-alpha/hooks'
import type { CSSProperties, ExtractPropTypes } from 'vue'
import type { RendererOptions } from './renderer'
import type { FieldPath, Recordable } from '../../types'

/** Dynamic fallback used when an application does not supply its own model type. */
export type FormModel = Recordable
export type FormValidator<Model extends object = FormModel> = (
  value: unknown,
  model: Model,
) => boolean | string | Promise<boolean | string>
export type FormRuleTrigger = 'blur' | 'change'
export interface FormRule<Model extends object = FormModel> {
  required?: boolean
  message?: string
  validator?: FormValidator<Model>
  trigger?: FormRuleTrigger | FormRuleTrigger[]
}
export type FormRules<Model extends object = FormModel> = Partial<
  Record<FieldPath<Model>, FormRule<Model> | FormRule<Model>[]>
>

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

export interface FormItemConfig<Model extends object = FormModel> {
  key?: string | number
  label?: string
  title?: string
  prop?: FieldPath<Model>
  field?: FieldPath<Model>
  description?: string
  rules?: FormRule<Model> | FormRule<Model>[]
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
    model: Model
    item: FormItemConfig<Model>
  }) => boolean
  disabled?: boolean | ((model: Model) => boolean)
  readonly?: boolean | ((model: Model) => boolean)
  class?: string | string[] | Record<string, boolean>
  style?: CSSProperties
  itemRender?: RendererOptions<Model>
  slots?: FormItemSlotConfig
  children?: FormItemConfig<Model>[]
}

export const formProps = buildProps({
  model: { type: definePropType<FormModel>(Object), required: true },
  size: useSizeProp,
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

type FormResolvedProps = ExtractPropTypes<typeof formProps>
export type FormProps<Model extends object = FormModel> = Omit<
  FormResolvedProps,
  'model' | 'rules' | 'items'
> & {
  model: Model
  rules: FormRules<Model>
  items: FormItemConfig<Model>[]
}
export interface FormInstance {
  validate: () => Promise<boolean>
  validateField: (
    prop: string,
    trigger?: FormRuleTrigger | 'submit',
  ) => Promise<boolean>
  clearValidate: (props?: string | string[]) => void
  resetFields: (event?: Event) => void
  submit: (event?: Event) => Promise<boolean>
  getErrors: () => Record<string, string>
}
