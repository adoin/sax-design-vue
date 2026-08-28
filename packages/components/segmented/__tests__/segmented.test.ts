import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Segmented from '../src/segmented.vue'

const options = [
  { label: 'Day view', value: 'day' },
  { label: 'Week view', value: 'week' },
  { label: 'Month view', value: 'month' },
]

describe('Segmented', () => {
  it.each(['pill', 'text', 'tile'] as const)(
    'renders the %s borderless variant',
    (variant) => {
      const wrapper = mount(Segmented, {
        props: { modelValue: 'week', options, variant },
      })

      expect(wrapper.classes()).toContain(`is-${variant}`)
      expect(wrapper.get('[aria-checked="true"]').text()).toContain('Week view')
    },
  )

  it('selects options and exposes radio semantics', async () => {
    const wrapper = mount(Segmented, {
      props: { modelValue: 'day', options },
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.emitted('update:modelValue')).toEqual([['week']])
    expect(wrapper.emitted('change')).toEqual([['week']])
  })
})
