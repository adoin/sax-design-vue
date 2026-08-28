import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Slider from '../src/slider.vue'

describe('Slider', () => {
  it.each(['classic', 'soft', 'steps'] as const)(
    'renders the %s structural variant with one native range input',
    (variant) => {
      const wrapper = mount(Slider, {
        props: { modelValue: 40, variant, step: 10 },
      })

      expect(wrapper.classes()).toContain(`is-${variant}`)
      expect(wrapper.findAll('input[type="range"]')).toHaveLength(1)
    },
  )

  it('snaps relative to a non-zero minimum', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 11, min: 5, max: 25, step: 4 },
    })
    const input = wrapper.get('input')

    ;(input.element as HTMLInputElement).value = '16'
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([17])
  })

  it('renders discrete points for the steps variant', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 40, min: 0, max: 100, step: 10, variant: 'steps' },
    })

    expect(wrapper.findAll('.s-slider__tick')).toHaveLength(11)
  })
})
