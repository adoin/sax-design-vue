import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = (name: string) =>
  readFileSync(
    join(process.cwd(), 'packages/theme-chalk/src', `${name}.scss`),
    'utf8',
  )

describe('stationary compact control states', () => {
  it.each([
    'alert',
    'backtop',
    'button',
    'checkbox',
    'checkbox-group',
    'icon-picker',
    'input',
    'navbar-item',
    'radio',
    'rate',
    'select',
    'switch',
    'tabs',
    'verification-code',
  ])('does not lift %s on hover, active, or focus', (name) => {
    expect(source(name)).not.toMatch(
      /transform:\s*translateY\(-\d+(?:\.\d+)?px\)/,
    )
    expect(source(name)).not.toMatch(
      /transform:\s*translate\(0,\s*-\d+(?:\.\d+)?px\)/,
    )
  })

  it('keeps Select input, placeholder, and arrow centered on hover and open', () => {
    const select = source('select')
    expect(select).not.toContain('calc(-50% - 4px)')
    expect(select).not.toContain('translate(0, -4px)')
  })
})
