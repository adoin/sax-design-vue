import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
} from 'vue'
import type { WatchSource } from 'vue'
import type { TableEmitFn, TableProps } from '../table'
import type { TableActiveCell } from '../table-keyboard'

export interface TableCellCoordinate {
  /** Current flattened-page row and visible visual-column positions. */
  row: number
  position: number
  /** Index used by the shared rendering/editing pipeline. */
  column: number
  /** Requested visible point can differ from a merged owner's address. */
  viewRow?: number
  viewColumn?: number
  address: TableActiveCell
}
interface KeyboardOptions {
  root: () => HTMLElement | undefined
  countColumns: () => number
  keyAt: (column: number) => string
  at: (row: number, position: number) => TableCellCoordinate | undefined
  resolve: (
    address: TableActiveCell,
    hint?: TableCellCoordinate,
  ) => TableCellCoordinate | undefined
  fromElement: (cell: HTMLElement) => TableCellCoordinate | undefined
  locate: (coordinate: TableCellCoordinate) => void
  element: (coordinate: TableCellCoordinate) => HTMLElement | null | undefined
  edit: (coordinate: TableCellCoordinate) => Promise<boolean>
  editing: () => boolean
  dragActive: () => boolean
  move?: (
    current: TableCellCoordinate,
    key: string,
    backwards: boolean,
  ) => TableCellCoordinate | undefined
  context: WatchSource[]
}
const equal = (
  a: TableActiveCell | null | undefined,
  b: TableActiveCell | null | undefined,
) =>
  (!a && !b) ||
  Boolean(a && b && a.rowKey === b.rowKey && a.columnKey === b.columnKey)
const interactive =
  'input,textarea,select,button,a[href],[contenteditable]:not([contenteditable="false"]),[role="combobox"],[role="slider"],[role="switch"]'

/** Roving cell focus, independent of row selection and editor draft state. */
export function useTableKeyboard(
  props: TableProps,
  emit: TableEmitFn,
  options: KeyboardOptions,
) {
  const config = computed(() =>
    typeof props.keyboardConfig === 'object' ? props.keyboardConfig : {},
  )
  const enabled = computed(
    () =>
      (Boolean(props.keyboardConfig) ||
        (Boolean(props.findConfig) &&
          (typeof props.findConfig !== 'object' ||
            props.findConfig.enabled !== false)) ||
        (Boolean(props.clipboardConfig) &&
          (typeof props.clipboardConfig !== 'object' ||
            props.clipboardConfig.enabled !== false)) ||
        (Boolean(props.rangeConfig) &&
          (typeof props.rangeConfig !== 'object' ||
            props.rangeConfig.enabled !== false))) &&
      config.value.enabled !== false &&
      !props.loading,
  )
  const local = shallowRef<TableActiveCell | null>(null)
  const active = computed(() =>
    props.activeCell === undefined ? local.value : props.activeCell,
  )
  const mountedCell = shallowRef(false)
  let hint: TableCellCoordinate | undefined
  let sequence = 0
  let pendingFocus = 0
  let disposed = false
  let ownedFocus = false
  let parked = false
  let observer: MutationObserver | undefined
  let removeFocusListener: (() => void) | undefined
  let cancelFrame: (() => void) | undefined
  const coordinate = () => {
    const target = active.value
      ? options.resolve(active.value, hint)
      : undefined
    return target && equal(target.address, active.value) ? target : undefined
  }
  const ownedCell = (element: Element | null): HTMLElement | undefined => {
    const root = options.root()
    const cell = element?.closest<HTMLElement>(
      '[role="cell"][data-column-index]',
    )
    return root &&
      cell &&
      cell.closest('[role="table"]') === root.querySelector('[role="table"]')
      ? cell
      : undefined
  }
  const park = () => {
    const root = options.root()
    if (!root || !ownedFocus) return
    parked = true
    root.focus({ preventScroll: true })
  }
  const refreshDOM = () => {
    if (disposed || !enabled.value) {
      mountedCell.value = false
      return
    }
    const root = options.root()
    if (!root) return
    const resolved = coordinate()
    const cell = resolved && options.element(resolved)
    mountedCell.value = Boolean(cell)
    if (pendingFocus || options.editing() || options.dragActive()) return
    if (
      !cell &&
      ownedFocus &&
      (!root.ownerDocument.activeElement ||
        root.ownerDocument.activeElement === root.ownerDocument.body)
    )
      park()
    else if (
      cell &&
      parked &&
      ownedFocus &&
      root.ownerDocument.activeElement === root
    ) {
      parked = false
      cell.focus({ preventScroll: true })
    }
  }
  const focus = async (target: TableCellCoordinate, request: number) => {
    options.locate(target)
    await nextTick()
    await nextTick()
    if (
      request !== sequence ||
      disposed ||
      !enabled.value ||
      !equal(active.value, target.address)
    )
      return false
    const current = coordinate()
    if (!current) return false
    if (current.row !== target.row || current.column !== target.column) {
      options.locate(current)
      target = current
      await nextTick()
      if (request !== sequence || disposed) return false
    }
    let cell = options.element(target)
    // Both virtual axes may mount on separate frames after a distant jump.
    for (let frame = 0; !cell && frame < 8; frame++) {
      await new Promise<void>((resolve) => {
        const win = options.root()?.ownerDocument.defaultView
        cancelFrame?.()
        if (win) {
          const id = win.requestAnimationFrame(() => {
            cancelFrame = undefined
            resolve()
          })
          cancelFrame = () => {
            win.cancelAnimationFrame(id)
            cancelFrame = undefined
            resolve()
          }
        } else resolve()
      })
      await nextTick()
      if (
        request !== sequence ||
        disposed ||
        !enabled.value ||
        !equal(active.value, target.address)
      )
        return false
      const resolved = coordinate()
      if (!resolved) return false
      if (resolved.row !== target.row || resolved.column !== target.column) {
        options.locate(resolved)
        target = resolved
        continue
      }
      cell = options.element(target)
    }
    if (!cell) return false
    parked = false
    ownedFocus = true
    cell.focus({ preventScroll: true })
    mountedCell.value = true
    return cell.ownerDocument.activeElement === cell
  }
  const select = async (
    target: TableCellCoordinate | undefined,
    shouldFocus = true,
  ) => {
    if (!enabled.value || disposed || options.dragActive()) return false
    const request = ++sequence
    if (shouldFocus && target) pendingFocus = request
    cancelFrame?.()
    try {
      const address = target ? { ...target.address } : null
      if (target) hint = target
      if (!equal(active.value, address)) {
        if (props.activeCell === undefined) local.value = address
        emit('update:activeCell', address)
        await nextTick()
      }
      if (
        disposed ||
        request !== sequence ||
        !enabled.value ||
        !equal(active.value, address)
      )
        return false
      if (!target) {
        mountedCell.value = false
        if (shouldFocus) park()
        return true
      }
      if (!shouldFocus) return true
      return await focus(target, request)
    } finally {
      if (pendingFocus === request) pendingFocus = 0
    }
  }
  const onFocusin = (event: FocusEvent) => {
    if (!enabled.value) return
    const root = options.root()
    if (event.target === root) {
      ownedFocus = true
      if (parked || options.dragActive()) return
      const target = coordinate() ?? options.at(0, 0)
      if (target) select(target)
      return
    }
    const cell = ownedCell(event.target as Element)
    const target = cell && options.fromElement(cell)
    if (target) {
      ownedFocus = true
      parked = false
      select(target, false)
    }
  }
  const onClick = (event: MouseEvent) => {
    if (
      !enabled.value ||
      event.defaultPrevented ||
      (event.target as Element).closest(interactive)
    )
      return
    const cell = ownedCell(event.target as Element)
    const target = cell && options.fromElement(cell)
    if (target && !options.editing()) select(target)
  }
  const onKeydown = (event: KeyboardEvent) => {
    if (
      !enabled.value ||
      event.defaultPrevented ||
      event.isComposing ||
      event.keyCode === 229 ||
      options.dragActive()
    )
      return
    const root = options.root()
    const cell = ownedCell(event.target as Element)
    if (event.target !== root && !cell) return
    const inControl = (event.target as Element).closest(interactive)
    if (inControl && inControl !== cell) {
      // Editors and nested controls own arrows, Tab, IME and popup shortcuts.
      if (event.key === 'Escape' && !options.editing() && cell) {
        event.preventDefault()
        event.stopPropagation()
        cell.focus({ preventScroll: true })
      }
      return
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const current = (cell && options.fromElement(cell)) || coordinate()
    if (!current) {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(
          event.key,
        )
      ) {
        event.preventDefault()
        const first = options.at(0, 0)
        if (first) select(first)
      }
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      select(undefined)
      return
    }
    if (event.key === 'Enter' || event.key === 'F2') {
      event.preventDefault()
      event.stopPropagation()
      const request = sequence
      const enter = async () => {
        if (config.value.enterToEdit !== false && (await options.edit(current)))
          return
        if (disposed || request !== sequence || !enabled.value) return
        const control = options
          .element(current)
          ?.querySelector<HTMLElement>(interactive)
        if (control && !control.matches(':disabled,[aria-disabled="true"]'))
          control.focus()
      }
      enter()
      return
    }
    let row = current.row,
      position = current.position
    switch (event.key) {
      case 'ArrowUp':
        row--
        break
      case 'ArrowDown':
        row++
        break
      case 'ArrowLeft':
        position--
        break
      case 'ArrowRight':
        position++
        break
      case 'Tab':
        position += event.shiftKey ? -1 : 1
        if (position < 0) {
          row--
          position = options.countColumns() - 1
        }
        if (position >= options.countColumns()) {
          row++
          position = 0
        }
        break
      default:
        return
    }
    const target = options.move
      ? options.move(current, event.key, event.shiftKey)
      : options.at(row, position)
    // Native Tab exits at either edge; arrow keys stop at the current page boundary.
    if (!target && event.key === 'Tab') return
    event.preventDefault()
    event.stopPropagation()
    if (target) select(target)
  }
  watch(
    () => (active.value ? { ...active.value } : null),
    (value, previous) => {
      if (!equal(value, previous))
        emit('activeCellChange', value ? { ...value } : null)
      nextTick(refreshDOM)
    },
  )
  watch(options.context, () => {
    if (!enabled.value || !active.value) return
    const target = options.resolve(active.value, hint)
    if (!target) select(undefined)
    else if (!equal(target.address, active.value)) select(target, false)
    nextTick(refreshDOM)
  })
  watch(
    [enabled, active],
    () => {
      if (!enabled.value || !active.value) return
      const target = options.resolve(active.value, hint)
      if (target && !equal(target.address, active.value)) select(target, false)
    },
    { immediate: true },
  )
  watch(enabled, (value) => {
    sequence++
    cancelFrame?.()
    if (!value) mountedCell.value = false
    else nextTick(refreshDOM)
  })
  const detach = () => {
    observer?.disconnect()
    observer = undefined
    removeFocusListener?.()
    removeFocusListener = undefined
  }
  onMounted(() =>
    watch(
      enabled,
      (value) => {
        detach()
        if (!value) return
        const root = options.root()
        if (!root) return
        observer = new MutationObserver(refreshDOM)
        observer.observe(root, { childList: true, subtree: true })
        const outside = (event: Event) => {
          const target = event.target as Element
          const nestedTable =
            root.contains(target) &&
            target.closest('[role="table"]') !==
              root.querySelector('[role="table"]') &&
            target !== root
          if (!root.contains(target) || nestedTable) {
            ownedFocus = false
            parked = false
            sequence++
            cancelFrame?.()
          }
        }
        root.ownerDocument.addEventListener('focusin', outside)
        root.ownerDocument.addEventListener('pointerdown', outside)
        removeFocusListener = () => {
          root.ownerDocument.removeEventListener('focusin', outside)
          root.ownerDocument.removeEventListener('pointerdown', outside)
        }
        refreshDOM()
      },
      { immediate: true, flush: 'post' },
    ),
  )
  onBeforeUnmount(() => {
    disposed = true
    sequence++
    cancelFrame?.()
    detach()
  })
  return {
    enabled,
    active,
    coordinate,
    onFocusin,
    onClick,
    onKeydown,
    select,
    rootTabindex: computed(() =>
      enabled.value && !mountedCell.value ? 0 : -1,
    ),
    isActive: (rowKey: TableActiveCell['rowKey'], column: number) =>
      enabled.value &&
      equal(active.value, { rowKey, columnKey: options.keyAt(column) }),
    get: () => (coordinate() && active.value ? { ...active.value } : null),
    clear: () => select(undefined),
  }
}

export type TableKeyboard = ReturnType<typeof useTableKeyboard>
