import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { compile } from 'sass'

const styles = resolve(process.cwd(), 'packages/theme-chalk/src')
const options = { logger: { warn: () => {}, debug: () => {} } }

describe('default theme entry', () => {
  it('ships dark surfaces and readable ink in the default CSS entry', () => {
    const css = compile(resolve(styles, 'base.scss'), options).css
    const dark = css.match(/html\.dark\s*\{([^}]+)\}/)?.[1]
    expect(dark).toBeDefined()
    // Cover both semantic surfaces (Table) and gray surfaces (Input/Select).
    for (const token of ['background', 'gray-1', 'gray-2', 'text']) {
      const values = [
        ...css.matchAll(new RegExp(`--sax-${token}:\\s*([^;]+);`, 'g')),
      ]
      expect(values.length).toBeGreaterThanOrEqual(2)
      expect(dark).toContain(`--sax-${token}:`)
      expect(values.at(-1)?.[1]).not.toBe(values[0]?.[1])
      expect(css).toContain(`--sax-css-${token}: hsl(var(--sax-${token}))`)
    }
  })

  it('retains the standalone dark entry for existing imports', () => {
    const css = compile(resolve(styles, 'dark/css-vars.scss'), options).css
    expect(css).toContain('html.dark')
    expect(css).toContain('--sax-background:')
    expect(css).toContain('--sax-text:')
  })
})
