import { computed } from 'vue'
import {
  CHANGE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
} from '@vuesax-alpha/constants'
import type { SwitchEmitFn, SwitchProps } from './switch'

export const useSwitch = (props: SwitchProps, emit: SwitchEmitFn) => {
  const checked = computed(() => props.modelValue === props.activeValue)
  const isLoading = computed(() => props.loading)
  const isDisabled = computed(() => props.disabled || isLoading.value)
  const isIndeterminate = computed(
    () =>
      props.indeterminate &&
      ![props.activeValue, props.inactiveValue].includes(props.modelValue),
  )

  const handleChange = () => {
    const val = checked.value ? props.inactiveValue : props.activeValue
    emit(UPDATE_MODEL_EVENT, val)
    emit(CHANGE_EVENT, val)
    emit(INPUT_EVENT, val)
  }

  return {
    checked,
    isDisabled,
    isIndeterminate,
    isLoading,

    handleChange,
  }
}
