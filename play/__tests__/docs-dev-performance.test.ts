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
  PersistentCache,
} from '../../docs/.vuepress/node/persistentCache'
import { collectDocumentationIconNames } from '../../docs/.vuepress/node/documentationIcons'
import { createApiTypeDetailsResolver } from '../../docs/.vuepress/theme/node/apiTypeDetails'

const fixtures: string[] = []
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'sax-docs-cache-'))
  fixtures.push(root)
  return root
}
afterEach(() =>
  fixtures
    .splice(0)
    .forEach((root) => rmSync(root, { recursive: true, force: true })),
)

describe('documentation development scope and caches', () => {
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
