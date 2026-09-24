import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('table editor fill styles', () => {
  it('fills the active cell instead of using the renderer nominal height', () => {
    const source = readFileSync(
      join(process.cwd(), 'packages/theme-chalk/src/table.scss'),
      'utf8',
    )

    expect(source).toMatch(
      /@include e\(cell-editor\)[\s\S]*height: 100%;[\s\S]*min-height: 0/,
    )
    expect(source).toMatch(
      /&\.is-editing-cell[\s\S]*> \.#\{\$namespace\}-table__cell-main \{[\s\S]*position: absolute;[\s\S]*inset: 0;[\s\S]*height: 100%/,
    )
    expect(source).toMatch(
      /&\.is-fixed-column\.is-editing-cell \{\s*z-index: 7;\s*isolation: isolate;[\s\S]*&::after \{[\s\S]*inset: 0;[\s\S]*0 3px 8px[\s\S]*inset 0 0 10px -6px[\s\S]*pointer-events: none/,
    )
    expect(source).toMatch(
      /&\.is-fixed-column\.is-editing-cell \{[\s\S]*:where\([\s\S]*\.#\{\$namespace\}-input__wrapper,[\s\S]*\.#\{\$namespace\}-select__input,[\s\S]*\.#\{\$namespace\}-textarea[\s\S]*\) \{\s*box-shadow: none/,
    )
  })
})
