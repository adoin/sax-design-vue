import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import type { ComputedRef } from 'vue'
import type { TableCoreProps } from '../table'

export const useTable = (
  props: TableCoreProps,
  virtualEnabled: ComputedRef<boolean>,
) => {
  const ns = useNamespace('table')

  const tableKls = computed(() => [
    ns.b(),
    ns.is('striped', props.striped),
    ns.is('multiple', props.multiple),
    ns.is('data-mode'),
    ns.is('virtual', virtualEnabled.value),
  ])

  return {
    tableKls,
  }
}
