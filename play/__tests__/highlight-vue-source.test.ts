import { describe, expect, it } from 'vitest'
import { highlightVueSource } from '../../docs/.vuepress/theme/util/highlightVueSource'

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
  })
})
