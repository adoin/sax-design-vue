import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { addIconData } from 'sax-design-vue-iconify'
import { useIconPickerIcons } from '../src/use-icon-picker-icons'
import type { PropType } from 'vue'
import type { IconPickerApiOptions } from '../src/icon-picker'

const { load } = vi.hoisted(() => ({ load: vi.fn() }))
vi.mock('sax-design-vue-iconify/api', () => ({ loadIconData: load }))
const data = { body: '<circle r="4"/>', attributes: { viewBox: '0 0 24 24' } }
const Harness = defineComponent({
  props: {
    names: { type: Array as PropType<string[]>, required: true },
    api: {
      type: [Boolean, Object] as PropType<boolean | IconPickerApiOptions>,
      default: true,
    },
  },
  setup(props) {
    return useIconPickerIcons(
      () => props.names,
      () => props.api,
      () => undefined,
    )
  },
  render: () => h('div'),
})
const create = (names: string[], api: boolean | IconPickerApiOptions = true) =>
  mount(Harness, { props: { names, api } })

afterEach(() => load.mockReset())

describe('IconPicker lazy API catalog', () => {
  it('reuses control fallbacks and registered local SVGs without requesting them', async () => {
    addIconData('local-picker-home', data)
    const wrapper = create(['cb:search', 'local-picker-home'])
    await flushPromises()
    expect(wrapper.vm.icons).toEqual(['cb:search', 'local-picker-home'])
    expect(load).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('disables API requests for offline registered-only selection', async () => {
    const wrapper = create(['offlinepicker:missing'], false)
    await flushPromises()
    expect(wrapper.vm.icons).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
    expect(load).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('publishes downloaded icons and passes custom API configuration', async () => {
    load.mockImplementation(async (names: string[]) =>
      names.forEach((name) => addIconData(name, data)),
    )
    const wrapper = create(['runtimepicker:download'], {
      baseUrl: 'https://icons.example/',
    })
    await flushPromises()
    expect(load).toHaveBeenCalledWith(
      ['runtimepicker:download'],
      expect.objectContaining({
        baseUrl: 'https://icons.example/',
        signal: expect.any(AbortSignal),
      }),
    )
    expect(wrapper.vm.icons).toEqual(['runtimepicker:download'])
    expect(wrapper.vm.loading).toBe(false)
    wrapper.unmount()
  })

  it('retains retry capability after failures', async () => {
    load
      .mockRejectedValueOnce(new Error('offline'))
      .mockImplementationOnce(async () =>
        addIconData('runtimepicker:retry', data),
      )
    const wrapper = create(['runtimepicker:retry'])
    await flushPromises()
    expect(wrapper.vm.failed).toBe(true)
    await wrapper.vm.reload()
    expect(wrapper.vm.failed).toBe(false)
    expect(wrapper.vm.icons).toEqual(['runtimepicker:retry'])
    wrapper.unmount()
  })

  it('aborts outdated lists and pending requests on unmount', async () => {
    const signals: AbortSignal[] = []
    load.mockImplementation((_names, options) => {
      signals.push(options.signal)
      return new Promise(() => undefined)
    })
    const wrapper = create(['runtimepicker:first'])
    await flushPromises()
    await wrapper.setProps({ names: ['runtimepicker:second'] })
    await flushPromises()
    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(false)
    wrapper.unmount()
    expect(signals[1].aborted).toBe(true)
  })
})
