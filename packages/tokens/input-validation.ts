import type { InjectionKey, Ref } from 'vue'

export interface InputValidationControl {
  validate: (reveal?: boolean) => string
  clear: () => void
}
export interface InputValidationContext {
  error: Readonly<Ref<string>>
  messageId: string
  register: (control: InputValidationControl) => void
  unregister: (control: InputValidationControl) => void
  validate: () => Promise<boolean>
}
export const inputValidationContextKey: InjectionKey<InputValidationContext> =
  Symbol('inputValidation')
