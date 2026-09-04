export interface TableClipboardWork {
  signal?: AbortSignal
  current?: () => boolean
  /** Internal scheduler override used by deterministic interaction tests. */
  yieldControl?: () => Promise<void>
}

export function createTableClipboardWork(options: TableClipboardWork) {
  const check = () => {
    if (options.signal?.aborted || options.current?.() === false)
      throw new DOMException(
        'Table clipboard operation cancelled',
        'AbortError',
      )
  }
  let visited = 0
  let time = performance.now()
  const checkpoint = (): Promise<void> | undefined => {
    check()
    if (++visited < 128 && performance.now() - time < 8) return
    visited = 0
    return new Promise<void>((resolve, reject) => {
      const abort = () => {
        cleanup()
        reject(
          new DOMException('Table clipboard operation cancelled', 'AbortError'),
        )
      }
      const cleanup = () => options.signal?.removeEventListener('abort', abort)
      options.signal?.addEventListener('abort', abort, { once: true })
      Promise.resolve()
        .then(() => {
          check()
          return (
            options.yieldControl?.() ??
            new Promise<void>((done) => setTimeout(done, 0))
          )
        })
        .then(() => {
          check()
          time = performance.now()
          resolve()
        })
        .catch(reject)
        .finally(cleanup)
      if (options.signal?.aborted) abort()
    })
  }
  return { check, checkpoint }
}
