import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('button tokens', () => {
  it('keeps the default content padding compact', () => {
    const source = readFileSync(
      join(process.cwd(), 'packages/theme-chalk/src/common/var.scss'),
      'utf8',
    )

    expect(source).toContain("'padding': 8px 12px")
    expect(source).not.toContain("'padding': 10px 16px")
  })

  it('keeps shared button sizes aligned with the component size scale', () => {
    const buttonSource = readFileSync(
      join(process.cwd(), 'packages/theme-chalk/src/button.scss'),
      'utf8',
    )
    const tableSource = readFileSync(
      join(process.cwd(), 'packages/theme-chalk/src/table.scss'),
      'utf8',
    )

    expect(buttonSource).toMatch(/--sax-button-height: 36px/)
    expect(buttonSource).toMatch(
      /@include m\(large\) \{\s*--sax-button-height: 40px/,
    )
    expect(buttonSource).toMatch(
      /@include m\(small\) \{\s*--sax-button-height: 32px/,
    )
    expect(tableSource).not.toMatch(
      /button__size--small[\s\S]*--sax-button-height/,
    )
  })
})
