import { h, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Avatar from '../src/avatar.vue'
import AvatarGroup from '../src/avatar-group.vue'

describe('Avatar stacking', () => {
  it('keeps max member photos and appends an independent overflow avatar', async () => {
    const count = shallowRef(8)
    const max = shallowRef(6)
    const wrapper = mount({
      setup: () => () =>
        h(
          AvatarGroup,
          { max: max.value, size: 48 },
          {
            default: () =>
              Array.from({ length: count.value }, (_, i) =>
                h(Avatar, { key: i, shape: 'circle' }, () =>
                  h('img', { alt: `Member ${i}` }),
                ),
              ),
          },
        ),
    })
    expect(wrapper.findAll('img')).toHaveLength(6)
    expect(wrapper.find('.s-avatar__group--overflow').text()).toBe('+2')
    expect(wrapper.find('.s-avatar__group--overflow').classes()).toContain(
      's-avatar-content__circle',
    )
    max.value = 8
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('img')).toHaveLength(8)
    expect(wrapper.find('.s-avatar__group--overflow').exists()).toBe(false)
    count.value = 10
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.s-avatar__group--overflow').text()).toBe('+2')
  })
  it('allows custom overflow and preserves individual sizes', () => {
    const wrapper = mount(AvatarGroup, {
      props: { max: 1, size: 48 },
      slots: {
        default: () => [h(Avatar, { size: 32 }), h(Avatar)],
        overflow: ({ count }: { count: number }) => `${count} more`,
      },
    })
    expect(wrapper.findAllComponents(Avatar)[0].props('size')).toBe(32)
    expect(wrapper.find('.s-avatar__group--overflow').text()).toBe('1 more')
  })
})
