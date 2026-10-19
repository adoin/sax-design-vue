import { computed, onScopeDispose, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import type { TabPaneContext, TabValue, TabsSortDetail } from './constants'

/** Sort only the navigation; keyed pane instances remain in their source slots. */
export function useTabsSort(
  source: Ref<TabPaneContext[]>,
  props: { sortable: boolean; order?: TabValue[] },
  notify: (order: TabValue[], detail: TabsSortDetail) => void,
) {
  const localOrder = shallowRef<TabValue[]>()
  const dragging = shallowRef<number>()
  const over = shallowRef<number>()
  const valueOf = (pane: TabPaneContext) =>
    pane.name ?? source.value.indexOf(pane)
  const panes = computed(() => {
    if (!props.order && !localOrder.value) return source.value
    const remaining = new Map(source.value.map((pane) => [valueOf(pane), pane]))
    const result: TabPaneContext[] = []
    for (const value of props.order ?? localOrder.value ?? []) {
      const pane = remaining.get(value)
      if (pane) {
        result.push(pane)
        remaining.delete(value)
      }
    }
    return [...result, ...remaining.values()]
  })
  // Event-only consumers own their source array. Honor later external reorders,
  // while retaining local order for static slot users that only observe sort.
  watch(
    () => source.value.map((pane) => pane.uid),
    (next, previous) => {
      if (
        previous &&
        next.length === previous.length &&
        next.every((uid) => previous.includes(uid)) &&
        next.some((uid, index) => uid !== previous[index])
      )
        localOrder.value = undefined
      const alive = new Set(next)
      if (dragging.value !== undefined && !alive.has(dragging.value)) cancel()
    },
  )
  let pointer:
    | {
        pane: TabPaneContext
        x: number
        y: number
        id: number
        element: HTMLElement
        list: HTMLElement
      }
    | undefined
  let suppressClick = false
  const cancel = () => {
    if (pointer?.element.hasPointerCapture?.(pointer.id))
      pointer.element.releasePointerCapture(pointer.id)
    pointer = undefined
    dragging.value = undefined
    over.value = undefined
  }
  watch(
    () => props.sortable,
    (enabled) => {
      if (!enabled) cancel()
    },
  )
  function move(pane: TabPaneContext, target: TabPaneContext) {
    if (!props.sortable || pane.disabled || target.disabled) return
    const next = [...panes.value]
    const oldIndex = next.findIndex((item) => item.uid === pane.uid)
    const newIndex = next.findIndex((item) => item.uid === target.uid)
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return
    next.splice(newIndex, 0, next.splice(oldIndex, 1)[0])
    const order = next.map(valueOf)
    localOrder.value = order
    notify([...order], { value: valueOf(pane), oldIndex, newIndex })
  }
  function start(event: PointerEvent, pane: TabPaneContext) {
    if (!props.sortable || pane.disabled || event.button !== 0) return
    const element = event.currentTarget as HTMLElement
    const list = element.closest('[data-tab-uid]')?.parentElement
    if (!list) return
    suppressClick = false
    pointer = {
      pane,
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
      element,
      list,
    }
    element.setPointerCapture?.(event.pointerId)
  }
  function pointerMove(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId) return
    if (
      dragging.value === undefined &&
      Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 5
    )
      return
    dragging.value = pointer.pane.uid
    suppressClick = true
    event.preventDefault()
    const item = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-tab-uid]')
    const target =
      item && pointer.list.contains(item)
        ? source.value.find((pane) => pane.uid === Number(item.dataset.tabUid))
        : undefined
    over.value = target && !target.disabled ? target.uid : undefined
  }
  function end(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId) return
    pointerMove(event)
    const target = source.value.find((pane) => pane.uid === over.value)
    if (dragging.value !== undefined && target) move(pointer.pane, target)
    cancel()
  }
  function click(event: MouseEvent) {
    if (!suppressClick) return
    suppressClick = false
    event.preventDefault()
    event.stopImmediatePropagation()
  }
  onScopeDispose(cancel)
  function keyboard(
    event: KeyboardEvent,
    pane: TabPaneContext,
    horizontal: boolean,
  ) {
    if (event.key === 'Escape' && pointer) {
      cancel()
      event.preventDefault()
      return true
    }
    if (!props.sortable || !event.altKey || !event.shiftKey) return false
    const delta =
      event.key === (horizontal ? 'ArrowRight' : 'ArrowDown')
        ? 1
        : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp')
          ? -1
          : 0
    if (!delta) return false
    event.preventDefault()
    const enabled = panes.value.filter((item) => !item.disabled)
    const target =
      enabled[enabled.findIndex((item) => item.uid === pane.uid) + delta]
    if (target) move(pane, target)
    return true
  }
  return {
    panes,
    valueOf,
    dragging,
    over,
    start,
    pointerMove,
    end,
    click,
    cancel,
    keyboard,
  }
}
