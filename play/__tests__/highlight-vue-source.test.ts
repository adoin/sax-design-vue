import { describe, expect, it } from 'vitest'
import {
  highlightVueSfcHtml,
  highlightVueSource,
} from '../../docs/.vuepress/theme/util/highlightVueSource'

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
        ({ classes, text }) =>
          classes.includes('function') && text === 'ref',
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
})
