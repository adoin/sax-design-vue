// @vitest-environment node
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { collectDocumentationIconNames } from '../../docs/.vuepress/node/documentationIcons'

describe('documentation icon environment', () => {
  it('collects static and dynamic project icon names without entire collections', () => {
    const root = resolve(__dirname, '../..')
    const names = collectDocumentationIconNames([
      resolve(root, 'docs/.vuepress/components'),
      resolve(root, 'docs/.vuepress/theme'),
      resolve(root, 'packages/components'),
    ], ['cb', 'bx', 'bxl', 'bxs'], ['cb:notification'])
    expect(names).toContain('bx:user')
    expect(names).toContain('bx:lock-open-alt')
    expect(names).toContain('bxl:github')
    expect(names).toContain('cb:notification')
    expect(names).not.toContain('sax:close')
    expect(new Set(names).size).toBe(names.length)
    expect(names.length).toBeLessThan(1000)
  })
})
