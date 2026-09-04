import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTableMergeIndex } from '../src/composables/table-merge-regions'
import { useTableMergeHeights } from '../src/composables/use-table-merge-heights'

let frames: Map<number, FrameRequestCallback>
let sequence = 0
let resize: ResizeObserverCallback
let observed: Set<Element>
let unmount: (() => void) | undefined
const flush = async () => {
  await nextTick()
  await Promise.resolve()
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach((callback) => callback(0))
  await nextTick()
}
function fixture(rowspan = 1, scale = 1) {
  const root = document.createElement('div')
  root.setAttribute('role', 'table')
  const fragment = document.createElement('div')
  fragment.dataset.mergePrimary = 'true'
  fragment.dataset.mergeRegion = `0:0:${rowspan}:2`
  root.append(fragment)
  const cell = document.createElement('div')
  cell.setAttribute('role', 'cell')
  cell.style.cssText =
    'display:flex;flex-direction:column;padding:10px 14px;row-gap:4px'
  fragment.append(cell)
  const content = document.createElement('div')
  content.textContent = 'A long merged label'
  content.style.margin = '3px 0'
  cell.append(content)
  document.body.append(root)
  let natural = 100
  Object.defineProperty(root, 'offsetHeight', { value: 200 })
  vi.spyOn(root, 'getBoundingClientRect').mockImplementation(
    () => ({ height: 200 * scale }) as DOMRect,
  )
  vi.spyOn(content, 'getBoundingClientRect').mockImplementation(
    () => ({ height: natural * scale }) as DOMRect,
  )
  const enabled = ref(true)
  const shrink = vi.fn()
  const index = createTableMergeIndex(
    [{ row: 0, col: 0, rowspan, colspan: 2 }],
    1_000_000,
    100_000,
  )
  let controller!: ReturnType<typeof useTableMergeHeights>
  const wrapper = mount(
    defineComponent({
      setup() {
        controller = useTableMergeHeights({
          root: () => root,
          enabled: () => enabled.value,
          index: () => index,
          columnCount: () => 100_000,
          shrink,
        })
        return () => h('div')
      },
    }),
  )
  unmount = () => wrapper.unmount()
  const setHeight = (height: number) => {
    natural = height
    resize([], {} as ResizeObserver)
  }
  return {
    controller,
    root,
    fragment,
    cell,
    content,
    setHeight,
    enabled,
    shrink,
  }
}
beforeEach(() => {
  frames = new Map()
  observed = new Set()
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++sequence, callback)
    return sequence
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback
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

describe('merged content natural heights', () => {
  it('allocates content plus CSS spacing across logical rows under ancestor scaling', async () => {
    const { controller } = fixture(2, 0.75)
    await flush()
    expect(controller.minimum('body', 0)).toBe(63)
    expect(controller.minimum('body', 1)).toBe(63)
    expect(controller.minimum('body', 2)).toBeUndefined()
    expect(controller.minimum('footer', 0)).toBeUndefined()
  })

  it('retains height through repeated pane changes and shrinks after real content changes', async () => {
    const f = fixture()
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(126)
    f.fragment.style.width = '400px'
    f.setHeight(20)
    await flush()
    f.setHeight(20)
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(126)
    f.cell.className = 'is-active-cell'
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(126)
    f.content.textContent = 'Short'
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(46)
    expect(f.shrink).toHaveBeenCalledTimes(1)
    f.setHeight(150)
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(176)
    f.setHeight(20)
    f.controller.clear()
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(46)
  })

  it('measures validation messages while excluding hidden and positioned decoration', async () => {
    const f = fixture()
    const message = document.createElement('div')
    message.textContent = 'Required'
    vi.spyOn(message, 'getBoundingClientRect').mockReturnValue({
      height: 40,
    } as DOMRect)
    const hidden = message.cloneNode(true) as HTMLElement
    hidden.style.display = 'none'
    vi.spyOn(hidden, 'getBoundingClientRect').mockReturnValue({
      height: 999,
    } as DOMRect)
    const decoration = message.cloneNode(true) as HTMLElement
    decoration.style.position = 'absolute'
    vi.spyOn(decoration, 'getBoundingClientRect').mockReturnValue({
      height: 999,
    } as DOMRect)
    f.cell.append(message, hidden, decoration)
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(170)
    message.remove()
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(126)
    expect(observed.has(message)).toBe(false)
  })

  it('invalidates stale content heights after an owner returns to the visible window', async () => {
    const f = fixture()
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(126)
    f.fragment.remove()
    await flush()
    f.content.textContent = 'Changed while offscreen'
    f.setHeight(20)
    f.root.append(f.fragment)
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(46)
    expect(f.shrink).toHaveBeenCalledTimes(1)
  })

  it('does not expand a million-row range or accept nested table owners', async () => {
    const f = fixture(1_000_000)
    const nested = f.root.cloneNode(true) as HTMLElement
    f.root.append(nested)
    await flush()
    expect(f.controller.minimum('body', 999_999)).toBeUndefined()
    expect(observed.size).toBe(2)
  })

  it('coalesces observer signals and clears measurements and pending work when disabled or unmounted', async () => {
    const f = fixture()
    await flush()
    f.setHeight(200)
    f.setHeight(210)
    expect(frames.size).toBe(1)
    f.enabled.value = false
    await flush()
    expect(f.controller.minimum('body', 0)).toBeUndefined()
    expect(observed.size).toBe(0)
    expect(frames.size).toBe(0)
    f.enabled.value = true
    await flush()
    expect(f.controller.minimum('body', 0)).toBe(236)
    f.setHeight(300)
    unmount?.()
    unmount = undefined
    expect(frames.size).toBe(0)
    expect(observed.size).toBe(0)
  })
})
