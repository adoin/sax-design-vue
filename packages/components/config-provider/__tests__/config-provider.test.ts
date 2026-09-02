import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useGlobalConfig, useShape, useShapeProp } from '@vuesax-alpha/hooks'
import Button from '../../button/src/button.vue'
import Card from '../../card/src/card.vue'
import Tag from '../../tag/src/tag.vue'
import Input from '../../input/src/input.vue'
import ConfigProvider from '../src/config-provider'

describe('ConfigProvider theme', () => {
  it('applies, updates, and restores HSL theme keys', async () => {
    const root = document.documentElement
    root.style.setProperty('--sax-theme-primary-h', '120deg')

    const wrapper = mount(ConfigProvider, {
      props: { theme: { primary: '#4f46e5' } },
      slots: { default: '<div>content</div>' },
    })

    expect(root.style.getPropertyValue('--sax-theme-primary-h')).toBe(
      '243.396deg',
    )

    await wrapper.setProps({ theme: { primary: 'hsl(18 80% 50%)' } })
    expect(root.style.getPropertyValue('--sax-theme-primary-h')).toBe('18deg')

    wrapper.unmount()
    expect(root.style.getPropertyValue('--sax-theme-primary-h')).toBe('120deg')
    root.style.removeProperty('--sax-theme-primary-h')
  })

  it('provides a default timezone to descendant components', () => {
    const Consumer = defineComponent({
      setup() {
        const timezone = useGlobalConfig('timezone')
        const autoApplyNow = useGlobalConfig('autoApplyNow')
        return () => h('span', `${timezone.value}:${autoApplyNow.value}`)
      },
    })
    const wrapper = mount(ConfigProvider, {
      props: { timezone: 'Asia/Shanghai', autoApplyNow: true },
      slots: { default: () => h(Consumer) },
    })

    expect(wrapper.text()).toBe('Asia/Shanghai:true')
  })

  it('provides a default shape while preserving local overrides', () => {
    const Consumer = defineComponent({
      props: { shape: useShapeProp },
      setup() {
        const shape = useShape()
        return () => h('span', { 'data-shape': shape.value }, shape.value)
      },
    })
    const wrapper = mount(ConfigProvider, {
      props: { shape: 'square' },
      slots: {
        default: () =>
          h('div', [
            h(Consumer),
            h(Consumer, { shape: 'rounded' }),
            h(ConfigProvider, null, { default: () => h(Consumer) }),
          ]),
      },
    })

    expect(
      wrapper
        .findAll('[data-shape]')
        .map((item) => item.attributes('data-shape')),
    ).toEqual(['square', 'rounded', 'square'])
  })

  it('applies the global shape to compatible component families', () => {
    const wrapper = mount(ConfigProvider, {
      props: { shape: 'square' },
      slots: {
        default: () =>
          h('div', [
            h(Input, { modelValue: '', 'data-test': 'input' }),
            h(Button, { 'data-test': 'button' }, () => 'Button'),
            h(Card, { 'data-test': 'card' }, () => 'Card'),
            h(Tag, { modelValue: true, 'data-test': 'tag' }, () => 'Tag'),
            h(Input, {
              modelValue: '',
              shape: 'rounded',
              'data-test': 'rounded-input',
            }),
          ]),
      },
    })

    expect(wrapper.findAll('.s-input')[0]?.classes()).toContain('is-square')
    expect(wrapper.get('[data-test="button"]').classes()).toContain(
      's-button--square',
    )
    expect(wrapper.get('[data-test="card"]').classes()).toContain('is-square')
    expect(wrapper.get('[data-test="tag"]').classes()).toContain('is-square')
    expect(wrapper.findAll('.s-input')[1]?.classes()).toContain('is-rounded')
  })
})
