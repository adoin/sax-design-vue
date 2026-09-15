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

const transitionDeclarations = (source: string) =>
  Array.from(
    source.matchAll(/(?<![$\w-])transition(?:-property)?\s*:\s*([^;]+);/g),
    (match) => ({ index: match.index, value: match[1] }),
  )

const lineAt = (source: string, index: number) =>
  source.slice(0, index).split(/\r?\n/).length

describe('theme motion contract', () => {
  it('does not animate every CSS property implicitly', () => {
    const violations = styleFiles.flatMap((file) => {
      const source = withoutComments(readFileSync(file, 'utf8'))

      return transitionDeclarations(source).flatMap((declaration) => {
        if (!/\ball\b/.test(declaration.value)) return []
        return [
          `${relative(process.cwd(), file)}:${lineAt(source, declaration.index)}`,
        ]
      })
    })

    expect(violations).toEqual([])
  })

  it('does not ship suspicious multi-second interaction transitions', () => {
    const violations = styleFiles.flatMap((file) => {
      const source = withoutComments(readFileSync(file, 'utf8'))

      return transitionDeclarations(source).flatMap((declaration) => {
        const seconds = Array.from(
          declaration.value.matchAll(/(?:^|[\s,(])(\d*\.?\d+)s\b/g),
          (match) => Number(match[1]),
        )
        if (!seconds.some((duration) => duration >= 2)) return []
        return [
          `${relative(process.cwd(), file)}:${lineAt(source, declaration.index)}`,
        ]
      })
    })

    expect(violations).toEqual([])
  })

  it('keeps a global reduced-motion fallback for every namespaced component', () => {
    const source = readFileSync(
      join(themeSource, 'common/transition.scss'),
      'utf8',
    )

    expect(source).toContain('@media (prefers-reduced-motion: reduce)')
    expect(source).toContain("[class^='#{$namespace}-']")
    expect(source).toContain("[class*=' #{$namespace}-']")
    expect(source).toContain('transition-duration: 0.01ms !important')
    expect(source).toContain('animation-iteration-count: 1 !important')
  })

  it('publishes the usage-based motion token scale', () => {
    const source = readFileSync(join(themeSource, 'var.scss'), 'utf8')

    expect(source).toContain("set-var-value('motion-duration-micro', 80ms)")
    expect(source).toContain("set-var-value('motion-duration-quick', 150ms)")
    expect(source).toContain("set-var-value('motion-duration-medium', 350ms)")
    expect(source).toContain("set-var-value('motion-duration-slow', 400ms)")
    expect(source).toContain("'motion-easing-smooth-out'")
    expect(source).toContain("set-var-value('motion-distance-base', 8px)")
    expect(source).toContain("set-var-value('motion-scale-large', 0.96)")
    expect(source).toContain("set-var-value('motion-blur-small', 2px)")
  })
})
