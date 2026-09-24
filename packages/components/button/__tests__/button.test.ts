import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Button from '../src/button.vue'

const IconLoadingStub = defineComponent({
  name: 'IconLoading',
  props: { active: Boolean },
  emits: ['restored'],
  template: '<span class="icon-loading-stub" :data-active="String(active)" />',
})

const finishIconSwap = async (wrapper: ReturnType<typeof mount>) => {
  const loader = wrapper.get('.t-icon[data-icon="loading"]')
  const event = new Event('transitionend', { bubbles: true })
  Object.defineProperty(event, 'propertyName', { value: 'opacity' })
  loader.element.dispatchEvent(event)
  await wrapper.vm.$nextTick()
}

describe('Button loading presets', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

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

  it('uses the brand loader by default', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: 'Save changes' },
      global: { stubs: { IconLoading: true } },
    })

    expect(wrapper.classes()).toContain('s-button--loading-default')
    expect(wrapper.findComponent({ name: 'IconLoading' }).exists()).toBe(true)
    expect(wrapper.find('.s-button__loading-track').exists()).toBe(false)
    expect(wrapper.get('.s-button__content').text()).toBe('Save changes')
  })

  it('renders icon content in dedicated prefix and suffix slots', () => {
    const wrapper = mount(Button, {
      slots: {
        prefix: '<span data-icon="prefix">Prefix icon</span>',
        default: 'Save changes',
        suffix: '<span data-icon="suffix">Suffix icon</span>',
      },
    })

    expect(wrapper.get('.s-button__prefix').text()).toBe('Prefix icon')
    expect(wrapper.get('.s-button__suffix').text()).toBe('Suffix icon')
    expect(wrapper.get('.s-button__content').text()).toBe(
      'Prefix iconSave changesSuffix icon',
    )
  })

  it('uses the prefix slot for the default brand loader when both icon slots exist', async () => {
    const wrapper = mount(Button, {
      slots: {
        prefix: '<span data-icon="prefix">Prefix icon</span>',
        default: 'Save changes',
        suffix: '<span data-icon="suffix">Suffix icon</span>',
      },
      global: { stubs: { IconLoading: true } },
    })
    await wrapper.setProps({ loading: true })

    expect(
      wrapper
        .get('.s-button__prefix')
        .findComponent({ name: 'IconLoading' })
        .exists(),
    ).toBe(true)
    expect(wrapper.get('.s-button__prefix').attributes('data-state')).toBe(
      'loading',
    )
    expect(
      wrapper
        .get('.s-button__prefix [data-icon="content"]')
        .attributes('aria-hidden'),
    ).toBe('true')
    expect(wrapper.get('.s-button__suffix').text()).toBe('Suffix icon')
    expect(wrapper.find('.s-button__loading').exists()).toBe(false)
  })

  it.each(['prefix', 'suffix'] as const)(
    'uses the only %s slot for the default brand loader',
    async (slotName) => {
      const wrapper = mount(Button, {
        slots: {
          default: 'Save changes',
          [slotName]: `<span>${slotName} icon</span>`,
        },
        global: { stubs: { IconLoading: true } },
      })
      await wrapper.setProps({ loading: true })

      expect(
        wrapper
          .get(`.s-button__${slotName}`)
          .findComponent({ name: 'IconLoading' })
          .exists(),
      ).toBe(true)
      expect(
        wrapper.get(`.s-button__${slotName}`).attributes('data-state'),
      ).toBe('loading')
      expect(wrapper.find('.s-button__loading').exists()).toBe(false)
    },
  )

  it('cross-fades before the brand lead-in and waits for restoration before switching back', async () => {
    const wrapper = mount(Button, {
      slots: {
        prefix: '<span>Prefix icon</span>',
        default: 'Save changes',
      },
      global: { stubs: { IconLoading: IconLoadingStub } },
    })

    const prefix = wrapper.get('.s-button__prefix')
    const loader = wrapper.get('.t-icon[data-icon="loading"]')

    expect(prefix.attributes('data-state')).toBe('content')
    expect(loader.attributes('data-active')).toBe('false')

    await wrapper.setProps({ loading: true })
    expect(prefix.attributes('data-state')).toBe('loading')
    expect(loader.attributes('data-active')).toBe('false')

    await finishIconSwap(wrapper)
    expect(loader.attributes('data-active')).toBe('true')

    await wrapper.setProps({ loading: false })
    expect(loader.attributes('data-active')).toBe('false')
    expect(prefix.attributes('data-state')).toBe('loading')

    wrapper.findComponent(IconLoadingStub).vm.$emit('restored')
    await wrapper.vm.$nextTick()
    expect(prefix.attributes('data-state')).toBe('content')
  })

  it('paints the original icon before starting an initial loading swap', async () => {
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback)
        return frames.length
      }),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: {
        prefix: '<span>Prefix icon</span>',
        default: 'Save changes',
      },
      global: { stubs: { IconLoading: IconLoadingStub } },
    })
    const prefix = wrapper.get('.s-button__prefix')
    const loader = wrapper.get('.t-icon[data-icon="loading"]')

    expect(prefix.attributes('data-state')).toBe('content')
    expect(loader.attributes('data-active')).toBe('false')
    expect(frames).toHaveLength(1)

    frames.shift()?.(0)
    await wrapper.vm.$nextTick()
    expect(prefix.attributes('data-state')).toBe('content')
    expect(frames).toHaveLength(1)

    frames.shift()?.(16)
    await wrapper.vm.$nextTick()
    expect(prefix.attributes('data-state')).toBe('loading')
    expect(loader.attributes('data-active')).toBe('false')

    await finishIconSwap(wrapper)
    expect(loader.attributes('data-active')).toBe('true')
  })

  it('skips the fade wait when reduced motion is preferred', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )
    const wrapper = mount(Button, {
      slots: {
        prefix: '<span>Prefix icon</span>',
        default: 'Save changes',
      },
      global: { stubs: { IconLoading: IconLoadingStub } },
    })

    await wrapper.setProps({ loading: true })
    await wrapper.vm.$nextTick()

    expect(
      wrapper.get('.t-icon[data-icon="loading"]').attributes('data-active'),
    ).toBe('true')
  })

  it('keeps icon slots and the loading overlay for non-default presets', () => {
    const wrapper = mount(Button, {
      props: { loading: true, loadingType: 'pulse' },
      slots: {
        prefix: '<span>Prefix icon</span>',
        default: 'Save changes',
      },
    })

    expect(wrapper.get('.s-button__prefix').text()).toBe('Prefix icon')
    expect(wrapper.find('.s-button__loading-track').exists()).toBe(true)
  })

  it('keeps a custom loading slot on the overlay when icon slots exist', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: {
        prefix: '<span>Prefix icon</span>',
        default: 'Save changes',
        loading: '<span data-loading>Saving...</span>',
      },
    })

    expect(wrapper.get('.s-button__prefix').text()).toBe('Prefix icon')
    expect(wrapper.get('.s-button__loading').text()).toBe('Saving...')
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
