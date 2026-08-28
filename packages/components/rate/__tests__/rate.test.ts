import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Rate from '../src/rate.vue'

describe('Rate', () => {
  it('renders built-in star assets without runtime icon configuration', () => {
    const wrapper = mount(Rate, { props: { modelValue: 3 } })

    expect(wrapper.findAll('.s-rate__item')).toHaveLength(5)
    expect(wrapper.findAll('.s-rate__item svg')).toHaveLength(5)
    expect(wrapper.findAll('.s-rate__icon.is-active')).toHaveLength(3)
  })
})
