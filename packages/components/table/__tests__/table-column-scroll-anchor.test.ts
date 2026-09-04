import { computed, defineComponent, h, nextTick, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTableColumnVirtualization } from '../src/composables/use-table-column-virtualization'
import type { TableColumn } from '../src/table'

let frames: Map<number, FrameRequestCallback>
let sequence = 0
const cleanups: (() => void)[] = []
const flush = async () => {
  await nextTick()
  await nextTick()
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach((callback) => callback(0))
  await nextTick()
}

function fixture(compressed = true) {
  const element = document.createElement('div')
  Object.defineProperty(element, 'clientWidth', { value: 800 })
  const reserved = shallowRef(280)
  const overrides = shallowRef<ReadonlyMap<number, number>>(new Map())
  const columns = shallowRef<TableColumn[]>(
    Array.from({ length: 20 }, () => ({ width: 140 })),
  )
  let controller!: ReturnType<typeof useTableColumnVirtualization>
  const wrapper = mount(
    defineComponent({
      setup() {
        controller = useTableColumnVirtualization({
          columns: computed(() => columns.value),
          ...(compressed
            ? {
                columnCount: computed(() => 100_000),
                uniformColumnWidth: computed(() => 140),
                columnWidthOverrides: computed(() => overrides.value),
              }
            : {}),
          horizontal: computed(() => true),
          overscan: computed(() => 0),
          scrollElement: shallowRef(element),
          reservedWidth: computed(() => reserved.value),
        })
        return () => h('div')
      },
    }),
  )
  const scroll = (left: number) => {
    element.scrollLeft = left
    controller.handleScroll({ currentTarget: element } as unknown as Event)
  }
  cleanups.push(() => wrapper.unmount())
  return { controller, element, reserved, overrides, columns, scroll, wrapper }
}

describe('Table horizontal scroll anchors during layout changes', () => {
  beforeEach(() => {
    frames = new Map()
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++sequence, callback)
      return sequence
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )
  })
  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup())
    vi.unstubAllGlobals()
  })

  it('keeps the last columns visible when a fixed band becomes wider', async () => {
    const f = fixture()
    await flush()
    f.scroll(100_000 - 520)
    await flush()
    expect(f.controller.range.value.end).toBe(100_000)
    f.reserved.value += 90
    await flush()
    expect(f.element.scrollLeft).toBe(100_000 - 430)
    expect(f.controller.logicalScrollLeft.value).toBe(14_000_000 - 430)
    expect(f.controller.range.value.end).toBe(100_000)
  })

  it('preserves the column and its pixel offset through sparse width changes', async () => {
    const f = fixture()
    await flush()
    const logical = 50_000 * 140 + 23
    f.scroll((logical / (14_000_000 - 520)) * (100_000 - 520))
    // A resize can happen before the queued native scroll frame is delivered.
    f.overrides.value = new Map([[20, 230]])
    await flush()
    expect(f.controller.logicalScrollLeft.value).toBeCloseTo(logical + 90)
    expect(f.controller.range.value.start).toBe(50_000)
  })

  it('keeps the same visible column for ordinary variable-width tracks', async () => {
    const f = fixture(false)
    await flush()
    f.scroll(5 * 140 + 23)
    await flush()
    f.columns.value = f.columns.value.map((column, index) =>
      index === 1 ? { width: 230 } : column,
    )
    await flush()
    expect(f.element.scrollLeft).toBe(5 * 140 + 23 + 90)
    expect(f.controller.range.value.start).toBe(5)
  })

  it('does not write a scheduled layout correction after unmount', async () => {
    const f = fixture()
    await flush()
    f.scroll(50_000)
    await flush()
    f.reserved.value += 90
    await nextTick()
    f.wrapper.unmount()
    f.element.scrollLeft = 7
    await flush()
    expect(f.element.scrollLeft).toBe(7)
    expect(frames.size).toBe(0)
  })
})
