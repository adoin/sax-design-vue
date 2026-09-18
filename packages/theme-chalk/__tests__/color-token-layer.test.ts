import { readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const themeSource = join(process.cwd(), 'packages/theme-chalk/src')

const collectStyleFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return collectStyleFiles(path)
    return ['.scss', '.css'].includes(extname(entry.name)) ? [path] : []
  })

const styleFiles = collectStyleFiles(themeSource)

const withoutComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

const lineAt = (source: string, index: number) =>
  source.slice(0, index).split(/\r?\n/).length

describe('theme color token layer', () => {
  it('defines complete CSS colors from HSL channel tokens', () => {
    const source = readFileSync(join(themeSource, 'mixins/_var.scss'), 'utf8')

    expect(source).toContain('@mixin set-css-color($args...)')
    expect(source).toContain(
      '#{getCssColorName($args...)}: hsl(#{getCssVar($args...)})',
    )
    expect(source).toContain('@include set-css-color($type)')
  })

  it('consumes complete CSS colors instead of inlining hsl(var(--sax-*))', () => {
    const violations = styleFiles.flatMap((file) => {
      const source = withoutComments(readFileSync(file, 'utf8'))
      return Array.from(
        source.matchAll(/hsl\(\s*var\(--sax-[a-z0-9-]+\)/g),
        (match) =>
          `${relative(process.cwd(), file)}:${lineAt(source, match.index ?? 0)}`,
      )
    })

    expect(violations).toEqual([])
  })

  it('keeps the current-color slot local so component overrides are not frozen', () => {
    const source = readFileSync(join(themeSource, 'var.scss'), 'utf8')

    expect(source).toContain("set-color('color', $color-base, false)")
    expect(source).toContain('@include set-css-color(color)')
  })
})
