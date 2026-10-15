import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import Checkbox from '../../checkbox/src/checkbox.vue'
import Radio from '../../radio/src/radio.vue'
import Switch from '../../switch/src/switch.vue'
import Textarea from '../../textarea/src/textarea.vue'
import Slider from '../../slider/src/slider.vue'
import VerificationCode from '../../verification-code/src/verification-code.vue'
import Image from '../../images/src/image.vue'
import Images from '../../images/src/images.vue'
import Select from '../../select/src/select.vue'
import Cascader from '../../cascader/src/cascader.vue'
import Upload from '../../upload/src/upload.vue'
import Tabs from '../../tabs/src/tabs.vue'
import Tab from '../../tabs/src/tab.vue'

const nativeCases: [
  string,
  Component,
  string,
  string,
  Record<string, unknown>,
][] = [
  ['Checkbox', Checkbox, '.s-checkbox', 'input', {}],
  ['Radio', Radio, '.s-radio-wrapper', 'input', { value: 'one' }],
  ['Switch', Switch, '.s-switch', 'input', {}],
  ['Textarea', Textarea, '.s-textarea', 'textarea', {}],
  ['Slider', Slider, '.s-slider', 'input', { modelValue: 20 }],
  ['VerificationCode', VerificationCode, '.s-verification-code', 'input', {}],
  ['Image', Image, '.s-images__item', 'img', { src: 'photo.svg' }],
]

describe('public component layout attribute ownership', () => {
  it.each(nativeCases)(
    '%s separates changing layout and native attributes',
    async (_name, component, rootSelector, nativeSelector, props) => {
      const attrs = ref({
        class: 'consumer-layout',
        style: { marginTop: '8px', width: '240px' },
        'data-probe': 'first',
        'aria-label': 'Consumer control',
      })
      const wrapper = mount(() => h(component, { ...props, ...attrs.value }))
      const root = wrapper.get(rootSelector)
      const native = root.get(nativeSelector)
      expect(root.classes()).toContain('consumer-layout')
      expect((root.element as HTMLElement).style.marginTop).toBe('8px')
      expect(native.classes()).not.toContain('consumer-layout')
      expect((native.element as HTMLElement).style.marginTop).toBe('')
      expect(native.attributes('data-probe')).toBe('first')
      expect(native.attributes('aria-label')).toBe('Consumer control')
      attrs.value = {
        ...attrs.value,
        class: 'next-layout',
        style: { marginTop: '12px', width: '280px' },
        'data-probe': 'next',
      }
      await wrapper.vm.$nextTick()
      expect(root.classes()).toContain('next-layout')
      expect(root.classes()).not.toContain('consumer-layout')
      expect((root.element as HTMLElement).style.marginTop).toBe('12px')
      expect(native.attributes('data-probe')).toBe('next')
      wrapper.unmount()
    },
  )

  it.each<[string, Component, string]>([
    ['Images', Images, '.s-images'],
    ['Upload', Upload, '.s-upload'],
    ['Select', Select, '.s-select'],
    ['Cascader', Cascader, '.s-cascader'],
  ])(
    '%s retains changing outer layout attributes',
    async (_name, component, selector) => {
      const attrs = ref({ class: 'outer-layout', style: { marginTop: '8px' } })
      const wrapper = mount(() => h(component, attrs.value))
      expect(wrapper.get(selector).classes()).toContain('outer-layout')
      expect(
        (wrapper.get(selector).element as HTMLElement).style.marginTop,
      ).toBe('8px')
      attrs.value = { class: 'next-layout', style: { marginTop: '16px' } }
      await wrapper.vm.$nextTick()
      expect(wrapper.get(selector).classes()).toContain('next-layout')
      expect(
        (wrapper.get(selector).element as HTMLElement).style.marginTop,
      ).toBe('16px')
      wrapper.unmount()
    },
  )

  it('applies pane layout attributes without replacing its accessible identity', async () => {
    const wrapper = mount(() =>
      h(
        Tabs,
        { modelValue: 'first' },
        {
          default: () =>
            h(
              Tab,
              {
                name: 'first',
                label: 'First',
                class: 'pane-layout',
                style: { marginTop: '8px' },
                'data-probe': 'pane',
              },
              () => 'Content',
            ),
        },
      ),
    )
    await wrapper.vm.$nextTick()
    const pane = wrapper.get('[role="tabpanel"]')
    expect(pane.classes()).toContain('pane-layout')
    expect((pane.element as HTMLElement).style.marginTop).toBe('8px')
    expect(pane.attributes('data-probe')).toBe('pane')
    expect(pane.attributes('aria-labelledby')).toBeTruthy()
    wrapper.unmount()
  })
})
