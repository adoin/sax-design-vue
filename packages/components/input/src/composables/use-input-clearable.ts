import { computed } from 'vue'
import type { Ref, WritableComputedRef } from 'vue'
import type { InputProps, InputValue } from '../input'

export const useInputClearable = (
  props: InputProps,
  {
    hovering,
    focused,
    model,
  }: {
    hovering: Ref<boolean>
    focused: Ref<boolean>
    model: WritableComputedRef<InputValue>
  },
) => {
  const showClear = computed(
    () =>
      (props.allowClear || props.clearable) &&
      !props.disabled &&
      !props.loading &&
      Boolean(String(model.value)) &&
      (focused.value || hovering.value),
  )

  return {
    showClear,
  }
}
