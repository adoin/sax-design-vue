import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Button from '../src/button.vue'

describe('Button loading presets', () => {
  it.each(['pulse', 'ripple', 'shimmer'] as const)(
    'uses one loading structure for the %s preset',
    (loadingType) => {
      const wrapper = mount(Button, {
        props: { loading: true, loadingType },
        slots: { default: 'Save changes' },
      })

      expect(wrapper.classes()).toContain(`s-button--loading-${loadingType}`)
      expect(wrapper.findAll('.s-button__loading')).toHaveLength(1)
      expect(wrapper.findAll('.s-button__loading-track')).toHaveLength(1)
      expect(wrapper.get('.s-button__content').text()).toBe('Save changes')
    },
  )

  it('uses the pulse preset by default', () => {
    const wrapper = mount(Button, { props: { loading: true } })

    expect(wrapper.classes()).toContain('s-button--loading-pulse')
  })
})

describe('Button click rate limiting', () => {
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('debounces clicks by 50ms by default', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Button)

    await wrapper.trigger('click')
    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    vi.advanceTimersByTime(49)
    expect(wrapper.emitted('click')).toBeUndefined()
    vi.advanceTimersByTime(1)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('throttles immediately when debounce is disabled', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Button, {
      props: { debounce: false, throttle: 100 },
    })

    await wrapper.trigger('click')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)

    vi.advanceTimersByTime(100)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('logs a conflict and applies only debounce when both are numbers', async () => {
    vi.useFakeTimers()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(Button, {
      props: { debounce: 100, throttle: 500 },
    })

    expect(consoleError).toHaveBeenCalledWith(
      '[SButton] debounce and throttle cannot both be numbers. Only debounce will be applied.',
    )

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    vi.advanceTimersByTime(100)
    expect(wrapper.emitted('click')).toHaveLength(1)
    vi.advanceTimersByTime(500)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('cancels pending clicks when unmounted', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Button, { props: { debounce: 100 } })

    await wrapper.trigger('click')
    wrapper.unmount()
    vi.advanceTimersByTime(100)

    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
