import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const readThemeSource = (name: string) =>
  readFileSync(
    join(process.cwd(), 'packages/theme-chalk/src', `${name}.scss`),
    'utf8',
  )

describe('control shadow paint insets', () => {
  it('keeps the Checkbox stationary without scaling or clipping the control', () => {
    const checkbox = readThemeSource('checkbox')
    const table = readThemeSource('table')

    expect(checkbox).not.toContain('transform: translateY(-2px);')
    expect(checkbox).not.toContain('translateY(-2px) scale(1.04)')
    const checkboxLayout = table.match(
      /> \.#\{\$namespace\}-checkbox \{([\s\S]*?)\.#\{\$namespace\}-checkbox__label/,
    )?.[1]
    expect(checkboxLayout).toBeDefined()
    expect(checkboxLayout).not.toMatch(/overflow:\s*hidden/)
    expect(table).toMatch(/padding:\s*0 10px;/)
  })

  it('reserves paint space in clipped interactive collections', () => {
    expect(readThemeSource('checkbox-group')).toMatch(
      /@include e\(list\)[\s\S]{0,220}padding:\s*8px;/,
    )
    expect(
      readThemeSource('radio-group').match(/padding:\s*8px;/g),
    ).toHaveLength(2)
    expect(readThemeSource('calendar')).toMatch(
      /\.s-calendar__views[\s\S]{0,220}padding:\s*8px;/,
    )
    expect(readThemeSource('icon-picker')).toMatch(
      /\.s-icon-picker__grid[\s\S]{0,260}padding:\s*12px 12px 16px;/,
    )
  })
})
