import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Col from '../src/col.vue'

describe('Col alignment', () => {
  it.each(['start', 'end'] as const)(
    'adds the justify-self-%s state class',
    (justifySelf) => {
      const wrapper = mount(Col, {
        props: { justifySelf },
      })

      expect(wrapper.classes()).toContain(`is-justify-self-${justifySelf}`)
    },
  )
})
