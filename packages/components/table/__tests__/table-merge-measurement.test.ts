import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTableMergeGeometry } from '../src/composables/use-table-merge-geometry'

let frames: Map<number, FrameRequestCallback>
let sequence = 0
let resizeCallback: ResizeObserverCallback
let observed: Set<Element>
let unmount: (() => void) | undefined
let rects: WeakMap<Element, DOMRect>
const rect = (
  element: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  rects.set(element, {
    x,
    y,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
    width,
    height,
  } as DOMRect)
  Object.defineProperties(element, {
    clientWidth: { configurable: true, value: width },
    clientHeight: { configurable: true, value: height },
  })
}
const flush = async () => {
  await nextTick()
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach((callback) => callback(0))
  await nextTick()
}
function fixture() {
  const viewport = document.createElement('div')
  const root = document.createElement('div')
  root.setAttribute('role', 'table')
  viewport.append(root)
  document.body.append(viewport)
  rect(root, 20, 30, 900, 400)
  rect(viewport, 20, 30, 400, 200)
  const row = (index: number, y: number, height = 44) => {
    const element = document.createElement('div')
    element.dataset.tableRowIndex = String(index)
    element.setAttribute('role', 'row')
    root.append(element)
    rect(element, 20, y, 900, height)
    for (const [column, x, width, fixed] of [
      [0, 20, 80, 'left'],
      [99998, 80, 280, ''],
      [99999, 340, 80, 'right'],
    ] as const) {
      const cell = document.createElement('div')
      cell.dataset.columnIndex = String(column)
      cell.setAttribute('aria-colindex', String(column + 1))
      if (fixed) cell.classList.add(`is-fixed-${fixed}`)
      element.append(cell)
      rect(cell, x, y, width, height)
    }
    return element
  }
  const first = row(998, 20, 50)
  const second = row(999, 70, 70)
  const enabled = shallowRef(true)
  const offset = shallowRef(999000)
  let controller!: ReturnType<typeof useTableMergeGeometry>
  const wrapper = mount(
    defineComponent({
      setup() {
        controller = useTableMergeGeometry({
          enabled: () => enabled.value,
          root: () => root,
          viewport: () => viewport,
          rowOffset: () => offset.value,
        })
        return () => h('div')
      },
    }),
  )
  unmount = () => wrapper.unmount()
  return { controller, root, viewport, first, second, row, enabled, offset }
}

beforeEach(() => {
  frames = new Map()
  rects = new WeakMap()
  observed = new Set()
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      return (
        rects.get(this) ?? ({ left: 0, top: 0, width: 0, height: 0 } as DOMRect)
      )
    },
  )
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++sequence, callback)
    return sequence
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback
      }
      observe(element: Element) {
        observed.add(element)
      }
      unobserve(element: Element) {
        observed.delete(element)
      }
      disconnect() {
        observed.clear()
      }
    },
  )
})
afterEach(() => {
  unmount?.()
  unmount = undefined
  document.body.replaceChildren()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('merge geometry observer', () => {
  it('measures only mounted rows and visual column runs at the end of a giant source', async () => {
    const { controller, root } = fixture()
    const nested = document.createElement('div')
    nested.setAttribute('role', 'table')
    nested.innerHTML = '<div data-table-row-index="3"></div>'
    root.append(nested)
    rect(nested.firstElementChild as HTMLElement, 20, 120, 400, 100)
    await flush()
    expect(controller.geometry.value.body).toEqual({
      rows: [
        { index: 999998, top: -10, height: 50 },
        { index: 999999, top: 40, height: 70 },
      ],
      columns: [
        { position: 0, left: 0, width: 80, fixed: 'left' },
        { position: 99998, left: 60, width: 280, fixed: undefined },
        { position: 99999, left: 320, width: 80, fixed: 'right' },
      ],
      clip: { left: 0, right: 400, top: 0, bottom: 200 },
      windows: [
        { rowStart: 999998, rowEnd: 1000000, colStart: 0, colEnd: 1 },
        { rowStart: 999998, rowEnd: 1000000, colStart: 99998, colEnd: 99999 },
        { rowStart: 999998, rowEnd: 1000000, colStart: 99999, colEnd: 100000 },
      ],
    })
    expect(observed.size).toBe(7)
  })

  it('coalesces scrolling and resize, retains snapshot identity, and drops removed observers', async () => {
    const { controller, first, second, viewport } = fixture()
    await flush()
    const initial = controller.geometry.value
    viewport.dispatchEvent(new Event('scroll'))
    resizeCallback([], {} as ResizeObserver)
    viewport.dispatchEvent(new Event('scroll'))
    expect(frames.size).toBe(1)
    await flush()
    expect(controller.geometry.value).toBe(initial)
    first.remove()
    rect(second, 20, 45, 900, 90)
    await flush()
    expect(controller.geometry.value.body.rows).toEqual([
      { index: 999999, top: 15, height: 90 },
    ])
    expect(observed.has(first)).toBe(false)
    expect(observed.has(second.firstElementChild!)).toBe(true)
  })

  it('ignores merge-layer mutations and keeps footer coordinates independent of body clipping', async () => {
    const { root, controller } = fixture()
    await flush()
    const layer = document.createElement('div')
    layer.dataset.tableMergeLayer = ''
    layer.innerHTML = '<div data-table-row-index="0">Owner</div>'
    root.append(layer)
    await nextTick()
    expect(frames.size).toBe(0)
    layer.firstElementChild!.textContent = 'Changed owner'
    await nextTick()
    expect(frames.size).toBe(0)
    const footer = document.createElement('div')
    footer.dataset.footerRowKey = 'total'
    footer.dataset.footerRowIndex = '0'
    footer.innerHTML = '<div data-column-index="0" aria-colindex="1"></div>'
    root.append(footer)
    rect(footer, 20, 250, 900, 48)
    rect(footer.firstElementChild as HTMLElement, 20, 250, 80, 48)
    await flush()
    expect(controller.geometry.value.footer.rows).toEqual([
      { index: 0, top: 220, height: 48 },
    ])
    expect(controller.geometry.value.footer.clip).toEqual({
      left: 0,
      right: 400,
      top: 220,
      bottom: 268,
    })
    expect(controller.geometry.value.body.rows).toHaveLength(2)
  })

  it('converts transformed ancestor coordinates back to local CSS pixels', async () => {
    const { root, viewport, first, second, controller } = fixture()
    Object.defineProperties(root, {
      offsetWidth: { configurable: true, value: 450 },
      offsetHeight: { configurable: true, value: 200 },
    })
    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 200 },
      clientHeight: { configurable: true, value: 100 },
    })
    await flush()
    expect(controller.geometry.value.body.rows).toEqual([
      { index: 999998, top: -5, height: 25 },
      { index: 999999, top: 20, height: 35 },
    ])
    expect(controller.geometry.value.body.clip.right).toBe(200)
    expect(observed.has(first) && observed.has(second)).toBe(true)
  })

  it('stops work when disabled or unmounted, then rebinds when enabled', async () => {
    const { enabled, offset, viewport, controller } = fixture()
    await flush()
    enabled.value = false
    await nextTick()
    expect(observed.size).toBe(0)
    expect(controller.geometry.value.body.rows).toEqual([])
    viewport.dispatchEvent(new Event('scroll'))
    resizeCallback([], {} as ResizeObserver)
    expect(frames.size).toBe(0)
    enabled.value = true
    offset.value = 1000
    await flush()
    expect(controller.geometry.value.body.rows[0].index).toBe(1998)
    viewport.dispatchEvent(new Event('scroll'))
    expect(frames.size).toBe(1)
    unmount!()
    unmount = undefined
    expect(observed.size).toBe(0)
    expect(frames.size).toBe(0)
    viewport.dispatchEvent(new Event('scroll'))
    resizeCallback([], {} as ResizeObserver)
    expect(frames.size).toBe(0)
  })
})
