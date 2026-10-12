export const clampProgress = (value: number | undefined) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value!)) : 0

export const safeAgentHref = (href?: string) => {
  if (!href) return undefined
  try {
    const url = new URL(href)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : undefined
  } catch {
    return undefined
  }
}

export const downloadAgentText = (text: string, filename: string) => {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'text/plain;charset=utf-8' }),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  // Keep the URL alive until the browser has consumed the click.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
