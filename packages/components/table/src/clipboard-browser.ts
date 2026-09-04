/** Race external work without retaining an abort listener after it settles. */
export function awaitTableClipboard<T>(
  work: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => {
      signal.removeEventListener('abort', abort)
      reject(
        new DOMException('Table clipboard operation cancelled', 'AbortError'),
      )
    }
    signal.addEventListener('abort', abort, { once: true })
    work
      .then(resolve, reject)
      .finally(() => signal.removeEventListener('abort', abort))
    if (signal.aborted) abort()
  })
}

/** Start the OS write within the gesture, even when preparing its text must yield. */
export function writeTableClipboard(
  root: HTMLElement | undefined,
  text: Promise<string>,
): Promise<void> {
  const view = root?.ownerDocument.defaultView
  const clipboard = view?.navigator.clipboard
  // Always consume the preparation promise, including unsupported environments.
  if (!clipboard)
    return text.then(() => {
      throw new Error('Clipboard API is unavailable')
    })
  const Item = (view as unknown as { ClipboardItem?: typeof ClipboardItem })
    .ClipboardItem
  if (Item && clipboard.write) {
    const blob = text.then((value) => new Blob([value], { type: 'text/plain' }))
    // Native write can reject before it starts consuming the promised payload.
    blob.catch(() => {})
    try {
      return clipboard.write([new Item({ 'text/plain': blob })])
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return text.then((value) => clipboard.writeText(value))
}

export function readTableClipboard(
  root: HTMLElement | undefined,
): Promise<string> {
  const clipboard = root?.ownerDocument.defaultView?.navigator.clipboard
  if (!clipboard?.readText)
    return Promise.reject(new Error('Clipboard API is unavailable'))
  try {
    return clipboard.readText()
  } catch (error) {
    return Promise.reject(error)
  }
}
