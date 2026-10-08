import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

export const readDevScope = (docsRoot: string, env = process.env) => {
  const component = env.SAX_DOCS_DEV_COMPONENT || ''
  const locale = env.SAX_DOCS_DEV_LOCALE || 'both'
  if (component && !/^[a-z][a-z0-9-]*$/.test(component))
    throw new Error('Invalid docs component name')
  if (!['en', 'zh', 'both'].includes(locale))
    throw new Error('Docs locale must be en, zh or both')
  const name = component === 'button' ? 'README' : component
  if (
    component &&
    !existsSync(path.resolve(docsRoot, 'components', `${name}.md`))
  )
    throw new Error(`No documentation page for component: ${component}`)
  const prefixes =
    locale === 'both' ? ['', 'zh/'] : [locale === 'zh' ? 'zh/' : '']
  const focused = Boolean(component || locale !== 'both')
  const pagePatterns = focused
    ? prefixes.flatMap((prefix) => [
        `${prefix}README.md`,
        `${prefix}guide/**/*.md`,
        `${prefix}theme/**/*.md`,
        `${prefix}icons/**/*.md`,
        ...(component
          ? [
              `${prefix}components/${name}.md`,
              `${prefix}components/${component}/**/*.md`,
            ]
          : [`${prefix}components/**/*.md`]),
      ])
    : undefined
  return { component, locale, focused, prefixes, pagePatterns }
}

/** Keep globally referenced example helpers as well as the selected demos. */
export const collectFocusedExamples = (
  componentsRoot: string,
  pageSources: string[],
) => {
  const files = new Map<string, string>()
  const walk = (root: string) => {
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      const file = path.join(root, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (entry.name.endsWith('.vue'))
        files.set(
          path
            .relative(componentsRoot, file)
            .replaceAll('\\', '-')
            .replaceAll('/', '-')
            .slice(0, -4),
          file,
        )
    }
  }
  walk(componentsRoot)
  const selected: Record<string, string> = {}
  const visit = (source: string) => {
    for (const match of source.matchAll(/<([a-z][\w-]*)\b/g)) {
      const name = match[1]
      const file = files.get(name)
      if (file && !selected[name]) {
        selected[name] = file
        visit(readFileSync(file, 'utf8'))
      }
    }
  }
  pageSources.forEach(visit)
  return selected
}

export const filterFocusedNavigation = <T>(
  value: T,
  scope: ReturnType<typeof readDevScope>,
): T => {
  if (!scope.focused) return value
  const allowed = (link: string) =>
    !link.startsWith('/') ||
    scope.prefixes.some((prefix) => {
      const base = `/${prefix}`
      return (
        link === base ||
        ['guide/', 'theme/', 'icons/'].some((part) =>
          link.startsWith(base + part),
        ) ||
        (scope.component
          ? link.replace(/\.html(?=#|$)/, '').split('#')[0] ===
              base +
                (scope.component === 'button'
                  ? 'components/'
                  : `components/${scope.component}`) ||
            link.startsWith(`${base}components/${scope.component}/`)
          : link.startsWith(`${base}components/`))
      )
    })
  const visit = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(visit).filter(Boolean)
    if (!item || typeof item !== 'object') return item
    const node = item as Record<string, unknown>
    if (typeof node.link === 'string' && !allowed(node.link)) return undefined
    const result = { ...node }
    if (Array.isArray(node.children)) {
      result.children = visit(node.children)
      if (!(result.children as unknown[]).length) return undefined
    }
    if (typeof node.path === 'string' && !allowed(node.path)) return undefined
    return result
  }
  return visit(value) as T
}
