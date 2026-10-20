import type { SaxIconData } from './icon'

/** Keep paint server IDs stable per instance in static, animated and SSR output. */
export const scopeIconData = (
  data: SaxIconData | undefined,
  prefix: string,
): SaxIconData | undefined => {
  if (!data || !/\bid\s*=/.test(data.body)) return data
  const ids = new Map<string, string>()
  const body = data.body.replace(
    /(\s)id\s*=\s*(["'])([^"']+)\2/g,
    (_, space, quote, id: string) => {
      const scoped = `${prefix}-${id}`
      ids.set(id, scoped)
      return `${space}id=${quote}${scoped}${quote}`
    },
  )
  const references = (value: string) =>
    value
      .replace(
        /url\(\s*(["']?)#([^\s)"']+)\1\s*\)/g,
        (match, _quote, id: string) =>
          ids.has(id) ? `url(#${ids.get(id)})` : match,
      )
      .replace(
        /\b((?:xlink:)?href)\s*=\s*(["'])#([^"']+)\2/g,
        (match, key, quote, id: string) =>
          ids.has(id) ? `${key}=${quote}#${ids.get(id)}${quote}` : match,
      )
      .replace(
        /\b(aria-labelledby|aria-describedby)\s*=\s*(["'])([^"']+)\2/g,
        (_match, key, quote, value: string) =>
          `${key}=${quote}${value
            .split(/\s+/)
            .map((id) => ids.get(id) ?? id)
            .join(' ')}${quote}`,
      )
  const attributes: Record<string, string> = {}
  for (const [key, value] of Object.entries(data.attributes)) {
    attributes[key] =
      key === 'aria-labelledby' || key === 'aria-describedby'
        ? value
            .split(/\s+/)
            .map((id) => ids.get(id) ?? id)
            .join(' ')
        : references(value)
  }
  return { body: references(body), attributes }
}
