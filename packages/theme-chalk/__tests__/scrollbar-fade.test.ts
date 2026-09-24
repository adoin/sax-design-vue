import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(
  join(process.cwd(), 'packages/theme-chalk/src/scrollbar.scss'),
  'utf8',
)

describe('Scrollbar edge fade theme', () => {
  it('clips vertical and horizontal content with composable masks', () => {
    expect(source).toMatch(
      /&\.is-fade-y,[\s\S]*&\.is-fade-x[\s\S]*--s-scrollbar-fade-mask-y: linear-gradient\([\s\S]*--s-scrollbar-fade-mask-x: linear-gradient/,
    )
    expect(source).toMatch(
      /&\.is-fade-y\.is-fade-x \{[\s\S]*-webkit-mask-image:[\s\S]*mask-composite: intersect/,
    )
  })
})
