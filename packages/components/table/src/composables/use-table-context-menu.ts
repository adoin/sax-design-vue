import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import type { WatchSource } from 'vue'
import type {
  ContextMenuInstance,
  ContextMenuItem,
} from '@vuesax-alpha/components/context-menu'
import type { TableEmitFn, TableProps } from '../table'
import type { TableContextMenuContext } from '../table-context-menu'

export function useTableContextMenu(
  props: TableProps,
  emit: TableEmitFn,
  options: {
    root: () => HTMLElement | undefined
    context: WatchSource[]
  },
) {
  const menu = ref<ContextMenuInstance>()
  const context = shallowRef<TableContextMenuContext>()
  const config = computed(() =>
    typeof props.contextMenuConfig === 'object' ? props.contextMenuConfig : {},
  )
  const enabled = computed(
    () =>
      Boolean(props.contextMenuConfig) &&
      config.value.enabled !== false &&
      !props.loading,
  )
  let announced = false
  const items = computed(() => {
    const current = context.value
    if (!enabled.value || !current) return []
    try {
      if (config.value.visibleMethod?.(current) === false) return []
      const source = config.value[current.area]
      return typeof source === 'function' ? source(current) : (source ?? [])
    } catch {
      return []
    }
  })
  const onClose = () => {
    if (context.value && announced) emit('contextMenuClose', context.value)
    announced = false
    context.value = undefined
  }
  const close = () => {
    menu.value?.close()
    onClose()
  }
  const open = (
    current: TableContextMenuContext,
    event: MouseEvent | KeyboardEvent,
  ) => {
    if (!enabled.value || event.defaultPrevented) return
    if (
      event instanceof KeyboardEvent &&
      (event.isComposing ||
        event.keyCode === 229 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        !(
          event.key === 'ContextMenu' ||
          (event.key === 'F10' && event.shiftKey)
        ))
    )
      return
    const target = event.target as Element
    const anchor = event.currentTarget as HTMLElement
    const root = options.root()
    if (
      !root ||
      target.closest('[role="table"]') !==
        root.querySelector('[role="table"]') ||
      target.closest(
        'input,textarea,select,[contenteditable="true"],.s-table__cell-editor',
      )
    )
      return
    const previous = context.value
    context.value = current
    if (!items.value.length) {
      context.value = previous
      return
    }
    if (previous && announced) emit('contextMenuClose', previous)
    announced = true
    // Call synchronously so the shared menu can suppress the native event.
    menu.value?.show(event, anchor)
    emit('contextMenuOpen', current)
  }
  const select = (item: ContextMenuItem) => {
    const current = context.value
    if (
      !current ||
      !enabled.value ||
      !items.value.includes(item) ||
      item.disabled
    )
      return
    emit('contextMenuSelect', { context: current, item })
  }
  watch(options.context, close)
  watch(enabled, (value) => {
    if (!value) close()
  })
  watch(items, (value) => {
    if (!value.length && context.value) close()
  })
  onBeforeUnmount(close)
  return { menu, enabled, config, items, context, open, close, onClose, select }
}
