import type {
  TableChartAdapter,
  TableChartHandle,
  TableChartRenderContext,
} from './table-chart'

interface Render {
  container: HTMLDivElement
  controller: AbortController
  handle?: TableChartHandle
  observer?: ResizeObserver
  frame?: number
  disposed: boolean
}

/** Isolate late asynchronous mounts so they cannot write into a newer chart. */
export function createTableChartRenderer(onError: (error: unknown) => void) {
  let active: Render | undefined
  const report = (fn: () => void) => {
    try {
      fn()
    } catch (error) {
      onError(error)
    }
  }
  const release = (item: Render) => {
    if (item.disposed) return
    item.disposed = true
    item.controller.abort()
    item.observer?.disconnect()
    if (item.frame != null) cancelAnimationFrame(item.frame)
    item.container.remove()
    if (item.handle) report(() => item.handle!.dispose())
  }
  const clear = () => {
    const previous = active
    active = undefined
    if (previous) release(previous)
  }
  const render = async (
    root: HTMLElement,
    adapter: TableChartAdapter,
    context: Omit<TableChartRenderContext, 'signal'>,
  ) => {
    clear()
    const item: Render = {
      container: root.ownerDocument.createElement('div'),
      controller: new AbortController(),
      disposed: false,
    }
    item.container.style.cssText =
      'width:100%;height:100%;min-width:0;overflow:hidden'
    active = item
    root.append(item.container)
    const resize = () => {
      if (item.disposed || !item.handle) return
      const { width, height } = root.getBoundingClientRect()
      if (width > 0 && height > 0)
        report(() => item.handle!.resize?.(width, height))
    }
    let detach = () => {}
    try {
      const mounting = Promise.resolve(
        adapter.mount(item.container, {
          ...context,
          theme: Object.freeze({ ...context.theme }),
          signal: item.controller.signal,
        }),
      ).then((handle) => {
        if (!handle || typeof handle.dispose !== 'function')
          throw new TypeError('Chart adapter must return a disposable handle')
        if (item.disposed) report(() => handle.dispose())
        else item.handle = handle
      })
      const cancelled = new Promise<void>((_, reject) => {
        const abort = () =>
          reject(new DOMException('Chart rendering cancelled', 'AbortError'))
        item.controller.signal.addEventListener('abort', abort, { once: true })
        detach = () =>
          item.controller.signal.removeEventListener('abort', abort)
        if (item.controller.signal.aborted) abort()
      })
      await Promise.race([mounting, cancelled])
      if (item.disposed) return false
      if (typeof ResizeObserver !== 'undefined') {
        item.observer = new ResizeObserver(() => {
          if (item.frame != null || item.disposed) return
          item.frame = requestAnimationFrame(() => {
            item.frame = undefined
            resize()
          })
        })
        item.observer.observe(root)
      }
      resize()
      return true
    } catch (error) {
      if (!item.disposed) {
        if (active === item) active = undefined
        release(item)
        onError(error)
      }
      return false
    } finally {
      detach()
    }
  }
  return { render, clear }
}
