import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  resolveTableDocumentationOverviewRedirect,
  shouldPreserveTableDocumentationApiHash,
  tableDocumentationLandingPath,
} from '../../docs/.vuepress/theme/shared/tableDocumentation'

const projectRoot = resolve(__dirname, '../..')

describe('Table documentation entry', () => {
  it('uses the first example chapter as the public Table landing page', () => {
    expect(tableDocumentationLandingPath('en')).toBe(
      '/components/table/data-and-column-definitions.html',
    )
    expect(tableDocumentationLandingPath('zh')).toBe(
      '/zh/components/table/data-and-column-definitions.html',
    )

    expect(
      resolveTableDocumentationOverviewRedirect('/components/table.html'),
    ).toBe('/components/table/data-and-column-definitions.html')
    expect(
      resolveTableDocumentationOverviewRedirect('/zh/components/table.html'),
    ).toBe('/zh/components/table/data-and-column-definitions.html')
    expect(
      resolveTableDocumentationOverviewRedirect(
        '/zh/components/table.html',
        '#api',
      ),
    ).toBeUndefined()
  })

  it('preserves the API hash only when active-header scrolling tries to clear it', () => {
    const api = { path: '/zh/components/table.html', hash: '#api' }
    const overview = { path: '/zh/components/table.html', hash: '' }
    expect(shouldPreserveTableDocumentationApiHash(overview, api, true)).toBe(
      true,
    )
    expect(shouldPreserveTableDocumentationApiHash(overview, api, false)).toBe(
      false,
    )
    expect(
      shouldPreserveTableDocumentationApiHash(
        { path: '/zh/components/table/data-and-column-definitions.html' },
        api,
        true,
      ),
    ).toBe(false)
  })

  it('removes the feature-guide block and points the sidebar at the landing page', () => {
    const componentCategories = readFileSync(
      resolve(projectRoot, 'docs/.vuepress/app/component-categories.ts'),
      'utf8',
    )
    expect(componentCategories).toContain(
      "'/components/table/data-and-column-definitions.html'",
    )

    const englishOverview = readFileSync(
      resolve(projectRoot, 'docs/components/table.md'),
      'utf8',
    )
    const chineseOverview = readFileSync(
      resolve(projectRoot, 'docs/zh/components/table.md'),
      'utf8',
    )
    expect(englishOverview).not.toContain('## Feature guides')
    expect(chineseOverview).not.toContain('## 功能指南')
  })
})
