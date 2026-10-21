// @vitest-environment node
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  collectFocusedExamples,
  filterFocusedNavigation,
  readDevScope,
} from '../../docs/.vuepress/node/devScope'
import {
  fileKey,
  documentationCache,
  documentationCacheRoot,
  flushDocumentationCaches,
  PersistentCache,
} from '../../docs/.vuepress/node/persistentCache'
import { collectDocumentationIconNames } from '../../docs/.vuepress/node/documentationIcons'
import { createApiTypeDetailsResolver } from '../../docs/.vuepress/theme/node/apiTypeDetails'
import { documentationStylesPlugin } from '../../docs/.vuepress/node/devStyles'

const fixtures: string[] = []
const fixture = () => {
  const base = process.env.SAX_DOCS_TEST_TMP || tmpdir()
  mkdirSync(base, { recursive: true })
  const root = mkdtempSync(join(base, 'sax-docs-cache-'))
  fixtures.push(root)
  return root
}
afterEach(() => {
  vi.unstubAllEnvs()
  fixtures
    .splice(0)
    .forEach((root) => rmSync(root, { recursive: true, force: true }))
})

describe('documentation development scope and caches', () => {
  it('isolates disk and in-process caches without deleting ordinary dev caches', () => {
    const first = fixture(),
      second = fixture()
    const compute = vi.fn(() => 'value')
    expect(documentationCacheRoot({})).toBe(
      resolve(__dirname, '../../docs/.vuepress/.cache'),
    )
    vi.stubEnv('SAX_DOCS_CACHE_ROOT', first)
    documentationCache('isolation', []).get('same', compute)
    vi.stubEnv('SAX_DOCS_CACHE_ROOT', second)
    documentationCache('isolation', []).get('same', compute)
    vi.stubEnv('SAX_DOCS_CACHE_ROOT', first)
    documentationCache('isolation', []).get('same', compute)
    expect(compute).toHaveBeenCalledTimes(2)
    flushDocumentationCaches()
    expect(
      readFileSync(join(first, 'sax-data/isolation.json'), 'utf8'),
    ).toContain('value')
    expect(
      readFileSync(join(second, 'sax-data/isolation.json'), 'utf8'),
    ).toContain('value')
  })

  it('reuses CSS across restarts and refreshes it after a source edit', async () => {
    const root = fixture(),
      cache = join(root, 'generated')
    vi.stubEnv('SAX_DOCS_CACHE_ROOT', cache)
    const styles = join(root, 'packages/theme-chalk/src')
    mkdirSync(join(styles, 'dark'), { recursive: true })
    mkdirSync(join(root, 'docs/.vuepress/node'), { recursive: true })
    writeFileSync(join(styles, 'index.scss'), '.probe { color: red; }')
    writeFileSync(join(styles, 'dark/css-vars.scss'), '.dark { --probe: 1; }')
    writeFileSync(join(root, 'pnpm-lock.yaml'), 'fixture')
    writeFileSync(join(root, 'docs/.vuepress/node/devStyles.ts'), 'fixture')
    const first = documentationStylesPlugin(root),
      warm = documentationStylesPlugin(root)
    const resolveStyle = (plugin: typeof first) =>
      (plugin.resolveId as (id: string) => Promise<string>)(
        '@vuesax-alpha/theme-chalk/src/index.scss',
      )
    const dispose = (plugin: typeof first) =>
      (plugin.closeBundle as () => Promise<void>)()
    try {
      const output = await resolveStyle(first)
      expect(output).toBe(join(cache, 'sax-styles/0.css'))
      expect(readFileSync(output, 'utf8')).toContain('color: red')
      const before = fileKey(output)
      await resolveStyle(warm)
      expect(fileKey(output)).toBe(before)
      writeFileSync(join(styles, 'index.scss'), '.probe { color: blue; }')
      await resolveStyle(first)
      expect(readFileSync(output, 'utf8')).toContain('color: blue')
    } finally {
      await dispose(first)
      await dispose(warm)
    }
  })

  it('keeps full mode by default, validates scope and includes nested Table pages', () => {
    const docs = resolve(__dirname, '../../docs')
    expect(readDevScope(docs, {}).pagePatterns).toBeUndefined()
    expect(
      readDevScope(docs, {
        SAX_DOCS_DEV_COMPONENT: 'table',
        SAX_DOCS_DEV_LOCALE: 'zh',
      }).pagePatterns,
    ).toContain('zh/components/table/**/*.md')
    expect(
      readDevScope(docs, { SAX_DOCS_DEV_COMPONENT: 'button' }).pagePatterns,
    ).toContain('components/README.md')
    expect(() =>
      readDevScope(docs, { SAX_DOCS_DEV_COMPONENT: '../input' }),
    ).toThrow()
    expect(() => readDevScope(docs, { SAX_DOCS_DEV_LOCALE: 'fr' })).toThrow()
    expect(() =>
      readDevScope(docs, { SAX_DOCS_DEV_COMPONENT: 'not-a-component' }),
    ).toThrow()
  })

  it('retains recursive globally referenced demos without unrelated examples', () => {
    const root = fixture()
    mkdirSync(join(root, 'input'))
    writeFileSync(
      join(root, 'input/basic.vue'),
      '<template><shared-example /></template>',
    )
    writeFileSync(
      join(root, 'shared-example.vue'),
      '<template><input-basic /></template>',
    )
    writeFileSync(join(root, 'other.vue'), '<template>unrelated</template>')
    expect(
      Object.keys(collectFocusedExamples(root, ['<input-basic />'])).sort(),
    ).toEqual(['input-basic', 'shared-example'])
  })

  it('filters navigation and search consistently while retaining support pages', () => {
    const scope = readDevScope(resolve(__dirname, '../../docs'), {
      SAX_DOCS_DEV_COMPONENT: 'textarea',
      SAX_DOCS_DEV_LOCALE: 'zh',
    })
    expect(
      filterFocusedNavigation(
        [
          { text: 'Guide', link: '/zh/guide/' },
          { text: 'Input', children: [{ link: '/zh/components/input.html' }] },
          {
            text: 'Textarea',
            children: [{ link: '/zh/components/textarea.html#size' }],
          },
          { path: '/components/textarea.html' },
          { path: '/zh/components/textarea.html' },
          { link: 'https://example.com' },
        ],
        scope,
      ),
    ).toEqual([
      { text: 'Guide', link: '/zh/guide/' },
      {
        text: 'Textarea',
        children: [{ link: '/zh/components/textarea.html#size' }],
      },
      { path: '/zh/components/textarea.html' },
      { link: 'https://example.com' },
    ])
  })

  it('reuses disk data and invalidates on implementation version or source changes', () => {
    const root = fixture()
    const disk = join(root, 'cache.json')
    const source = join(root, 'source.ts')
    writeFileSync(source, 'first')
    const compute = vi.fn(() => 'cached')
    const first = new PersistentCache(disk, 'v1')
    first.get(fileKey(source), compute)
    first.flush()
    const warm = new PersistentCache(disk, 'v1')
    expect(warm.get(fileKey(source), compute)).toBe('cached')
    expect(compute).toHaveBeenCalledTimes(1)
    writeFileSync(source, 'changed source')
    warm.get(fileKey(source), compute)
    new PersistentCache(disk, 'v2').get(fileKey(source), compute)
    expect(compute).toHaveBeenCalledTimes(3)
    writeFileSync(disk, '{broken')
    expect(new PersistentCache(disk, 'v1').get('new', () => 'recovered')).toBe(
      'recovered',
    )
  })

  it('preserves icon and recursive API results and picks up edited sources on restart', () => {
    const root = fixture()
    const component = join(root, 'sample')
    mkdirSync(component)
    const file = join(component, 'sample.ts')
    writeFileSync(
      file,
      "export type SampleSize = 'small' | 'large'\nexport interface SampleOption { size: SampleSize }\nconst icon = 'bx:user'",
    )
    const cache = new PersistentCache(join(root, 'cache.json'), 'v1')
    const cold = createApiTypeDetailsResolver(root)('sample', ['SampleOption'])
    expect(
      createApiTypeDetailsResolver(root, [], cache)('sample', ['SampleOption']),
    ).toEqual(cold)
    expect(collectDocumentationIconNames([root], ['bx'], [], cache)).toEqual(
      collectDocumentationIconNames([root], ['bx']),
    )
    cache.flush()
    const warm = new PersistentCache(join(root, 'cache.json'), 'v1')
    expect(
      createApiTypeDetailsResolver(root, [], warm)('sample', ['SampleOption']),
    ).toEqual(cold)
    expect(warm.hits).toBeGreaterThan(0)
    writeFileSync(
      file,
      readFileSync(file, 'utf8')
        .replace("'large'", "'default'")
        .replace('bx:user', 'bx:check'),
    )
    expect(
      createApiTypeDetailsResolver(root, [], warm)('sample', ['SampleSize'])
        .SampleSize.declaration,
    ).toContain('default')
    expect(collectDocumentationIconNames([root], ['bx'], [], warm)).toEqual([
      'bx:check',
    ])
  })
})
