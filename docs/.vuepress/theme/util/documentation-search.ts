export interface DocumentationSearchEntry {
  title: string
  path: string
  locale: string
  header?: string
  keywords?: string
  text: string
}
export function searchDocumentation(
  entries: DocumentationSearchEntry[],
  query: string,
  locale: string,
  limit = 8,
) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  const paths = new Set<string>()
  const pageCounts = new Map<string, number>()
  return entries
    .filter((entry) => entry.locale === locale)
    .map((entry) => {
      const title = `${entry.title} ${entry.keywords ?? ''}`.toLocaleLowerCase()
      const header = (entry.header ?? '').toLocaleLowerCase()
      const body = entry.text.toLocaleLowerCase()
      if (!terms.every((term) => `${title} ${header} ${body}`.includes(term)))
        return null
      const score = terms.reduce(
        (sum, term) =>
          sum +
          (title.includes(term)
            ? 100
            : header.includes(term)
              ? 70
              : entry.header
                ? 40
                : 20),
        0,
      )
      const position = body.indexOf(
        terms.find((term) => body.includes(term)) ?? '',
      )
      const start = Math.max(0, position - 35)
      const snippet = `${start ? '…' : ''}${entry.text.slice(start, start + 140)}${entry.text.length > start + 140 ? '…' : ''}`
      return { ...entry, score, snippet }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .filter((entry) => {
      if (paths.has(entry.path)) return false
      const page = entry.path.split('#')[0]
      const count = pageCounts.get(page) ?? 0
      if (count >= 3) return false
      paths.add(entry.path)
      pageCounts.set(page, count + 1)
      return true
    })
    .slice(0, limit)
}
export function isDocumentationSearchShortcut(
  event: Pick<
    KeyboardEvent,
    'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'isComposing'
  >,
) {
  return (
    !event.isComposing &&
    !event.altKey &&
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === 'k'
  )
}

export function searchNavigationAction(
  event: Pick<KeyboardEvent, 'key' | 'isComposing' | 'keyCode'>,
) {
  if (event.isComposing || event.keyCode === 229) return null
  if (event.key === 'ArrowDown') return 'next'
  if (event.key === 'ArrowUp') return 'previous'
  if (event.key === 'Enter') return 'open'
  return null
}
