import { computed, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import type {
  InputAutocompleteOption,
  InputEmitsFn,
  InputProps,
  InputValue,
} from '../input'

export const useInputAutocomplete = (
  props: InputProps,
  context: {
    model: Ref<InputValue>
    focused: Ref<boolean>
    loading?: Ref<boolean>
    composing: Ref<boolean>
    inputRef: Ref<HTMLInputElement | undefined>
    commitModelValue: (value?: InputValue) => void
    emit: InputEmitsFn
  },
) => {
  const dismissed = shallowRef(false)
  const activeIndex = shallowRef(-1)
  const enabled = computed(
    () =>
      Array.isArray(props.autocomplete) &&
      props.type !== 'password' &&
      !props.showPassword &&
      props.type !== 'number',
  )
  const keyword = computed(() => String(context.model.value ?? ''))
  const available = computed(
    () =>
      enabled.value &&
      !props.disabled &&
      !(context.loading?.value ?? props.loading) &&
      !props.readonly &&
      props.editable &&
      props.type !== 'password' &&
      !props.showPassword &&
      props.type !== 'number',
  )
  const options = computed<InputAutocompleteOption[]>(() => {
    if (!enabled.value) return []
    const query = keyword.value.trim().toLocaleLowerCase()
    const source = props.autocomplete as Exclude<
      InputProps['autocomplete'],
      string | undefined
    >
    const matches: InputAutocompleteOption[] = []
    const limit = Math.max(1, Math.floor(props.autocompleteLimit) || 20)
    for (const item of source) {
      const option = typeof item === 'string' ? { value: item } : item
      if (
        !query ||
        [option.value, option.label, option.description].some((text) =>
          text?.toLocaleLowerCase().includes(query),
        )
      ) {
        matches.push(option)
        if (matches.length >= limit) break
      }
    }
    return matches
  })
  const canOpen = computed(
    () =>
      available.value &&
      context.focused.value &&
      !context.composing.value &&
      keyword.value.trim().length >= Math.max(0, props.autocompleteMinLength) &&
      options.value.length > 0,
  )
  const visible = computed({
    get: () => canOpen.value && !dismissed.value,
    set: (value) => {
      dismissed.value = !value
      if (!value) activeIndex.value = -1
    },
  })
  const close = () => {
    visible.value = false
  }
  const open = () => {
    if (available.value) dismissed.value = false
  }
  watch(
    [keyword, context.focused],
    () => {
      dismissed.value = false
      activeIndex.value = -1
    },
    { flush: 'sync' },
  )
  watch(
    options,
    () => {
      activeIndex.value = -1
    },
    { flush: 'sync' },
  )
  watch(canOpen, (value) => {
    if (!value) activeIndex.value = -1
  })

  const pick = (option: InputAutocompleteOption) => {
    if (!available.value || context.composing.value || option.disabled) return
    context.model.value = option.value
    context.commitModelValue()
    const value = String(context.model.value ?? '')
    if (context.inputRef.value) context.inputRef.value.value = value
    close()
    context.emit('input', value)
    context.emit('change', value)
    context.emit('autocomplete-select', option)
  }
  const keydown = (event: KeyboardEvent) => {
    if (
      !available.value ||
      context.composing.value ||
      event.isComposing ||
      event.keyCode === 229
    )
      return false
    if (event.key === 'Tab') {
      close()
      return false
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      open()
      if (!visible.value) return false
      const enabledIndexes: number[] = []
      options.value.forEach((option, index) => {
        if (!option.disabled) enabledIndexes.push(index)
      })
      if (!enabledIndexes.length) return false
      const current = enabledIndexes.indexOf(activeIndex.value)
      const next =
        event.key === 'ArrowDown'
          ? (current + 1) % enabledIndexes.length
          : current <= 0
            ? enabledIndexes.length - 1
            : current - 1
      activeIndex.value = enabledIndexes[next]
    } else if (visible.value && event.key === 'Escape') {
      close()
    } else if (
      visible.value &&
      activeIndex.value >= 0 &&
      event.key === 'Enter'
    ) {
      pick(options.value[activeIndex.value])
    } else {
      return false
    }
    event.preventDefault()
    event.stopPropagation()
    return true
  }
  return {
    enabled,
    keyword,
    options,
    visible,
    activeIndex,
    open,
    close,
    pick,
    keydown,
  }
}
