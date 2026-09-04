import { computed, onMounted, onUpdated, provide, shallowRef } from 'vue'
import { tableColumnRegistrationKey } from '../table'
import type { TableColumn } from '../table'

interface RegisteredColumn {
  id: symbol
  column: TableColumn
  anchor?: () => Node | null | undefined
}

/** A renderless column's anchor follows keyed Vue moves, including fragments. */
export function useTableColumnRegistry() {
  const entries = shallowRef<RegisteredColumn[]>([])
  const syncOrder = () => {
    const next = [...entries.value].sort((left, right) => {
      const leftNode = left.anchor?.()
      const rightNode = right.anchor?.()
      if (!leftNode || !rightNode || leftNode === rightNode) return 0
      const position = leftNode.compareDocumentPosition(rightNode)
      // Disconnected anchors have no meaningful sibling order. Keep registration
      // order until Vue mounts them; numeric flags also keep this SSR-safe.
      if (position & 1) return 0
      if (position & 4) return -1
      if (position & 2) return 1
      return 0
    })
    if (next.some((entry, index) => entry !== entries.value[index]))
      entries.value = next
  }

  provide(tableColumnRegistrationKey, {
    register: (id, column, anchor) => {
      entries.value = [...entries.value, { id, column, anchor }]
    },
    update: (id, column) => {
      entries.value = entries.value.map((entry) =>
        entry.id === id ? { ...entry, column } : entry,
      )
    },
    unregister: (id) => {
      entries.value = entries.value.filter((entry) => entry.id !== id)
    },
  })
  onMounted(syncOrder)
  onUpdated(syncOrder)

  return computed(() => entries.value.map((entry) => entry.column))
}
