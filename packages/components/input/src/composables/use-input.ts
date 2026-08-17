import { computed, shallowRef, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { inputTypes } from '../input'
import { useInputEvent } from './use-input-event'
import { useInputClearable } from './use-input-clearable'
import type { InputEmitsFn, InputProps, InputValue } from '../input'

export const useInput = (props: InputProps, emit: InputEmitsFn) => {
  const localValue = shallowRef<InputValue>(props.modelValue)
  const committedValue = shallowRef<InputValue>(props.modelValue)

  const countLimit = computed(() => {
    const value = props.maxLength ?? props.maxlength
    if (value === undefined || value === null || value === '') return undefined

    const limit = Number(value)
    return Number.isFinite(limit) && limit >= 0 ? Math.floor(limit) : undefined
  })

  const countValue = (value: string) => {
    const count = props.countMethod?.({ value }) ?? value.length
    return Number.isFinite(count) && count >= 0 ? count : value.length
  }

  const limitValue = (value: string) => {
    const limit = countLimit.value
    if (
      !props.countMethod ||
      limit === undefined ||
      countValue(value) <= limit
    ) {
      return value
    }

    const units = Array.from(value)
    let start = 0
    let end = units.length

    // Custom counters are expected to be monotonic for successive prefixes.
    // Binary search keeps byte/encoding counters fast for long pasted values.
    while (start < end) {
      const middle = Math.ceil((start + end) / 2)
      const prefix = units.slice(0, middle).join('')
      if (countValue(prefix) <= limit) start = middle
      else end = middle - 1
    }

    return units.slice(0, start).join('')
  }

  const numberRange = computed(() => {
    const min = Number(props.min)
    const max = Number(props.max)
    const normalizedMin =
      props.min !== undefined && props.min !== '' && Number.isFinite(min)
        ? min
        : undefined
    const normalizedMax =
      props.max !== undefined && props.max !== '' && Number.isFinite(max)
        ? max
        : undefined

    if (
      normalizedMin !== undefined &&
      normalizedMax !== undefined &&
      normalizedMin > normalizedMax
    ) {
      return undefined
    }

    return { min: normalizedMin, max: normalizedMax }
  })

  const limitNumberRange = (value: InputValue): InputValue => {
    if (
      props.type !== 'number' ||
      value === '' ||
      value === null ||
      value === undefined ||
      !numberRange.value
    ) {
      return value
    }

    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) return value

    const { min, max } = numberRange.value
    const limitedValue = Math.min(
      max ?? Number.POSITIVE_INFINITY,
      Math.max(min ?? Number.NEGATIVE_INFINITY, numericValue),
    )

    if (Object.is(limitedValue, numericValue)) return value
    return typeof value === 'number' ? limitedValue : String(limitedValue)
  }

  const normalizeValue = (value: InputValue): InputValue => {
    const lengthLimitedValue =
      typeof value === 'string' ? limitValue(value) : value
    return limitNumberRange(lengthLimitedValue)
  }

  const nativeMaxLength = computed(() =>
    props.countMethod ? undefined : countLimit.value,
  )

  watch(
    () => props.modelValue,
    (value) => {
      localValue.value = value
      committedValue.value = value
    },
  )

  const model = computed({
    get: () => localValue.value,
    set: (value: string | number | null | undefined) => {
      if (props.disabled || props.loading) return
      const nextValue = normalizeValue(value)
      if (Object.is(localValue.value, nextValue)) return

      localValue.value = nextValue
      if (props.immediate) {
        committedValue.value = nextValue
        emit(UPDATE_MODEL_EVENT, nextValue)
      }
    },
  })

  const commitModelValue = (value: InputValue = localValue.value) => {
    if (props.disabled || props.loading) return
    const nextValue = normalizeValue(value)
    localValue.value = nextValue
    if (Object.is(committedValue.value, nextValue)) return
    committedValue.value = nextValue
    emit(UPDATE_MODEL_EVENT, nextValue)
  }

  const hovering = shallowRef(false)
  const inputRef = shallowRef<HTMLInputElement>()

  const isVisiblePassword = shallowRef(false)

  const {
    blur,
    handleBlur: handleNativeBlur,

    handleInput: handleNativeInput,
    handleChange,

    focused,
    focus,
    handleFocus,

    select,
    handleKeydown,
  } = useInputEvent({ inputRef })

  const composing = shallowRef(false)
  const handleCompositionStart = () => {
    composing.value = true
  }
  const handleCompositionEnd = (event: CompositionEvent) => {
    composing.value = false
    handleInput(event)
  }
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (!composing.value && !(event as InputEvent).isComposing) {
      model.value = target.value
      target.value = String(model.value ?? '')
    }
    handleNativeInput(event)
  }

  const handleBlur = (event: FocusEvent) => {
    if (!props.immediate) commitModelValue()
    handleNativeBlur(event)
  }

  const { showClear } = useInputClearable(props, {
    hovering,
    focused,
    model,
  })

  const clear = () => {
    if (props.disabled || props.loading) return
    localValue.value = ''
    commitModelValue('')
    emit('change', '')
    emit('clear')
    emit('input', '')
  }

  const handleMouseLeave = (evt: MouseEvent) => {
    hovering.value = false
    emit('mouseleave', evt)
  }
  const handleMouseEnter = (evt: MouseEvent) => {
    hovering.value = true
    emit('mouseenter', evt)
  }

  const inputType = computed(() => {
    if (props.showPassword || props.type === 'password') {
      if (!isVisiblePassword.value) return 'password'
      return 'text'
    }
    return inputTypes.includes(props.type) ? props.type : 'text'
  })

  const clickIcon = (evs: Event) => {
    focus()
    emit('clickIcon', evs)
  }

  const isShowPassword = computed(
    () =>
      (props.showPassword || (props.type === 'password' && props.controls)) &&
      !props.disabled &&
      !props.loading &&
      Boolean(String(localValue.value)),
  )
  const handleShowPassword = () => {
    if (props.disabled || props.loading) return
    isVisiblePassword.value = !isVisiblePassword.value
    emit('toggle-visible', isVisiblePassword.value)
  }

  return {
    model,
    inputType,
    isVisiblePassword,
    inputRef,
    isShowPassword,
    focused,
    hovering,
    handleInput,
    handleCompositionStart,
    handleCompositionEnd,
    focus,
    handleFocus,
    handleKeydown,
    blur,
    handleBlur,
    handleChange,
    select,
    clickIcon,
    handleShowPassword,

    handleMouseLeave,
    handleMouseEnter,
    // clearable
    clear,
    commitModelValue,
    countLimit,
    countValue,
    nativeMaxLength,
    showClear,
  }
}
