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
const pointer = (type: string, y: number, pointerId = 7, x = 40) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX: x,
    clientY: y,
  })
  Object.defineProperty(event, 'pointerId', { value: pointerId })
  return event as PointerEvent
}
const harness = (
  config: TableRowDragConfig = {},
  depthAt: (index: number) => number = () => 0,
  parentAt: (index: number) => number | undefined = () => undefined,
) => {
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
    depth: depthAt(index),
    parentKey: parentAt(index),
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
            treeConfig: computed(() =>
              !config.tree
                ? undefined
                : config.tree === true
                  ? {}
                  : config.tree,
            ),
            enabled: computed(() => true),
            pending: shallowRef(false),
            canStart: () => true,
            context: (row) => ({
              row: row.row,
              rowKey: row.key,
              rowIndex: row.index,
              depth: row.depth,
              parentKey: row.parentKey,
              hasChildren: row.hasChildren,
              expanded: row.expanded,
              childCount: 0,
            }),
            dropContext: (from, to, position) => ({
              row: rowAt(from).row,
              rowKey: from,
              rowIndex: from,
              depth: 0,
              hasChildren: false,
              expanded: false,
              childCount: 0,
              targetRow: rowAt(to).row,
              targetKey: to,
              targetIndex: to,
              targetDepth: 0,
              targetHasChildren: false,
              targetExpanded: false,
              targetChildCount: 0,
              position,
              oldIndex: from,
              newIndex: to,
              newDepth:
                position === 'inside' ? rowAt(to).depth + 1 : rowAt(to).depth,
              subtreeDepth: 0,
              reparented: position === 'inside',
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
            indent: () => 24,
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

it('uses the middle row zone for an inside tree drop', async () => {
  const { root, drag, move, tick } = harness({ tree: true })
  root.get('button').element.dispatchEvent(pointer('pointerdown', 20))
  document.dispatchEvent(pointer('pointermove', 180))
  tick()
  expect(drag.session.value).toMatchObject({
    target: 20,
    position: 'inside',
  })
  document.dispatchEvent(pointer('pointerup', 180))
  await flushPromises()
  expect(move).toHaveBeenCalledWith(0, 20, 'inside')
  root.unmount()
})

it('uses horizontal depth and hysteresis to disambiguate one row boundary', () => {
  const { root, drag, tick } = harness({ tree: true }, (index) =>
    index === 19 ? 1 : 0,
  )
  root.get('button').element.dispatchEvent(pointer('pointerdown', 20))
  document.dispatchEvent(pointer('pointermove', 162, 7, 80))
  tick()
  expect(drag.session.value).toMatchObject({
    target: 19,
    position: 'after',
    preview: { newDepth: 1 },
  })
  document.dispatchEvent(pointer('pointermove', 162, 7, 20))
  tick()
  expect(drag.session.value).toMatchObject({
    target: 20,
    position: 'before',
    preview: { newDepth: 0 },
  })
  document.dispatchEvent(pointer('pointercancel', 162))
  root.unmount()
})

it('prioritizes the child row top zone over horizontal boundary intent', () => {
  const { root, drag, tick } = harness({ tree: true }, (index) =>
    index === 20 ? 1 : 0,
  )
  root.get('button').element.dispatchEvent(pointer('pointerdown', 20))
  document.dispatchEvent(pointer('pointermove', 168, 7, 20))
  tick()
  expect(drag.session.value).toMatchObject({
    target: 20,
    position: 'before',
    preview: { newDepth: 1 },
  })
  document.dispatchEvent(pointer('pointercancel', 168))
  root.unmount()
})

it('renders an expanded parent after-position at its visible subtree end', () => {
  const { root, drag, tick } = harness({ tree: true }, (index) =>
    index === 21 ? 1 : 0,
  )
  root.get('button').element.dispatchEvent(pointer('pointerdown', 20))
  document.dispatchEvent(pointer('pointermove', 192, 7, 20))
  tick()
  expect(drag.session.value).toMatchObject({
    target: 20,
    indicator: 21,
    position: 'after',
    preview: { newDepth: 0 },
  })
  document.dispatchEvent(pointer('pointercancel', 192))
  root.unmount()
})

it('uses ArrowLeft to promote a child after its parent', () => {
  const { root, drag } = harness(
    { tree: true },
    (index) => (index === 1 ? 1 : 0),
    (index) => (index === 1 ? 0 : undefined),
  )
  drag.keydown(new KeyboardEvent('keydown', { key: ' ' }), 1)
  drag.keydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }), 1)
  expect(drag.session.value).toMatchObject({
    target: 0,
    position: 'before',
  })
  drag.keydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), 1)
  expect(drag.session.value).toMatchObject({
    target: 0,
    indicator: 1,
    position: 'after',
    preview: { newDepth: 0 },
  })
  drag.cancel()
  root.unmount()
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
