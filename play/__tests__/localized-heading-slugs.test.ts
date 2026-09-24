import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { resolveTitleFromToken } from '@mdit-vue/shared'
import { createMarkdown } from '@vuepress/markdown'
import { describe, expect, it } from 'vitest'
import { createLocalizedHeadingSlugify } from '../../docs/.vuepress/node/localizedHeadingSlugs'

const projectRoot = path.resolve(__dirname, '../..')
const docsRoot = path.resolve(projectRoot, 'docs')
const zhRoot = path.resolve(docsRoot, 'zh')
const localizedSlugify = createLocalizedHeadingSlugify(docsRoot)
const markdown = createMarkdown({
  anchor: { slugifyWithState: localizedSlugify },
  assets: false,
  emoji: false,
  headers: { level: [2, 3], shouldAllowNested: true },
  importCode: false,
  links: false,
  sfc: false,
  title: false,
  toc: false,
  vPre: false,
})

const markdownFiles = (root: string): string[] =>
  readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.resolve(root, entry.name)
    if (entry.isDirectory()) return markdownFiles(filePath)
    return entry.isFile() && entry.name.endsWith('.md') ? [filePath] : []
  })

const headings = (filePath: string) => {
  const tokens = markdown.parse(readFileSync(filePath, 'utf8'), {
    filePath,
    filePathRelative: path.relative(docsRoot, filePath),
  })

  return tokens.flatMap((token, index) => {
    if (token.type !== 'heading_open' || !['h2', 'h3'].includes(token.tag))
      return []

    const inlineToken = tokens[index + 1]
    const slug = token.attrGet('id')
    if (!inlineToken || !slug) return []

    return [
      {
        level: Number(token.tag.slice(1)),
        title: resolveTitleFromToken(inlineToken, {
          shouldAllowHtml: true,
          shouldEscapeText: false,
        }),
        slug,
      },
    ]
  })
}

const slugs = (items: ReturnType<typeof headings>) =>
  items.map((item) => item.slug)

describe('localized documentation heading slugs', () => {
  it('refreshes canonical slugs when the English headings change during development', () => {
    const temporaryDocsRoot = mkdtempSync(
      path.resolve(tmpdir(), 'sax-heading-slugs-'),
    )
    const englishFile = path.resolve(temporaryDocsRoot, 'card.md')
    const chineseFile = path.resolve(temporaryDocsRoot, 'zh/card.md')
    mkdirSync(path.dirname(chineseFile), { recursive: true })
    writeFileSync(chineseFile, '# Card\n\n## 默认\n\n## 经典图文\n')
    writeFileSync(englishFile, '# Card\n\n## Types\n\n## Default\n')

    const localMarkdown = createMarkdown({
      anchor: {
        slugifyWithState: createLocalizedHeadingSlugify(temporaryDocsRoot),
      },
      assets: false,
      emoji: false,
      headers: false,
      importCode: false,
      links: false,
      sfc: false,
      title: false,
      toc: false,
      vPre: false,
    })
    const readSlugs = () =>
      localMarkdown
        .parse(readFileSync(chineseFile, 'utf8'), { filePath: chineseFile })
        .filter((token) => token.type === 'heading_open')
        .map((token) => token.attrGet('id'))

    try {
      expect(readSlugs()).toEqual(['card', 'types', 'default'])
      writeFileSync(englishFile, '# Card\n\n## Default\n\n## Classic\n')
      const changedTime = new Date(Date.now() + 5000)
      utimesSync(englishFile, changedTime, changedTime)
      expect(readSlugs()).toEqual(['card', 'default', 'classic'])
    } finally {
      rmSync(temporaryDocsRoot, { recursive: true, force: true })
    }
  })

  it('uses the English heading values for every paired Chinese document', () => {
    for (const zhFile of markdownFiles(zhRoot)) {
      const canonicalFile = path.resolve(
        docsRoot,
        path.relative(zhRoot, zhFile),
      )
      expect(slugs(headings(zhFile)), zhFile).toEqual(
        slugs(headings(canonicalFile)),
      )
    }
  })

  it('keeps Table labels localized with stable English anchor values', () => {
    const tableHeaders = headings(
      path.resolve(zhRoot, 'components/table/row-selection.md'),
    )
    const rowSelectionIndex = tableHeaders.findIndex(
      (item) => item.title === '行选择',
    )
    const rowSelection = tableHeaders[rowSelectionIndex]

    expect(rowSelection?.slug).toBe('row-selection')
    expect(
      tableHeaders
        .slice(rowSelectionIndex + 1, rowSelectionIndex + 4)
        .map((item) => [item.title, item.slug]),
    ).toEqual([
      ['单选', 'single-selection'],
      ['多选', 'multiple-selection'],
      ['高亮选择', 'highlight-selection'],
    ])
  })

  it('keeps frontmatter usage hashes locale-independent', () => {
    for (const zhFile of markdownFiles(zhRoot)) {
      expect(readFileSync(zhFile, 'utf8'), zhFile).not.toMatch(
        /usage:\s*['"]#[^'"]*\p{Script=Han}/u,
      )
    }
  })

  it('links Table API usage to the routed guide that owns each example', () => {
    for (const relativePath of [
      'components/table.md',
      'zh/components/table.md',
    ]) {
      const source = readFileSync(path.resolve(docsRoot, relativePath), 'utf8')
      const usageLinks = Array.from(
        source.matchAll(/usage:\s*['"](\/[^'"]+)['"]/g),
        (match) => match[1],
      )

      expect(usageLinks.length).toBeGreaterThan(100)
      expect(source).not.toMatch(/usage:\s*['"]#/)

      for (const usage of usageLinks) {
        const [route, hash] = usage.split('#')
        const target = path.resolve(
          docsRoot,
          `${route.replace(/^\//, '').replace(/\.html$/, '')}.md`,
        )

        expect(existsSync(target), usage).toBe(true)
        expect(slugs(headings(target)), usage).toContain(hash)
      }
    }
  })
})
