import { describe, expect, it } from 'vitest'
import {
  highlightTypeScriptHtml,
  highlightVueSfcHtml,
  highlightVueSource,
} from '../../docs/.vuepress/theme/util/highlightVueSource'
import { restoreTypeScriptFenceHighlight } from '../../docs/.vuepress/theme/util/restoreTypeScriptFenceHighlight'

describe('highlightVueSource', () => {
  it('preserves the complete editable SFC source while producing syntax tokens', () => {
    const source = `<template>\n  <s-button :disabled="loading">Save</s-button>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst loading = ref(false)\n</script>`
    const segments = highlightVueSource(source)

    expect(segments.map(({ text }) => text).join('')).toBe(source)
    expect(segments.some(({ classes }) => classes.includes('tag'))).toBe(true)
    expect(segments.some(({ classes }) => classes.includes('attr-name'))).toBe(
      true,
    )
    expect(segments.some(({ classes }) => classes.includes('keyword'))).toBe(
      true,
    )
    expect(segments.some(({ classes }) => classes.includes('string'))).toBe(
      true,
    )
    expect(
      segments.some(
        ({ classes, text }) =>
          classes.includes('variable-declaration') && text === 'loading',
      ),
    ).toBe(true)
    expect(
      segments.some(
        ({ classes, text }) => classes.includes('function') && text === 'ref',
      ),
    ).toBe(true)
  })

  it('uses TypeScript grammar inside Vue script blocks', () => {
    const source = `<script setup lang="ts">\nconst tableOptions = computed<SaxGridSetting<UserRow>>(() => ({}))\n</script>`
    const html = highlightVueSfcHtml(source)

    expect(html).toContain(
      '<span class="token variable-declaration variable">tableOptions</span>',
    )
    expect(html).toContain('<span class="token function">computed</span>')
    expect(html).toContain('class="token generic class-name"')
    expect(html).toContain('SaxGridSetting')
  })

  it('highlights referenced types in TypeScript annotations', () => {
    const source = `import type {
  FormRendererParams,
  RendererOptions,
} from 'sax-design-vue'

const renderStatusControl = <Model extends object>(
  options: RendererOptions<Model>,
  params: Pick<FormRendererParams<Model>, 'value' | 'disabled'>,
): VNodeChild => {}
type RenderStatus = () => VNodeChild`
    const html = highlightTypeScriptHtml(source, 'typescript')

    for (const typeName of [
      'RendererOptions',
      'Model',
      'Pick',
      'FormRendererParams',
      'VNodeChild',
    ]) {
      expect(html).toContain(
        `<span class="token type-reference class-name">${typeName}</span>`,
      )
    }
    expect(html).toContain(
      '<span class="token type-import class-name">FormRendererParams</span>',
    )
    expect(html).not.toMatch(/class="token type-import[^"]*"[^>]*>[^<]*\n/)
  })

  it('disambiguates generic arrow functions from JSX before highlighting TSX types', () => {
    const source = `const renderStatusControl = <Model extends object>(
  options: RendererOptions<Model>,
  params: Pick<FormRendererParams<Model>, 'value' | 'disabled'>,
): VNodeChild => <span>{params.value}</span>`
    const html = highlightTypeScriptHtml(source, 'tsx')

    expect(html).toContain('class="token generic-arrow generic class-name"')
    expect(html).toContain(
      '<span class="token type-reference class-name">RendererOptions</span>',
    )
    expect(html).toContain(
      '<span class="token type-reference class-name">FormRendererParams</span>',
    )
    expect(html).toContain(
      '<span class="token type-reference class-name">VNodeChild</span>',
    )
    expect(html).toContain('<span class="token tag">')
  })

  it('uses the same referenced-type tokens in editable TSX SFC source', () => {
    const source = `<script setup lang="tsx">
const render = <Model extends object>(options: RendererOptions<Model>): VNodeChild => null
</script>`
    const segments = highlightVueSource(source)

    expect(
      segments.some(
        ({ classes, text }) =>
          classes.includes('type-reference') && text === 'RendererOptions',
      ),
    ).toBe(true)
    expect(
      segments.some(
        ({ classes, text }) =>
          classes.includes('type-reference') && text === 'VNodeChild',
      ),
    ).toBe(true)
    expect(segments.map(({ text }) => text).join('')).toBe(source)
  })

  it('keeps JSX component tags and value properties out of type-reference tokens', () => {
    const tsx = highlightTypeScriptHtml(
      'const view = <SButton>Save</SButton>',
      'tsx',
    )
    const ts = highlightTypeScriptHtml(
      'const config = { foo: true, Ready: false }',
      'typescript',
    )

    expect(tsx).toContain('class="token tag"')
    expect(tsx).not.toContain('class="token type-reference class-name">SButton')
    expect(ts).not.toContain('class="token type-reference class-name">Ready')
  })

  it('restores production fence highlighting without changing source text or lines', () => {
    const source = `const render = <Model extends object>(
  options: RendererOptions<Model>,
): VNodeChild => <span>{options.name}</span>`
    const root = document.createElement('div')
    root.innerHTML =
      '<div class="language-tsx"><pre><code class="language-tsx"></code></pre></div>'
    const code = root.querySelector('code')!
    code.textContent = source

    restoreTypeScriptFenceHighlight(root)

    expect(code.textContent).toBe(source)
    expect(code.querySelectorAll('.line')).toHaveLength(3)
    expect(
      [...code.querySelectorAll('.token.type-reference')].map(
        (token) => token.textContent,
      ),
    ).toContain('RendererOptions')
    expect(
      [...code.querySelectorAll('.token.tag')].some(
        (token) => token.textContent === 'span',
      ),
    ).toBe(true)
  })
})
