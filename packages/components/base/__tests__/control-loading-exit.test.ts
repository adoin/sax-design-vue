import { defineComponent, h, nextTick } from 'vue'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { provideLoadingCompletion } from '@vuesax-alpha/hooks/use-loading-completion'
import { afterEach, expect, it, vi } from 'vitest'
import Input from '../../input/src/input.vue'
import Select from '../../select/src/select.vue'
import Textarea from '../../textarea/src/textarea.vue'
import Cascader from '../../cascader/src/cascader.vue'
import TableSelect from '../../table-select/src/table-select.vue'
import DatePicker from '../../date-picker/src/date-picker.vue'
import TimePicker from '../../time-picker/src/time-picker.vue'
import DatePickerAction from '../../date-picker/src/date-picker-action.vue'
import ControlLoading from '../../icon/src/control-loading.vue'
import LogoLoading from '../../icon/src/logo-loading.vue'
import type { Component } from 'vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const PopperStub = defineComponent({
  name: 'SPopper',
  props: { visible: Boolean, disabled: Boolean },
  emits: ['update:visible'],
  template:
    '<div><slot /><div v-if="visible"><slot name="content" /></div></div>',
})

it.each([
  ['Input', Input],
  ['Select', Select],
  ['Textarea', Textarea],
  ['Cascader', Cascader],
  ['TableSelect', TableSelect],
] as [string, Component][])(
  '%s holds loading feedback and interaction until the compact exit finishes',
  async (_name, component) => {
    const wrapper = mount(component, {
      props: { loading: true, shape: 'square' },
      global: { stubs: { SPopper: PopperStub, SLogoLoading: true } },
    })
    const loader = wrapper.getComponent(ControlLoading)
    expect(loader.getComponent(LogoLoading).props()).toMatchObject({
      active: true,
      stopBehavior: 'corners',
      shape: 'square',
    })
    await wrapper.setProps({ loading: false })
    expect(loader.props('active')).toBe(false)
    expect(wrapper.findComponent(ControlLoading).exists()).toBe(true)
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
    if (wrapper.findComponent(PopperStub).exists()) {
      expect(wrapper.getComponent(PopperStub).props('disabled')).toBe(true)
    }
    await wrapper.setProps({ loading: true })
    loader.vm.$emit('restored')
    await nextTick()
    expect(wrapper.findComponent(ControlLoading).exists()).toBe(true)
    await wrapper.setProps({ loading: false })
    loader.vm.$emit('restored')
    await nextTick()
    expect(wrapper.findComponent(ControlLoading).exists()).toBe(false)
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(false)
  },
)

it.each(['date', 'time'] as const)(
  '%s picker waits for its complete real loader timeline before restoring the suffix',
  async (kind) => {
    let id = 0
    let callbacks = new Map<number, FrameRequestCallback>()
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callbacks.set(++id, callback)
      return id
    })
    vi.stubGlobal('cancelAnimationFrame', (key: number) =>
      callbacks.delete(key),
    )
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const Owner = defineComponent({
      props: { loading: Boolean },
      setup(props, { expose }) {
        expose({ wait: provideLoadingCompletion() })
        return () =>
          h(kind === 'date' ? (DatePicker as Component) : TimePicker, {
            loading: props.loading,
            ...(kind === 'date' ? { type: 'daterange' } : {}),
          })
      },
    })
    const wrapper = mount(Owner, {
      props: { loading: true },
      global: { stubs: { SPopper: PopperStub } },
    })
    await wrapper.setProps({ loading: false })
    let outerRestored = false
    const outerCompletion = (
      wrapper.vm as unknown as { wait: () => Promise<void> }
    )
      .wait()
      .then(() => {
        outerRestored = true
      })
    expect(wrapper.getComponent(PopperStub).props('disabled')).toBe(true)
    expect(wrapper.findAllComponents(LogoLoading)).toHaveLength(
      kind === 'date' ? 2 : 1,
    )
    const suffixVisible = () =>
      kind === 'date'
        ? wrapper.findComponent(DatePickerAction).exists()
        : wrapper.getComponent(Input).props('suffixIcon') === 'cb:time'
    expect(suffixVisible()).toBe(false)
    let sawStopping = false
    let blankPaints = 0
    for (let time = 16; time <= 1600; time += 16) {
      const frames = callbacks
      callbacks = new Map()
      frames.forEach((callback) => callback(time))
      await nextTick()
      await nextTick()
      const logos = wrapper.findAllComponents(LogoLoading)
      const phase = logos[0]?.attributes('data-phase')
      if (phase === 'stopping') {
        sawStopping = true
        expect(suffixVisible()).toBe(false)
        expect(outerRestored).toBe(false)
        expect(wrapper.getComponent(PopperStub).props('disabled')).toBe(true)
      }
      if (phase === 'idle') {
        blankPaints++
        expect(suffixVisible()).toBe(false)
      }
    }
    await flushPromises()
    await outerCompletion
    expect(outerRestored).toBe(true)
    expect(sawStopping).toBe(true)
    expect(blankPaints).toBeGreaterThanOrEqual(2)
    expect(wrapper.findComponent(ControlLoading).exists()).toBe(false)
    expect(suffixVisible()).toBe(true)
    expect(wrapper.getComponent(PopperStub).props('disabled')).toBe(false)
  },
)
