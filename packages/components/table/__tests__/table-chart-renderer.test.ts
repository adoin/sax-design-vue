import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTableChartRenderer } from '../src/chart-renderer'
import { createTableSvgChartAdapter } from '../src/chart-svg-adapter'
import type {
  TableChartHandle,
  TableChartRenderContext,
} from '../src/table-chart'

const context: Omit<TableChartRenderContext, 'signal'> = {
  type: 'bar',
  theme: {
    primary: 'hsl(220 90% 55%)',
    text: 'hsl(220 30% 20%)',
    background: 'white',
  },
  data: {
    scope: 'filtered',
    categories: ['A', 'B', 'C'],
    points: [{ key: 1 }, { key: 2 }, { key: 3 }],
    series: [{ key: 'v', name: 'Value', values: [3, null, -2] }],
  },
}
afterEach(() => vi.unstubAllGlobals())
const host = () => {
  const root = document.createElement('div')
  root.getBoundingClientRect = () => ({ width: 640, height: 320 }) as DOMRect
  return root
}

describe('Table chart adapter lifecycle', () => {
  it('mounts once, coalesces resizes, and disposes/aborts on clear', async () => {
    let notify!: ResizeObserverCallback
    const disconnect = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          notify = callback
        }
        observe() {}
        disconnect = disconnect
      },
    )
    let frame!: FrameRequestCallback
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback) => {
        frame = callback
        return 1
      }),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    const handle = { resize: vi.fn(), dispose: vi.fn() }
    let signal!: AbortSignal
    const error = vi.fn()
    const renderer = createTableChartRenderer(error)
    const root = host()
    expect(
      await renderer.render(
        root,
        {
          mount: (_, ctx) => {
            signal = ctx.signal
            return handle
          },
        },
        context,
      ),
    ).toBe(true)
    expect(handle.resize).toHaveBeenLastCalledWith(640, 320)
    notify([], {} as ResizeObserver)
    notify([], {} as ResizeObserver)
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
    frame(1)
    expect(handle.resize).toHaveBeenCalledTimes(2)
    renderer.clear()
    renderer.clear()
    expect(signal.aborted).toBe(true)
    expect(handle.dispose).toHaveBeenCalledTimes(1)
    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(root.children).toHaveLength(0)
    expect(error).not.toHaveBeenCalled()
  })

  it('settles cancellation without waiting for a noncooperative mount, then disposes its late handle', async () => {
    const root = host()
    const renderer = createTableChartRenderer(vi.fn())
    let resolve!: (handle: TableChartHandle) => void
    let oldContainer!: HTMLElement
    const pending = renderer.render(
      root,
      {
        mount: (container) => {
          oldContainer = container
          return new Promise((done) => {
            resolve = done
          })
        },
      },
      context,
    )
    renderer.clear()
    expect(await pending).toBe(false)
    await renderer.render(
      root,
      {
        mount: (container) => {
          container.textContent = 'current'
          return { dispose() {} }
        },
      },
      context,
    )
    oldContainer.textContent = 'stale'
    const dispose = vi.fn()
    resolve({ dispose })
    await Promise.resolve()
    expect(dispose).toHaveBeenCalledOnce()
    expect(root.textContent).toBe('current')
    renderer.clear()
  })

  it('remounts with changed data/type/theme and releases the preceding handle', async () => {
    const dispose = vi.fn()
    const mount = vi.fn(() => ({ dispose }))
    const renderer = createTableChartRenderer(vi.fn())
    const root = host()
    await renderer.render(root, { mount }, context)
    await renderer.render(
      root,
      { mount },
      { ...context, type: 'line', theme: { ...context.theme, text: 'white' } },
    )
    expect(dispose).toHaveBeenCalledOnce()
    expect(mount.mock.calls).toHaveLength(2)
    expect(root.children).toHaveLength(1)
    renderer.clear()
  })

  it('reports active failures, removes the failed surface, and permits retry', async () => {
    const error = vi.fn()
    const renderer = createTableChartRenderer(error)
    const root = host()
    const failure = new Error('engine failed')
    expect(
      await renderer.render(
        root,
        { mount: () => Promise.reject(failure) },
        context,
      ),
    ).toBe(false)
    expect(error).toHaveBeenCalledWith(failure)
    expect(root.children).toHaveLength(0)
    expect(
      await renderer.render(root, createTableSvgChartAdapter(), context),
    ).toBe(true)
    renderer.clear()
  })
})

describe('Optional SVG chart adapter', () => {
  it('draws positive/negative bars with missing values as gaps, resizes, and cleans up', () => {
    const root = host()
    const handle = createTableSvgChartAdapter().mount(root, {
      ...context,
      signal: new AbortController().signal,
    }) as TableChartHandle
    handle.resize!(640, 320)
    const bars = root.querySelectorAll('rect')
    expect(bars).toHaveLength(2)
    expect(Number(bars[0].getAttribute('y'))).toBeLessThan(
      Number(bars[1].getAttribute('y')),
    )
    expect(root.textContent).toContain('Value · A: 3')
    handle.resize!(390, 280)
    expect(root.querySelector('svg')?.getAttribute('viewBox')).toBe(
      '0 0 390 280',
    )
    handle.dispose()
    handle.resize!(800, 500)
    expect(root.children).toHaveLength(0)
  })
  it('breaks lines at missing values and safely renders untrusted labels as text', () => {
    const root = host()
    const handle = createTableSvgChartAdapter().mount(root, {
      ...context,
      type: 'line',
      data: {
        ...context.data,
        categories: ['<img onerror=alert(1)>', 'B', 'C'],
      },
      signal: new AbortController().signal,
    }) as TableChartHandle
    handle.resize!(640, 320)
    expect(
      root.querySelector('path')?.getAttribute('d')?.match(/M/g),
    ).toHaveLength(2)
    expect(root.querySelectorAll('circle')).toHaveLength(2)
    expect(root.querySelector('img')).toBeNull()
    handle.dispose()
  })
  it.each([
    { values: [0, 0, 0] },
    { values: [Number.MAX_VALUE, -Number.MAX_VALUE, null] },
    { values: [null, null, null] },
  ])(
    'keeps SVG geometry finite for extreme/empty domains $values',
    ({ values }) => {
      const root = host()
      const handle = createTableSvgChartAdapter().mount(root, {
        ...context,
        data: {
          ...context.data,
          series: [{ key: 'v', name: 'Value', values }],
        },
        signal: new AbortController().signal,
      }) as TableChartHandle
      handle.resize!(320, 280)
      expect(root.innerHTML).not.toMatch(/NaN|Infinity/)
      handle.dispose()
    },
  )
})
