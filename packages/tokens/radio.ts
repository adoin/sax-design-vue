import type { InjectionKey, Ref, WritableComputedRef } from 'vue'

export type RadioGroupValue = string | number | boolean

export interface RadioGroupContext {
  modelValue: WritableComputedRef<RadioGroupValue>
  disabled: Ref<boolean>
  name: Ref<string>
  changeEvent: (value: RadioGroupValue) => void
}

export const radioGroupContextKey = Symbol.for(
  'sax-design-vue.radio-group',
) as InjectionKey<RadioGroupContext>
