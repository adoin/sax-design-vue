import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import Tags from '../src/date-picker-tags.vue'
import Action from '../src/date-picker-action.vue'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it('uses a single suffix action and restores the calendar after clearing', async () => {
  const wrapper = mount(Action, { props: { clear: false } })
  expect(wrapper.find('button').exists()).toBe(false)
  await wrapper.setProps({ clear: true })
  expect(wrapper.findAll('button')).toHaveLength(1)
  await wrapper.get('button').trigger('click')
  expect(wrapper.emitted('clear')).toHaveLength(1)
  await wrapper.setProps({ clear: false })
  expect(wrapper.find('button').exists()).toBe(false)
  wrapper.unmount()
})

it('recalculates visible tags on resize and disconnects its observer', async () => {
  let width = 250
  let resize = () => {}
  const disconnect = vi.fn()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback
      }
      observe() {}
      disconnect = disconnect
    },
  )
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(
    () => width,
  )
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      return {
        width: Object.hasOwn(this.dataset, 'dateOverflow') ? 28 : 100,
      } as DOMRect
    },
  )
  const wrapper = mount(Tags, {
    props: {
      labels: ['2026-09-17', '2026-09-19', '2026-09-22'],
      disabled: false,
      shape: 'rounded',
    },
  })
  await nextTick()
  await nextTick()
  expect(
    wrapper.findAll('.s-date-picker__tags > .s-tag').map((tag) => tag.text()),
  ).toEqual(['2026-09-17', '2026-09-19', '+1'])
  width = 145
  resize()
  await nextTick()
  expect(
    wrapper.findAll('.s-date-picker__tags > .s-tag').map((tag) => tag.text()),
  ).toEqual(['2026-09-17', '+2'])
  width = 360
  resize()
  await nextTick()
  expect(
    wrapper.findAll('.s-date-picker__tags > .s-tag').map((tag) => tag.text()),
  ).toEqual(['2026-09-17', '2026-09-19', '2026-09-22'])
  wrapper.unmount()
  expect(disconnect).toHaveBeenCalledOnce()
})
