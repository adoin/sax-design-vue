import { h, shallowRef } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Skeleton from '../src/skeleton.vue'
import type { SkeletonRow } from '../src/skeleton'

describe('Skeleton', () => {
  it('defaults to four text placeholders and an accessible loading status', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('[role="status"]').text()).toBe('Loading')
    expect(wrapper.findAll('.s-skeleton__element--line')).toHaveLength(4)
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })
  it('renders nested row declarations and reacts to configuration changes', async () => {
    const rows = shallowRef<SkeletonRow[]>([
      [
        { type: 'circle', size: 56 },
        {
          type: 'group',
          gap: 8,
          rows: [['line'], [{ type: 'line', width: '60%' }]],
        },
      ],
    ])
    const wrapper = mount({
      setup: () => () => h(Skeleton, { rows: rows.value, repeat: 2, gap: 20 }),
    })
    expect(wrapper.findAll('.s-skeleton__element--circle')).toHaveLength(2)
    expect(wrapper.findAll('.s-skeleton__element--line')).toHaveLength(4)
    expect(
      wrapper.find('.s-skeleton__element--circle').attributes('style'),
    ).toContain('width: 56px')
    expect(
      wrapper.find('.s-skeleton__element--line').attributes('style'),
    ).toContain('flex: 1 1 0%')
    rows.value = [
      {
        items: ['square', { type: 'rectangle', width: '40%', height: 80 }],
        gap: 4,
        align: 'start',
      },
    ]
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.s-skeleton__element--circle')).toHaveLength(0)
    expect(wrapper.findAll('.s-skeleton__element--square')).toHaveLength(2)
    expect(
      wrapper.find('.s-skeleton__element--rectangle').attributes('style'),
    ).toContain('height: 80px')
    expect(wrapper.find('.s-skeleton__row').attributes('style')).toContain(
      'align-items: flex-start',
    )
  })
  it('shows custom placeholders and reveals actual content only after loading', async () => {
    const wrapper = mount(Skeleton, {
      props: { label: 'Loading report' },
      global: { stubs: { transition: true } },
      slots: {
        placeholder: '<div>Custom placeholder</div>',
        default: '<button>Open report</button>',
      },
    })
    expect(wrapper.find('[role="status"]').text()).toBe('Loading report')
    expect(wrapper.text()).toContain('Custom placeholder')
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('.s-skeleton__element').exists()).toBe(false)
    await wrapper.setProps({ loading: false })
    expect(wrapper.attributes('aria-busy')).toBe('false')
    expect(wrapper.find('button').text()).toBe('Open report')
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('button').exists()).toBe(false)
  })
  it('supports server rendering with recursive layouts', async () => {
    const html = await renderToString(
      h(Skeleton, { rows: [['circle', { type: 'group', rows: [['line']] }]] }),
    )
    expect(html).toContain('s-skeleton__element--circle')
    expect(html).toContain('s-skeleton__element--line')
    expect(html).toContain('aria-busy="true"')
  })
})
