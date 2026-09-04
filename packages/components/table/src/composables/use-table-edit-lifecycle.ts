import { watch } from 'vue'
import type { WatchSource } from 'vue'
import type { TableEditContext, TableProps } from '../table'
import type { TableEditing } from './use-table-edit'

interface EditLifecycleOptions {
  query: WatchSource[]
  page: WatchSource[]
  columns: WatchSource[]
  resolveContext: (context: TableEditContext) => TableEditContext | undefined
  isDataCurrent?: (context: TableEditContext) => boolean
  isLocating?: () => boolean
}

// Coordinate view changes separately from field drafts. All lookups use the
// current row/column model; virtual viewport changes are handled by attachment.
export function useTableEditLifecycle(
  props: TableProps,
  editing: TableEditing,
  options: EditLifecycleOptions,
) {
  const contextChanged = (reason: 'query' | 'page' | 'columns') => {
    if (options.isLocating?.()) {
      if (editing.active.value) editing.contextRetained.value = true
      return
    }
    editing.contextChanged(reason)
  }
  watch(options.query, () => contextChanged('query'), { deep: true })
  watch(options.page, () => contextChanged('page'))
  watch(options.columns, () => contextChanged('columns'), {
    deep: true,
  })
  watch([() => props.rowKey, () => props.virtualSource?.rowKey], () =>
    editing.cancel('data'),
  )
  watch(
    () => {
      const active = editing.active.value
      if (!active) return undefined
      if (props.virtualSource) {
        // Generated rows may return a new object on every access. Check the
        // logical bounds without reading rows or materializing their fields.
        return active.rowIndex < props.virtualSource.rowCount &&
          active.columnIndex < props.virtualSource.columnCount
          ? active
          : undefined
      }
      return options.resolveContext(active)
    },
    (current) => {
      const active = editing.active.value
      if (!active) return
      if (!current) {
        if (editing.contextRetained.value && options.isDataCurrent?.(active))
          return
        editing.cancel('view')
      } else if (current.row !== active.row) {
        editing.cancel('data')
      } else if (
        current.rowIndex !== active.rowIndex ||
        current.depth !== active.depth ||
        current.expanded !== active.expanded ||
        current.loading !== active.loading
      ) {
        // A sibling lazy-load or insertion may move this row without ending
        // its edit. Keep event coordinates current without moving focus.
        editing.active.value = { ...active, ...current }
      }
    },
    // Query/page policies run first; DOM removal must not change their reason
    // to a generic view/scroll cancellation.
    { flush: 'post' },
  )
}
