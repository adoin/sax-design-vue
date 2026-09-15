import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Notification from '../src/notification.vue'

describe('Notification loading', () => {
  it('uses the shared brand loader while hiding notification content', () => {
    const wrapper = mount(Notification, {
      props: {
        visible: true,
        loading: true,
        title: 'Saved',
        content: 'The record was saved.',
      },
      global: { stubs: { SLogoLoading: true } },
    })

    expect(wrapper.findComponent({ name: 'SLogoLoading' }).exists()).toBe(true)
    expect(wrapper.find('.s-notification__content').exists()).toBe(false)
    wrapper.unmount()
  })
})
