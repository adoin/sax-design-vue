import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'
import { inputValidationContextKey } from '@vuesax-alpha/tokens'
import type { Ref } from 'vue'
import type { InputProps } from '../input'

export const useInputValidation = (
  props: InputProps,
  input: Ref<HTMLInputElement | undefined>,
  value: Ref<unknown>,
) => {
  const context = inject(inputValidationContextKey, undefined)
  const { t } = useLocale()
  const error = ref('')
  let touched = false
  const validate = (reveal = true) => {
    if (reveal) touched = true
    if (!touched) return ''
    const element = input.value
    if (!element || !element.willValidate || element.validity.valid) {
      error.value = ''
      return ''
    }
    const validity = element.validity
    const kind = validity.valueMissing
      ? 'required'
      : validity.typeMismatch && element.type === 'email'
        ? 'email'
        : validity.typeMismatch && element.type === 'url'
          ? 'url'
          : validity.patternMismatch
            ? 'pattern'
            : 'invalid'
    error.value = props.validationMessage || t(`vs.inputValidation.${kind}`)
    return error.value
  }
  const clear = () => {
    touched = false
    error.value = ''
  }
  const control = { validate, clear }
  const enabled = computed(
    () =>
      ['email', 'url'].includes(props.type) ||
      Boolean(props.pattern || props.required),
  )
  onMounted(() => {
    if (enabled.value) context?.register(control)
  })
  watch(enabled, (value) => {
    if (value) context?.register(control)
    else {
      const wasTouched = touched
      context?.unregister(control)
      clear()
      if (wasTouched && context) nextTick(() => context.validate())
    }
  })
  onBeforeUnmount(() => context?.unregister(control))
  watch(
    () => [
      props.type,
      props.pattern,
      props.required,
      props.disabled,
      props.readonly,
      props.validationMessage,
    ],
    () => {
      if (touched)
        nextTick(() => {
          validate(false)
          if (context) context.validate()
        })
    },
    { flush: 'post' },
  )
  watch(
    value,
    () => {
      if (touched) nextTick(() => validate(false))
    },
    { flush: 'post' },
  )
  return {
    validationError: computed(() => error.value || context?.error.value || ''),
    localValidationError: computed(() => (context ? '' : error.value)),
    formMessageId: context?.messageId,
    validate: () => !validate(),
    clearValidate: clear,
    validateBlur: () => {
      if (!context) validate()
    },
    validateInvalid: () => {
      if (context) context.validate()
      else validate()
    },
  }
}
