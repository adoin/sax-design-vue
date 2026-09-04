import { defineComponent, h, nextTick, reactive } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTableKeyboard } from '../src/composables/use-table-keyboard'
import { tableFocusVisible } from '../src/composables/table-focus-visibility'
import type { TableCellCoordinate } from '../src/composables/use-table-keyboard'
import type { TableProps } from '../src/table'

let frames: Map<number, FrameRequestCallback>
let sequence = 0
const wrappers: { unmount(): void }[] = []
beforeEach(() => {
  frames = new Map()
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.set(++sequence, callback)
    return sequence
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) =>
    frames.delete(id),
  )
})
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.restoreAllMocks()
})
const frame = async () => {
  await flushPromises()
  const callbacks = [...frames.values()]
  frames.clear()
  callbacks.forEach((callback) => callback(0))
  await nextTick()
  await flushPromises()
}
const setup = () => {
  let root!: HTMLElement
  let visible = false
  let keyboard!: ReturnType<typeof useTableKeyboard>
  const coordinates: TableCellCoordinate[] = [0, 1].map((column) => ({
    row: 0,
    column,
    position: column,
    address: { rowKey: 0, columnKey: String(column) },
  }))
  const locate = vi.fn()
  const wrapper = mount(
    defineComponent({
      setup() {
        keyboard = useTableKeyboard(
          reactive({ keyboardConfig: true }) as TableProps,
          vi.fn(),
          {
            root: () => root,
            countColumns: () => 2,
            keyAt: String,
            at: (_, column) => coordinates[column],
            resolve: (address) => coordinates[Number(address.columnKey)],
            fromElement: (cell) =>
              coordinates[Number(cell.dataset.columnIndex)],
            locate,
            element: ({ column }) =>
              root.querySelector<HTMLElement>(
                `[data-column-index="${column}"]`,
              ),
            focusVisible: () => visible,
            edit: async () => false,
            editing: () => false,
            dragActive: () => false,
            context: [],
          },
        )
        return () =>
          h(
            'div',
            {
              ref: (el) => {
                root = el as HTMLElement
              },
              tabindex: -1,
            },
            [
              h(
                'div',
                { role: 'table' },
                coordinates.map(({ column }) =>
                  h(
                    'div',
                    { role: 'cell', 'data-column-index': column, tabindex: 0 },
                    String(column),
                  ),
                ),
              ),
            ],
          )
      },
    }),
    { attachTo: document.body },
  )
  wrappers.push(wrapper)
  return {
    root,
    wrapper,
    keyboard,
    locate,
    coordinates,
    setVisible: (value: boolean) => {
      visible = value
    },
  }
}

describe('virtual keyboard focus settlement', () => {
  it('waits for measured visibility even when the target is already mounted in overscan', async () => {
    const f = setup()
    const pending = f.keyboard.select(f.coordinates[0])
    await frame()
    expect(f.locate.mock.calls.length).toBeGreaterThan(1)
    expect(document.activeElement).not.toBe(f.root.querySelector('[role=cell]'))
    f.setVisible(true)
    await frame()
    expect(document.activeElement).not.toBe(f.root.querySelector('[role=cell]'))
    await frame()
    expect(await pending).toBe(true)
    expect(document.activeElement).toBe(f.root.querySelector('[role=cell]'))
  })
  it('restarts settlement if late measurement pushes a visible target out of view', async () => {
    const f = setup()
    f.setVisible(true)
    const pending = f.keyboard.select(f.coordinates[0])
    await frame()
    f.setVisible(false)
    await frame()
    expect(document.activeElement).not.toBe(f.root.querySelector('[role=cell]'))
    f.setVisible(true)
    await frame()
    await frame()
    expect(await pending).toBe(true)
    expect(f.locate).toHaveBeenCalledTimes(2)
  })
  it.each(['wheel', 'touchstart', 'pointerdown'])(
    'yields pending navigation to user %s input',
    async (type) => {
      const f = setup()
      const pending = f.keyboard.select(f.coordinates[0])
      await flushPromises()
      f.root.dispatchEvent(new Event(type, { bubbles: true }))
      expect(await pending).toBe(false)
      const count = f.locate.mock.calls.length
      f.setVisible(true)
      await frame()
      expect(f.locate).toHaveBeenCalledTimes(count)
      expect(document.activeElement).not.toBe(
        f.root.querySelector('[role=cell]'),
      )
      expect(frames.size).toBe(0)
    },
  )
  it('yields to a drag handle even when it stops pointer event bubbling', async () => {
    const f = setup()
    const handle = document.createElement('button')
    handle.addEventListener('pointerdown', (event) => event.stopPropagation())
    f.root.append(handle)
    const pending = f.keyboard.select(f.coordinates[0])
    await flushPromises()
    handle.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(await pending).toBe(false)
    expect(frames.size).toBe(0)
    const count = f.locate.mock.calls.length
    f.setVisible(true)
    await frame()
    expect(f.locate).toHaveBeenCalledTimes(count)
  })
  it('lets the newest request own focus and cancels scheduled work on unmount', async () => {
    const f = setup()
    const first = f.keyboard.select(f.coordinates[0])
    await flushPromises()
    const second = f.keyboard.select(f.coordinates[1])
    expect(await first).toBe(false)
    f.setVisible(true)
    await frame()
    await frame()
    expect(await second).toBe(true)
    expect(document.activeElement?.getAttribute('data-column-index')).toBe('1')
    f.setVisible(false)
    const pending = f.keyboard.select(f.coordinates[0])
    await flushPromises()
    f.wrapper.unmount()
    expect(await pending).toBe(false)
    expect(frames.size).toBe(0)
    wrappers.splice(wrappers.indexOf(f.wrapper), 1)
  })
  it('stops after a bounded number of frames if a target never becomes visible', async () => {
    const f = setup()
    const pending = f.keyboard.select(f.coordinates[0])
    for (let i = 0; i < 8; i++) await frame()
    expect(await pending).toBe(false)
    expect(f.locate.mock.calls.length).toBeLessThanOrEqual(9)
    expect(frames.size).toBe(0)
  })
})

describe('table focus viewport geometry', () => {
  it('uses scaled client bounds and accepts oversized cells only when they span the viewport', () => {
    const viewport = document.createElement('div')
    const cell = document.createElement('div')
    Object.defineProperties(viewport, {
      offsetHeight: { value: 204 },
      clientHeight: { value: 200 },
      clientTop: { value: 2 },
    })
    vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue({
      top: 50,
      height: 102,
    } as DOMRect)
    const rect = vi.spyOn(cell, 'getBoundingClientRect')
    rect.mockReturnValue({ top: 51, bottom: 151, height: 100 } as DOMRect)
    expect(tableFocusVisible(cell, viewport)).toBe(true)
    rect.mockReturnValue({ top: 90, bottom: 160, height: 70 } as DOMRect)
    expect(tableFocusVisible(cell, viewport)).toBe(false)
    rect.mockReturnValue({ top: 40, bottom: 170, height: 130 } as DOMRect)
    expect(tableFocusVisible(cell, viewport)).toBe(true)
    rect.mockReturnValue({ top: 100, bottom: 230, height: 130 } as DOMRect)
    expect(tableFocusVisible(cell, viewport)).toBe(false)
  })
})
