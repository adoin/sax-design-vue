import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import { compileDemoSfc } from '../compile-demo-sfc'

afterEach(() => {
  document.querySelector('#playground-embed-styles')?.remove()
})

describe('compileDemoSfc', () => {
  it('applies the compiled scope id to rendered nodes', () => {
    const { component, error } = compileDemoSfc(
      `<template><div class="preview-card">Styled preview</div></template>
<style scoped>.preview-card { color: red; }</style>`,
      'scoped-example',
    )

    expect(error).toBeNull()
    expect(component).not.toBeNull()

    const wrapper = mount(component!)

    expect(wrapper.get('.preview-card').attributes()).toHaveProperty(
      'data-v-pe-scoped-example',
    )
    expect(
      document.querySelector('#playground-embed-styles')?.textContent,
    ).toContain('.preview-card[data-v-pe-scoped-example]')
  })

  it('does not scope examples with global styles', () => {
    const { component, error } = compileDemoSfc(
      `<template><div class="preview-card">Global preview</div></template>
<style>.preview-card { color: red; }</style>`,
      'global-example',
    )

    expect(error).toBeNull()
    expect(component).not.toBeNull()

    const wrapper = mount(component!)

    expect(wrapper.get('.preview-card').attributes()).not.toHaveProperty(
      'data-v-pe-global-example',
    )
  })

  it('preserves reactive object values in TypeScript examples', () => {
    const { component, error } = compileDemoSfc(
      `<script setup lang="ts">
import { reactive } from 'vue'
const values = reactive({ classic: 42, soft: 58 })
</script>
<template><div>{{ values.classic }} / {{ values.soft }}</div></template>`,
      'typescript-reactive-example',
    )

    expect(error).toBeNull()
    expect(component).not.toBeNull()
    expect(mount(component!).text()).toBe('42 / 58')
  })

  it('compiles TypeScript assertions used in template expressions', () => {
    const { component, error } = compileDemoSfc(
      `<script setup lang="ts">
const values = { classic: 'ready' }
const variant = 'classic'
</script>
<template><div>{{ values[variant as keyof typeof values] }}</div></template>`,
      'typescript-template-example',
    )

    expect(error).toBeNull()
    expect(component).not.toBeNull()
    expect(mount(component!).text()).toBe('ready')
  })
})
