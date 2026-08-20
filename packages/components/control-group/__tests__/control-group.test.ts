import { Fragment, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ControlGroup from '../src/control-group.vue'

describe('ControlGroup', () => {
  it('renders ordered controls as one semantic group', () => {
    const wrapper = mount(ControlGroup, {
      attrs: { 'aria-label': 'Website address' },
      slots: {
        default:
          '<button class="protocol">HTTPS</button><input class="address" />',
      },
    })

    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Website address')
    expect(wrapper.find('.protocol').exists()).toBe(true)
    expect(wrapper.find('.address').exists()).toBe(true)
  })

  it('supports a full-width group', () => {
    const wrapper = mount(ControlGroup, { props: { block: true } })

    expect(wrapper.classes()).toContain('is-block')
  })

  it('uses a 24-column span and shares the remainder between unset items', () => {
    const wrapper = mount(ControlGroup, {
      slots: {
        default: () => [
          h('button', { span: 8 }, 'Protocol'),
          h('input', { class: 'address' }),
        ],
      },
    })

    const items = wrapper.findAll('.s-control-group__item')

    expect(items).toHaveLength(2)
    expect(items[0].attributes('style')).toContain(
      'flex: 0 0 33.33333333333333%',
    )
    expect(items[1].attributes('style')).toBeUndefined()
    expect(wrapper.find('button').attributes('span')).toBeUndefined()
  })

  it('flattens fragment children and keeps all unset items flexible', () => {
    const wrapper = mount(ControlGroup, {
      slots: {
        default: () =>
          h(
            Fragment,
            null,
            ['one', 'two', 'three'].map((item) =>
              h('input', { key: item, 'aria-label': item }),
            ),
          ),
      },
    })

    const items = wrapper.findAll('.s-control-group__item')

    expect(items).toHaveLength(3)
    expect(items.every((item) => item.attributes('style') === undefined)).toBe(
      true,
    )
  })

  it('lays out date and time pickers with the remaining control width', () => {
    const wrapper = mount(ControlGroup, {
      slots: {
        default: () => [
          h('div', { class: 's-date-picker', span: 8 }, 'Date'),
          h('div', { class: 's-time-picker', span: 6 }, 'Time'),
          h('input', { class: 'details' }),
        ],
      },
    })

    const items = wrapper.findAll('.s-control-group__item')

    expect(items).toHaveLength(3)
    expect(items[0].attributes('style')).toContain(
      'flex: 0 0 33.33333333333333%',
    )
    expect(items[1].attributes('style')).toContain('flex: 0 0 25%')
    expect(items[2].attributes('style')).toBeUndefined()
    expect(wrapper.find('.s-date-picker').attributes('span')).toBeUndefined()
    expect(wrapper.find('.s-time-picker').attributes('span')).toBeUndefined()
  })
})
