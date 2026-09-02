import { computed, onMounted } from 'vue'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { isArray } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import type { TableEmitFn, TableProps } from './../table'

export const useTable = (props: TableProps, emit: TableEmitFn) => {
  const ns = useNamespace('table')
  const isMultipleSelected = computed(
    () => props.multiple && isArray(props.modelValue),
  )

  const tableKls = computed(() => [
    ns.b(),
    ns.is('striped', props.striped),
    ns.is('multiple', props.multiple),
    ns.is('data-mode'),
    ns.is('virtual', props.virtualConfig !== false),
  ])

  const selectedMultiple = (value: unknown) => {
    const current = isArray(props.modelValue) ? props.modelValue : []
    const index = current.indexOf(value as never)
    const next =
      index >= 0
        ? current.filter((_, itemIndex) => itemIndex !== index)
        : [...current, value]
    emit(UPDATE_MODEL_EVENT, next)
  }

  const selected = (value: unknown) => {
    if (props.multiple) selectedMultiple(value)
    else emit(UPDATE_MODEL_EVENT, value)
  }

  onMounted(() => {
    if (props.multiple && !isArray(props.modelValue)) {
      const value = props.modelValue ? [props.modelValue] : []
      emit(UPDATE_MODEL_EVENT, value)
    }
  })

  return {
    tableKls,
    isMultipleSelected,
    selected,
  }
}
