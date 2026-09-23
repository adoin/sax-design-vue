import { join } from 'node:path'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

const themeSource = join(process.cwd(), 'packages/theme-chalk/src')

describe('Steps theme', () => {
  it('resolves semantic colors instead of emitting literal Sass calls', () => {
    const css = compile(join(themeSource, 'steps.scss'), {
      loadPaths: [themeSource],
    }).css

    expect(css).not.toContain('getColor(')
    expect(css).toContain('--s-steps-state-color:')
    expect(css).toContain('.s-steps__check')
    expect(css).toContain('stroke: currentColor')
    expect(css).toContain('.s-steps__item--success .s-steps__marker')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
  })

  it('anchors the check to the marker center without scaling it on hover', () => {
    const css = compile(join(themeSource, 'steps.scss'), {
      loadPaths: [themeSource],
    }).css

    expect(css).toMatch(/\.s-steps__check\s*\{[^}]*top: 50%;[^}]*left: 50%/)
    expect(css).toContain('transform: translate(-50%, -50%)')
    expect(css).toContain('transform: translateX(-5.9%)')
    expect(css).not.toContain('scale(1.04)')
  })
})
