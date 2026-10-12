import type { Page, Plugin } from '@vuepress/core'
import type { DocumentationSearchEntry } from '../util/documentation-search'
export function searchText(html: string) {
  return html
    .replace(/<(pre|script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(
      /&(?:amp|lt|gt|quot|apos|nbsp);/g,
      (entity) =>
        ({
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&apos;': "'",
          '&nbsp;': ' ',
        })[entity] ?? ' ',
    )
    .replace(/\s+/g, ' ')
    .trim()
}
export function indexDocumentationPage(
  page: Pick<Page, 'path' | 'title' | 'contentRendered' | 'frontmatter'>,
): DocumentationSearchEntry[] {
  const locale = page.path.startsWith('/zh/') ? '/zh/' : '/'
  const component = page.path.match(/\/components\/([^/.]+)/)?.[1]
  const pascal = component
    ?.split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join('')
  const keywords = component
    ? `${component} s-${component} ${pascal} S${pascal}`
    : ''
  const titles = page.frontmatter.API_TITLES
  const publicNames =
    titles && typeof titles === 'object' ? Object.values(titles).join(' ') : ''
  const common = {
    title: page.title,
    locale,
    keywords: `${keywords} ${publicNames}`,
  }
  const html = page.contentRendered
  const headers = [
    ...html.matchAll(/<h([23])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g),
  ]
  const entries: DocumentationSearchEntry[] = [
    {
      ...common,
      path: page.path,
      text: searchText(html.slice(0, headers[0]?.index)),
    },
  ]
  headers.forEach((header, index) =>
    entries.push({
      ...common,
      path: `${page.path}#${header[2]}`,
      header: searchText(header[3]).replace(/^#\s*/, ''),
      text: searchText(
        html.slice(
          (header.index ?? 0) + header[0].length,
          headers[index + 1]?.index,
        ),
      ),
    }),
  )
  const api = Object.values(page.frontmatter)
    .filter(Array.isArray)
    .flat()
    .filter((row) => row && typeof row === 'object' && 'name' in row)
  if (api.length)
    entries.push({
      ...common,
      path: `${page.path}#api`,
      header: 'API',
      text: api
        .map((row) =>
          searchText(
            [row.name, row.type, row.description, row.scope, row.values]
              .filter(Boolean)
              .join(' '),
          ),
        )
        .join(' '),
    })
  return entries
}
export const documentationSearchPlugin = (): Plugin => {
  const pages = new Map<string, DocumentationSearchEntry[]>()
  let write: (() => Promise<unknown>) | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  return {
    name: 'sax-documentation-search',
    extendsPage(page) {
      pages.set(page.path, indexDocumentationPage(page))
      if (write) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          write?.()
        }, 100)
      }
    },
    async onPrepared(app) {
      pages.clear()
      app.pages.forEach((page) =>
        pages.set(page.path, indexDocumentationPage(page)),
      )
      write = () =>
        app.writeTemp(
          'documentation-search/index.js',
          `export default ${JSON.stringify([...pages.values()].flat())}`,
        )
      await write()
    },
  }
}
