import { computed, inject, toRefs } from 'vue'

import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { radioGroupContextKey } from '@vuesax-alpha/tokens'
import type { RadioEmitFn, RadioProps } from './radio'
import type { Ref } from 'vue'

export const useRadio = (
  props: RadioProps,
  emit: RadioEmitFn,
  loadingVisible: Ref<boolean>,
) => {
  const radioGroup = inject(radioGroupContextKey, undefined)
  const { disabled } = toRefs(props)
  const loading = computed(() => props.loading || loadingVisible.value)
  const isDisabled = computed(
    () => disabled.value || loading.value || radioGroup?.disabled.value,
  )
  const model = computed({
    get: () => radioGroup?.modelValue.value ?? props.modelValue,
    set: () => {
      if (isDisabled.value) return

      if (radioGroup) {
        radioGroup.changeEvent(props.value)
        emit(CHANGE_EVENT, props.value)
        return
      }

      emit(UPDATE_MODEL_EVENT, props.value)
      emit(CHANGE_EVENT, props.value)
    },
  })

  const checked = computed(() => model.value === props.value)
  const radioName = computed(() => props.name || radioGroup?.name.value)

  return {
    disabled,
    isDisabled,
    checked,
    loading,
    model,
    radioName,
  }
}
