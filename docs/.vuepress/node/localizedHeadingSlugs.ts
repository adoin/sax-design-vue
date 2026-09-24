import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { slugify } from '@mdit-vue/shared'
import { createMarkdown } from '@vuepress/markdown'
import type { AnchorPluginOptions } from '@vuepress/markdown'

type StatefulSlugify = NonNullable<AnchorPluginOptions['slugifyWithState']>

export const defaultHeadingSlugify = slugify

const canonicalMarkdown = createMarkdown({
  assets: false,
  emoji: false,
  headers: false,
  importCode: false,
  links: false,
  sfc: false,
  slugify: defaultHeadingSlugify,
  title: false,
  toc: false,
  vPre: false,
})

const canonicalSlugCache = new Map<
  string,
  { modifiedAt: number; slugs: string[] }
>()

const readCanonicalHeadingSlugs = (filePath: string) => {
  const modifiedAt = statSync(filePath).mtimeMs
  const cached = canonicalSlugCache.get(filePath)
  if (cached?.modifiedAt === modifiedAt) return cached.slugs

  const tokens = canonicalMarkdown.parse(readFileSync(filePath, 'utf8'), {
    filePath,
  })
  const slugs = tokens
    .filter((token) => token.type === 'heading_open')
    .map((token) => token.attrGet('id'))
    .filter((slug): slug is string => Boolean(slug))

  canonicalSlugCache.set(filePath, { modifiedAt, slugs })
  return slugs
}

const resolveCanonicalFile = (docsRoot: string, filePath?: string | null) => {
  if (!filePath) return

  const relativePath = path.relative(docsRoot, filePath)
  const segments = relativePath.split(path.sep)
  if (segments[0] !== 'zh' || segments.length === 1) return

  const canonicalFile = path.resolve(docsRoot, ...segments.slice(1))
  return existsSync(canonicalFile) ? canonicalFile : undefined
}

/**
 * Keeps localized heading labels while using the English document's heading
 * slugs as the canonical, shareable values for every locale.
 */
export const createLocalizedHeadingSlugify = (
  docsRoot: string,
): StatefulSlugify => {
  const cursorByRender = new WeakMap<object, number>()

  return (title, state) => {
    const canonicalFile = resolveCanonicalFile(
      docsRoot,
      (state.env as { filePath?: string | null }).filePath,
    )
    if (!canonicalFile) return defaultHeadingSlugify(title)

    const cursor = cursorByRender.get(state) ?? 0
    cursorByRender.set(state, cursor + 1)

    return (
      readCanonicalHeadingSlugs(canonicalFile)[cursor] ??
      defaultHeadingSlugify(title)
    )
  }
}
