import type { InjectionKey, Ref } from 'vue'

export interface FormFieldContext {
  prop?: string
  validate: () => Promise<boolean>
  clearValidate: () => void
  resetField: () => void
}

export interface FormContext {
  labelWidth: Ref<string | number>
  disabled: Ref<boolean>
  showMessage: Ref<boolean>
  getRules: (prop: string) => unknown[]
  getValue: (prop: string) => unknown
  setValue: (prop: string, value: unknown) => void
  registerField: (field: FormFieldContext) => void
  unregisterField: (field: FormFieldContext) => void
  emitValidate: (prop: string, valid: boolean, message: string) => void
}

export const formContextKey: InjectionKey<FormContext> =
  Symbol('formContextKey')
