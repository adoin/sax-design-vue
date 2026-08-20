import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Row from '../src/row.vue'

describe('Row horizontal alignment', () => {
  it('uses start alignment by default', () => {
    const wrapper = mount(Row)

    expect(wrapper.classes()).not.toContain('is-justify-center')
    expect(wrapper.classes()).not.toContain('is-justify-end')
  })

  it('adds the end alignment class', () => {
    const wrapper = mount(Row, {
      props: { justify: 'end' },
    })

    expect(wrapper.classes()).toContain('is-justify-end')
  })
})
