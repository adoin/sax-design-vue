import { describe, expect, it } from 'vitest'
import {
  declarationOutputPath,
  declarationSpecifier,
  normalizeDeclaration,
} from '../src/utils/declarations'

describe('published declaration references', () => {
  it.each([
    ['@vuesax-alpha/utils/index.ts', 'sax-design-vue/es/utils/index'],
    ['@vuesax-alpha/sax-design-vue/index.ts', 'sax-design-vue/es/index'],
    [
      '@vuesax-alpha/sax-design-vue/component.ts',
      'sax-design-vue/es/component',
    ],
    ['@vuesax-alpha/components/button', 'sax-design-vue/es/components/button'],
    [
      '@vuesax-alpha/theme-chalk/vs-button.css',
      'sax-design-vue/theme-chalk/vs-button.css',
    ],
    ['./props.ts', './props'],
    ['./button.vue', './button.vue'],
    ['vue', 'vue'],
    ['some-package/browser.js', 'some-package/browser.js'],
  ])('rewrites %s into %s', (input, expected) =>
    expect(declarationSpecifier(input)).toBe(expected),
  )

  it('normalizes imports and import types without changing public literal values or comments', () => {
    const output = normalizeDeclaration(`
import type { Props } from '@vuesax-alpha/components/button/src/button.ts'
export * from '@vuesax-alpha/utils/index.ts'
type Instance = import('@vuesax-alpha/sax-design-vue/index.ts').ButtonInstance
type Literal = '@vuesax-alpha/utils/index.ts'
// @vuesax-alpha/utils/index.ts remains prose
`)
    expect(output).toContain(
      'from "sax-design-vue/es/components/button/src/button"',
    )
    expect(output).toContain('from "sax-design-vue/es/utils/index"')
    expect(output).toContain('import("sax-design-vue/es/index")')
    expect(output).toContain("type Literal = '@vuesax-alpha/utils/index.ts'")
    expect(output).toContain('// @vuesax-alpha/utils/index.ts remains prose')
  })

  it('relocates package entries without flattening component modules', () => {
    expect(
      declarationOutputPath('sax-design-vue/index.d.ts').replaceAll('\\', '/'),
    ).toBe('index.d.ts')
    expect(
      declarationOutputPath('components/button/index.d.ts').replaceAll(
        '\\',
        '/',
      ),
    ).toBe('components/button/index.d.ts')
  })
})
