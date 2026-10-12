import { describe, expect, it } from 'vitest'
import {
  indexDocumentationPage,
  searchText,
} from '../../docs/.vuepress/theme/node/documentationSearch'
import {
  isDocumentationSearchShortcut,
  searchDocumentation,
  searchNavigationAction,
} from '../../docs/.vuepress/theme/util/documentation-search'

describe('Documentation search', () => {
  const entries = indexDocumentationPage({
    path: '/zh/components/skeleton.html',
    title: 'Skeleton 骨架屏',
    contentRendered:
      '<h1>Skeleton</h1><h2 id="declarative-rows">声明行布局</h2><p>嵌套多行并保留可用宽度</p><pre>hidden-source-token</pre>',
    frontmatter: { PROPS: [{ name: 'repeat', description: '重复整组布局' }] },
  })
  it('indexes body sections and API descriptions without example source code', () => {
    expect(searchDocumentation(entries, '可用宽度', '/zh/')[0].path).toBe(
      '/zh/components/skeleton.html#declarative-rows',
    )
    expect(searchDocumentation(entries, '重复整组', '/zh/')[0].path).toBe(
      '/zh/components/skeleton.html#api',
    )
    expect(searchDocumentation(entries, 'hidden-source-token', '/zh/')).toEqual(
      [],
    )
  })
  it('normalizes queries, respects locale, and matches multiple terms', () => {
    expect(
      searchDocumentation(entries, '  SKELETON  ', '/zh/').length,
    ).toBeGreaterThan(0)
    expect(
      searchDocumentation(entries, 'Skeleton 多行', '/zh/')[0].header,
    ).toBe('声明行布局')
    expect(searchDocumentation(entries, '多行', '/')).toEqual([])
    expect(searchDocumentation(entries, '  ', '/zh/')).toEqual([])
    expect(searchDocumentation(entries, 'SSkeleton', '/zh/')[0].title).toBe(
      'Skeleton 骨架屏',
    )
  })
  it('recognizes Windows and Mac shortcuts without hijacking composition or Alt combinations', () => {
    const event = {
      key: 'k',
      ctrlKey: true,
      metaKey: false,
      altKey: false,
      isComposing: false,
    }
    expect(isDocumentationSearchShortcut(event)).toBe(true)
    expect(
      isDocumentationSearchShortcut({
        ...event,
        ctrlKey: false,
        metaKey: true,
      }),
    ).toBe(true)
    expect(isDocumentationSearchShortcut({ ...event, isComposing: true })).toBe(
      false,
    )
    expect(isDocumentationSearchShortcut({ ...event, altKey: true })).toBe(
      false,
    )
    expect(searchText('<p>A &amp; B</p>')).toBe('A & B')
  })
  it('does not open a result when Enter commits IME composition', () => {
    expect(
      searchNavigationAction({ key: 'Enter', isComposing: true, keyCode: 13 }),
    ).toBeNull()
    expect(
      searchNavigationAction({
        key: 'Enter',
        isComposing: false,
        keyCode: 229,
      }),
    ).toBeNull()
    expect(
      searchNavigationAction({ key: 'Enter', isComposing: false, keyCode: 13 }),
    ).toBe('open')
  })
})
