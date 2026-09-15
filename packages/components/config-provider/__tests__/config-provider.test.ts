import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useGlobalConfig, useShape, useShapeProp } from '@vuesax-alpha/hooks'
import Button from '../../button/src/button.vue'
import Card from '../../card/src/card.vue'
import Tag from '../../tag/src/tag.vue'
import Input from '../../input/src/input.vue'
import Table from '../../table/src/table.vue'
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

  it('provides shared size defaults while preserving local sizes', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large' },
      slots: {
        default: () =>
          h('div', [
            h(Button, { 'data-test': 'large-button' }, () => 'Button'),
            h(
              Button,
              { size: 'small', 'data-test': 'small-button' },
              () => 'Button',
            ),
            h(Input, { modelValue: '', 'data-test': 'large-input' }),
            h(Input, {
              modelValue: '',
              size: 'small',
              'data-test': 'small-input',
            }),
            h(Input, {
              modelValue: '',
              size: '',
              'data-test': 'unscaled-input',
            }),
          ]),
      },
    })

    expect(wrapper.get('[data-test="large-button"]').classes()).toContain(
      's-button__size--large',
    )
    expect(wrapper.get('[data-test="small-button"]').classes()).toContain(
      's-button__size--small',
    )
    expect(wrapper.findAll('.s-input')[0]?.classes()).toContain(
      's-input--large',
    )
    expect(wrapper.findAll('.s-input')[1]?.classes()).toContain(
      's-input--small',
    )
    expect(wrapper.findAll('.s-input')[2]?.classes()).not.toContain(
      's-input--large',
    )
  })

  it('provides component policy defaults without overriding local props', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        button: { loadingType: 'shimmer', debounce: false },
      },
      slots: {
        default: () =>
          h('div', [
            h(
              Button,
              { loading: true, 'data-test': 'inherited' },
              () => 'Button',
            ),
            h(
              Button,
              {
                loading: true,
                loadingType: 'pulse',
                debounce: 120,
                'data-test': 'overridden',
              },
              () => 'Button',
            ),
          ]),
      },
    })

    const buttons = wrapper.findAllComponents(Button)
    expect(buttons[0]!.get('button').classes()).toContain(
      's-button--loading-shimmer',
    )
    expect(buttons[1]!.get('button').classes()).toContain(
      's-button--loading-pulse',
    )
  })

  it('provides mergeable Table defaults while preserving local overrides', () => {
    const data = [{ id: 1, name: 'Alpha' }]
    const columns = [{ field: 'name', title: 'Name' }]
    const wrapper = mount(ConfigProvider, {
      props: {
        table: {
          striped: true,
          editConfig: { mode: 'cell', onScroll: 'commit' },
          selectionConfig: { trigger: 'row', reserve: true },
        },
      },
      slots: {
        default: () =>
          h('div', [
            h(Table, { data, columns, 'data-test': 'inherited' }),
            h(Table, {
              data,
              columns,
              striped: false,
              editConfig: false,
              selectionConfig: { trigger: 'cell' },
              'data-test': 'overridden',
            }),
          ]),
      },
    })

    const cores = wrapper.findAllComponents({ name: 'STableCore' })
    expect(cores).toHaveLength(2)
    expect(cores[0]!.get('.s-table').classes()).toContain('is-striped')
    expect(cores[0]!.props('editConfig')).toEqual({
      mode: 'cell',
      onScroll: 'commit',
    })
    expect(cores[0]!.props('selectionConfig')).toEqual({
      trigger: 'row',
      reserve: true,
    })

    expect(cores[1]!.get('.s-table').classes()).not.toContain('is-striped')
    expect(cores[1]!.props('editConfig')).toBe(false)
    expect(cores[1]!.props('selectionConfig')).toEqual({
      trigger: 'cell',
      reserve: true,
    })
  })

  it('merges nested component-default objects with their parent provider', () => {
    const data = [{ id: 1, name: 'Alpha' }]
    const columns = [{ field: 'name', title: 'Name' }]
    const wrapper = mount(ConfigProvider, {
      props: {
        table: {
          editConfig: { mode: 'cell', onScroll: 'commit' },
          striped: true,
        },
      },
      slots: {
        default: () =>
          h(
            ConfigProvider,
            {
              table: {
                striped: false,
                editConfig: { onScroll: 'cancel' },
              },
            },
            { default: () => h(Table, { data, columns }) },
          ),
      },
    })

    const core = wrapper.getComponent({ name: 'STableCore' })
    expect(core.get('.s-table').classes()).not.toContain('is-striped')
    expect(core.props('editConfig')).toEqual({
      mode: 'cell',
      onScroll: 'cancel',
    })
  })
})
