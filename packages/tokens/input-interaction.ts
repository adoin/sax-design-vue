import type { InjectionKey, Ref } from 'vue'

export interface InputInteractionContext {
  /** A composed control remains active while its floating panel is open. */
  active: Readonly<Ref<boolean>>
  /** Only trigger inputs participate; inputs inside the panel remain independent. */
  triggerRef: Readonly<Ref<HTMLElement | undefined>>
}

export const inputInteractionContextKey: InjectionKey<InputInteractionContext> =
  Symbol('inputInteraction')
