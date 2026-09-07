import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Anchor from '../src/anchor.vue'
import type { AnchorItem } from '../src/anchor'

const items: AnchorItem[] = [
  {
    href: '#section',
    title: 'Section',
    collapsible: true,
    defaultCollapsed: true,
    children: [
      {
        href: '#example',
        title: 'Example',
        collapsible: true,
        defaultCollapsed: true,
        children: [{ href: '#detail', title: 'Detail' }],
      },
    ],
  },
]

describe('Anchor hierarchy', () => {
  it('renders recursive levels and toggles collapsible items independently', async () => {
    const wrapper = mount(Anchor, { props: { items } })

    expect(
      wrapper.findAll('.s-anchor__item').map((item) => item.text()),
    ).toEqual(['Section'])
    await wrapper.get('.s-anchor__collapse').trigger('click')
    expect(
      wrapper.findAll('.s-anchor__item').map((item) => item.text()),
    ).toEqual(['Section', 'Example'])
    expect(wrapper.emitted('collapseChange')?.[0]).toEqual([items[0], false])
  })

  it('opens collapsed ancestors when a nested anchor becomes active', async () => {
    const wrapper = mount(Anchor, {
      props: { items, modelValue: '#detail' },
    })
    await wrapper.vm.$nextTick()

    expect(
      wrapper.findAll('.s-anchor__item').map((item) => item.text()),
    ).toEqual(['Section', 'Example', 'Detail'])
    expect(wrapper.findAll('.s-anchor__group.is-nested')).toHaveLength(2)
  })
})
