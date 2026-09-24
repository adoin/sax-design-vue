import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(
  join(process.cwd(), 'packages/theme-chalk/src/text.scss'),
  'utf8',
)

describe('Text effects theme', () => {
  it('implements the shimmer effect with currentColor, RTL and reduced-motion parity', () => {
    expect(source).toMatch(
      /@include when\(shimmer\)[\s\S]*--s-text-shimmer-base: currentColor;[\s\S]*background-clip: text;[\s\S]*animation: s-text-shimmer var\(--s-text-shimmer-duration\) linear infinite/,
    )
    expect(source).toMatch(
      /&:where\(\[dir='rtl'\], \[dir='rtl'\] \*\) \{\s*animation-direction: reverse/,
    )
    expect(source).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.#\{\$namespace\}-text\.is-shimmer \{[\s\S]*background-image: none;[\s\S]*-webkit-text-fill-color: currentColor;[\s\S]*animation: none/,
    )
  })

  it('adapts rainbow, neon and shadow effects with reduced-motion fallbacks', () => {
    expect(source).toMatch(
      /@include when\(rainbow\) \{\s*animation: s-text-rainbow 4s linear infinite/,
    )
    expect(source).toMatch(
      /@include when\(neon\)[\s\S]*animation: s-text-neon 1\.5s ease-in-out infinite alternate/,
    )
    expect(source).toMatch(
      /@include when\(shadow\)[\s\S]*&\[data-text\]::after[\s\S]*animation: s-text-shadow-follow 3s ease-in-out infinite/,
    )
    expect(source).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.#\{\$namespace\}-text\.is-rainbow[\s\S]*\.#\{\$namespace\}-text\.is-neon[\s\S]*\.#\{\$namespace\}-text\.is-shadow/,
    )
    expect(source).toMatch(
      /\.#\{\$namespace\}-text\.is-rainbow \{\s*background: none;\s*color: getColor\(primary\);\s*animation: none;\s*-webkit-text-fill-color: currentColor/,
    )
  })
})
