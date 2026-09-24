import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(
  join(process.cwd(), 'packages/theme-chalk/src/input.scss'),
  'utf8',
)

describe('Input action motion', () => {
  it('reveals clear and visibility actions in place without replacing centering', () => {
    expect(source).not.toContain('@keyframes clearable-transition')
    expect(source).toContain('transform: translateY(-50%) scale(0.88)')
    expect(source).toContain('transform: translateY(-50%) scale(1)')
    expect(source).toContain('var(--sax-motion-duration-quick)')
    expect(source).toContain('var(--sax-motion-duration-micro)')
    expect(source).toContain('.clearable-transition-enter-active')
    expect(source).toContain('transition: none !important')
  })
})
