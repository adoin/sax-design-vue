import type { InjectionKey, Ref } from 'vue'
import type { FormModel, FormRuleTrigger } from './form'

export interface FormFieldContext {
  prop?: string
  error: Readonly<Ref<string>>
  validate: (trigger?: FormRuleTrigger | 'submit') => Promise<boolean>
  clearValidate: () => void
  resetField: () => void
  focus: () => void
}

export interface FormContext {
  model: Ref<FormModel>
  labelWidth: Ref<string | number>
  labelPosition: Ref<'left' | 'right' | 'top'>
  labelAlign: Ref<'left' | 'right'>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  showMessage: Ref<boolean>
  reserveErrorSpace: Ref<boolean>
  getRules: (prop: string) => unknown[]
  getValue: (prop: string) => unknown
  setValue: (prop: string, value: unknown) => void
  registerField: (field: FormFieldContext) => void
  unregisterField: (field: FormFieldContext) => void
  validateField: (
    prop: string,
    trigger?: FormRuleTrigger | 'submit',
  ) => Promise<boolean>
  emitValidate: (prop: string, valid: boolean, message: string) => void
}

export const formContextKey: InjectionKey<FormContext> =
  Symbol('formContextKey')
