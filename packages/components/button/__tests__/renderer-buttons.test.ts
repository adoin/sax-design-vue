import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RendererButtons from '../src/renderer-buttons.vue'

const actions = [
  { code: 'view', text: 'View' },
  { code: 'assign', text: 'Assign' },
  { code: 'close', text: 'Close' },
]

describe('RendererButtons', () => {
  it('keeps every visible action inline when maxVisible is omitted', () => {
    const wrapper = mount(RendererButtons, {
      props: { options: { actions }, context: {} },
    })

    expect(wrapper.findAllComponents({ name: 'SButton' })).toHaveLength(3)
    expect(wrapper.findComponent({ name: 'SPopper' }).exists()).toBe(false)
  })

  it('uses a vertical overflow icon when actions are explicitly collapsed', () => {
    const wrapper = mount(RendererButtons, {
      props: {
        options: { actions, maxVisible: 1 },
        context: {},
      },
    })

    expect(wrapper.findComponent({ name: 'SPopper' }).exists()).toBe(true)
    expect(
      wrapper
        .findAllComponents({ name: 'SIcon' })
        .some((icon) => icon.props('name') === 'cb:overflow-menu-vertical'),
    ).toBe(true)
  })
})
