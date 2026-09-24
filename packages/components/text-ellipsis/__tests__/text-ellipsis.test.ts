import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TextEllipsis from '../src/text-ellipsis.vue'

describe('TextEllipsis', () => {
  it('keeps the expand action with the truncated text and emits controlled updates', async () => {
    const wrapper = mount(TextEllipsis, {
      props: {
        content: 'A long text that can be expanded.',
        lineClamp: 2,
        expandable: true,
        expanded: false,
      },
      global: {
        stubs: { SIcon: { template: '<i class="icon-stub" />' } },
      },
    })

    const content = wrapper.get('.s-text-ellipsis__content')
    const toggle = wrapper.get<HTMLButtonElement>('.s-text-ellipsis__toggle')
    expect(content.attributes('style')).toContain('-webkit-line-clamp: 2')
    expect(toggle.text()).toContain('Read more')
    expect(toggle.attributes('aria-controls')).toBe(content.attributes('id'))
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.s-text-ellipsis__ellipsis').exists()).toBe(true)

    await toggle.trigger('click')
    expect(wrapper.emitted('update:expanded')).toEqual([[true]])
    expect(wrapper.emitted('change')).toEqual([[true]])

    await wrapper.setProps({ expanded: true })
    expect(wrapper.get('.s-text-ellipsis__toggle').text()).toContain(
      'Read less',
    )
    expect(
      wrapper.get('.s-text-ellipsis__toggle').attributes('aria-expanded'),
    ).toBe('true')
    expect(wrapper.find('.s-text-ellipsis__ellipsis').exists()).toBe(false)
  })

  it('retains custom expand and collapse labels', async () => {
    const wrapper = mount(TextEllipsis, {
      props: {
        content: 'Details',
        expandable: true,
        expandText: 'Show text',
        collapseText: 'Hide text',
      },
      global: {
        stubs: { SIcon: { template: '<i class="icon-stub" />' } },
      },
    })

    expect(wrapper.get('.s-text-ellipsis__toggle').text()).toContain(
      'Show text',
    )
    await wrapper.setProps({ expanded: true })
    expect(wrapper.get('.s-text-ellipsis__toggle').text()).toContain(
      'Hide text',
    )
  })
})
