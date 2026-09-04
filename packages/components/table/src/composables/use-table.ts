import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import type { TableProps } from './../table'

export const useTable = (props: TableProps) => {
  const ns = useNamespace('table')

  const tableKls = computed(() => [
    ns.b(),
    ns.is('striped', props.striped),
    ns.is('multiple', props.multiple),
    ns.is('data-mode'),
    ns.is('virtual', props.virtualConfig !== false),
  ])

  return {
    tableKls,
  }
}
