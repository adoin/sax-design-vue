import { computed, defineComponent, h, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import { useTableRowDrag } from '../src/composables/use-table-row-drag'
import type { TableRowDrag } from '../src/composables/use-table-row-drag'
import type { TableRowReorder } from '../src/composables/use-table-row-reorder'
import type { TableFlatRow, TableRowDragConfig } from '../src/table'

const elementDescriptor = Object.getOwnPropertyDescriptor(
  document,
  'elementFromPoint',
)
afterEach(() => {
  vi.restoreAllMocks()
  if (elementDescriptor)
    Object.defineProperty(document, 'elementFromPoint', elementDescriptor)
  else Reflect.deleteProperty(document, 'elementFromPoint')
})
const rect = (top = 0, height = 200) => ({
  x: 0,
  y: top,
  left: 0,
  right: 300,
  top,
  bottom: top + height,
  width: 300,
  height,
  toJSON: () => ({}),
})
const pointer = (type: string, y: number, pointerId = 7) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX: 40,
    clientY: y,
  })
  Object.defineProperty(event, 'pointerId', { value: pointerId })
  return event as PointerEvent
}
const harness = (config: TableRowDragConfig = {}) => {
  let drag!: TableRowDrag
  let frame!: FrameRequestCallback
  const schedule = vi
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((callback) => {
      frame = callback
      return 1
    })
  const stop = vi
    .spyOn(window, 'cancelAnimationFrame')
    .mockImplementation(() => {})
  const rowAt = (index: number): TableFlatRow => ({
    key: index,
    row: { id: index },
    index,
    depth: 0,
    hasChildren: false,
    loading: false,
    expanded: false,
  })
  const move = vi.fn().mockResolvedValue({ applied: true })
  const cancel = vi.fn()
  const rootEl = shallowRef<HTMLElement>()
  const focus = vi.fn()
  const root = mount(
    defineComponent({
      setup() {
        drag = useTableRowDrag(
          {
            config: computed(() => config),
            enabled: computed(() => true),
            pending: shallowRef(false),
            canStart: () => true,
            context: (row) => ({
              row: row.row,
              rowKey: row.key,
              rowIndex: row.index,
            }),
            dropContext: (from, to, position) => ({
              row: rowAt(from).row,
              rowKey: from,
              rowIndex: from,
              targetRow: rowAt(to).row,
              targetKey: to,
              targetIndex: to,
              position,
            }),
            move,
            cancel,
          } as TableRowReorder,
          vi.fn(),
          {
            root: () => rootEl.value,
            scroll: () => rootEl.value,
            rowAt,
            count: () => 1000,
            changes: [],
            focus,
            scrollTo: vi.fn(),
          },
        )
        return () =>
          h('div', { ref: rootEl }, [
            h('div', { role: 'table' }, [
              h(
                'button',
                {
                  onPointerdown: (event: PointerEvent) => drag.start(event, 0),
                },
                'Drag',
              ),
              h('div', { 'data-table-row-index': 20 }, 'Target'),
            ]),
          ])
      },
    }),
    { attachTo: document.body },
  )
  vi.spyOn(root.element, 'getBoundingClientRect').mockReturnValue(rect())
  const target = root.get('[data-table-row-index]').element
  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(160, 40))
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: vi.fn(() => target),
  })
  return {
    root,
    drag,
    move,
    cancel,
    focus,
    stop,
    schedule,
    tick: () => frame(0),
  }
}

it('keeps document pointer ownership after a source handle unmounts and auto-scrolls at the edge', async () => {
  const { root, drag, move, stop, tick } = harness()
  root.get('button').element.dispatchEvent(pointer('pointerdown', 20))
  root.get('button').element.remove()
  document.dispatchEvent(pointer('pointermove', 195, 99))
  tick()
  expect(root.element.scrollTop).toBe(0)
  document.dispatchEvent(pointer('pointermove', 195))
  tick()
  expect(root.element.scrollTop).toBeGreaterThan(0)
  expect(drag.session.value).toMatchObject({
    from: 0,
    target: 20,
    position: 'after',
  })
  document.dispatchEvent(pointer('pointerup', 195))
  await flushPromises()
  expect(move).toHaveBeenCalledWith(0, 20, 'after')
  expect(drag.session.value).toBeUndefined()
  expect(stop).toHaveBeenCalled()
  const previous = root.element.scrollTop
  document.dispatchEvent(pointer('pointermove', 195))
  expect(root.element.scrollTop).toBe(previous)
  root.unmount()
})

it('disables automatic scrolling and removes gesture listeners on cancel and unmount', () => {
  const { root, drag, move, tick, stop } = harness({ autoScroll: false })
  root.get('button').element.dispatchEvent(pointer('pointerdown', 20))
  document.dispatchEvent(pointer('pointermove', 195))
  tick()
  expect(root.element.scrollTop).toBe(0)
  document.dispatchEvent(pointer('pointercancel', 195))
  expect(drag.session.value).toBeUndefined()
  expect(move).not.toHaveBeenCalled()
  root.get('button').element.dispatchEvent(pointer('pointerdown', 20))
  root.unmount()
  document.dispatchEvent(pointer('pointerup', 195))
  expect(move).not.toHaveBeenCalled()
  expect(stop).toHaveBeenCalledTimes(2)
})

it('does not treat rows of a nested detail table as targets of its parent table', async () => {
  const { root, drag, move, tick } = harness()
  const target = root.get('[data-table-row-index]').element
  const inner = document.createElement('div')
  inner.setAttribute('role', 'table')
  target.replaceWith(inner)
  inner.append(target)
  root.get('button').element.dispatchEvent(pointer('pointerdown', 20))
  document.dispatchEvent(pointer('pointermove', 190))
  tick()
  expect(drag.session.value?.target).toBeUndefined()
  document.dispatchEvent(pointer('pointerup', 190))
  await flushPromises()
  expect(move).not.toHaveBeenCalled()
  root.unmount()
})
