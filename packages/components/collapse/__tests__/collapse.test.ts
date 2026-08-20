import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CollapseItem from '../src/collapse-item.vue'
import Collapse from '../src/collapse.vue'
import { collapseItemProps } from '../src/collapse-item'

describe('Collapse', () => {
  it('uses the shadow surface by default', () => {
    const wrapper = mount(Collapse)

    expect(wrapper.classes()).toContain('s-collapse--shadow')
  })

  it('renders a scoped arrow slot and supports keyboard toggling', async () => {
    const wrapper = mount(Collapse, {
      slots: {
        default: () =>
          h(
            CollapseItem,
            {},
            {
              default: () => 'Panel content',
              header: () => 'Panel title',
              'icon-arrow': ({ open }: { open: boolean }) =>
                h('span', { class: 'custom-arrow' }, String(open)),
            },
          ),
      },
    })

    const header = wrapper.get('[role="button"]')
    expect(header.attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('.custom-arrow').text()).toBe('false')
    expect(wrapper.get('.s-collapse-item__icon').classes()).not.toContain(
      'is-default-arrow',
    )

    await header.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(header.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('.custom-arrow').text()).toBe('true')
  })

  it('uses the arrow slot instead of an icon name prop', () => {
    expect('iconArrow' in collapseItemProps).toBe(false)
  })
})
