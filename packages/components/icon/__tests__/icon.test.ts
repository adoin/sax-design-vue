import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Icon from '../src/icon.vue'

describe('Icon rolling', () => {
  it('uses the stylesheet default duration for boolean rolling', () => {
    const wrapper = mount(Icon, {
      props: { rolling: true },
      slots: { default: '<svg />' },
    })

    expect(wrapper.classes()).toContain('is-rolling')
    expect(wrapper.attributes('style')).not.toContain(
      '--sax-icon-rolling-duration',
    )
  })

  it('writes numeric seconds to the rolling duration CSS variable', () => {
    const wrapper = mount(Icon, {
      props: { rolling: 1.8 },
      slots: { default: '<svg />' },
    })

    expect(wrapper.classes()).toContain('is-rolling')
    expect(wrapper.attributes('style')).toContain(
      '--sax-icon-rolling-duration: 1.8s',
    )
  })

  it('does not roll by default', () => {
    const wrapper = mount(Icon, { slots: { default: '<svg />' } })

    expect(wrapper.classes()).not.toContain('is-rolling')
  })
})
