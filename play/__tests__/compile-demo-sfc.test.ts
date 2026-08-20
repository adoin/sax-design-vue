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
})
