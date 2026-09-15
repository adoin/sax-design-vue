import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Loading from '../src/loading.vue'
import type { LoadingType } from '../src/loading'

const mountLoading = (type: LoadingType) =>
  mount(Loading, {
    props: { type },
    global: {
      stubs: {
        IconLoading: { template: '<i class="brand-loading-stub" />' },
      },
    },
  })

describe('Loading visuals', () => {
  it('uses the brand loader only for the default type', () => {
    const wrapper = mountLoading('default')

    expect(wrapper.find('.brand-loading-stub').exists()).toBe(true)
    expect(wrapper.findAll('.s-loading__animation--item')).toHaveLength(0)
    wrapper.unmount()
  })

  it.each([
    'atom',
    'waves',
    'border',
    'circles',
    'corners',
    'gradient',
  ] as LoadingType[])('retains the distinct %s preset', (type) => {
    const wrapper = mountLoading(type)

    expect(wrapper.find('.brand-loading-stub').exists()).toBe(false)
    expect(wrapper.findAll('.s-loading__animation--item')).toHaveLength(3)
    wrapper.unmount()
  })
})
