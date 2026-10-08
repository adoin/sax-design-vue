import { nextTick } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Textarea from '../../textarea/src/textarea.vue'
import Select from '../../select/src/select.vue'
import Cascader from '../../cascader/src/cascader.vue'
import TableSelect from '../../table-select/src/table-select.vue'
import Tag from '../../tag/src/tag.vue'
import IconPickerPanel from '../../icon-picker/src/icon-picker-panel.vue'
import PlaceholderText from '../src/placeholder-text.vue'

enableAutoUnmount(afterEach)
let clock = 0
let sequence = 0
let frames: Map<number, FrameRequestCallback>
const advance = (time: number) => {
  clock = time
  const callbacks = [...frames.values()]
  frames.clear()
  callbacks.forEach((callback) => callback(time))
}
beforeEach(() => {
  clock = 0
  sequence = 0
  frames = new Map()
  vi.spyOn(window.performance, 'now').mockImplementation(() => clock)
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.set(++sequence, callback)
    return sequence
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id)
  })
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('shared placeholder animation in independent controls', () => {
  it('isolates filters in separately mounted application roots', async () => {
    const first = mount(PlaceholderText, {
      attachTo: document.body,
      props: { text: 'Page', dissolved: false },
    })
    const second = mount(PlaceholderText, {
      attachTo: document.body,
      props: { text: 'Dialog', dissolved: false },
    })
    await nextTick()
    const firstId = first.get('filter').attributes('id')
    const secondId = second.get('filter').attributes('id')
    expect(firstId).not.toBe(secondId)
    await second.setProps({ dissolved: true })
    advance(160)
    expect(document.querySelector(`[id="${secondId}"]`)).toBe(
      second.get('filter').element,
    )
    expect(
      second.get('.s-placeholder-text__dissolve').attributes('style'),
    ).toContain(secondId)
    expect(first.get('[data-dissolve-threshold]').attributes('intercept')).toBe(
      '1',
    )
    first.unmount()
    second.unmount()
  })
  it.each([
    {
      name: 'Textarea',
      component: Textarea,
      props: { placeholder: 'First line\nSecond line' },
      target: 'textarea',
    },
    {
      name: 'Select',
      component: Select,
      props: { placeholder: 'Choose' },
      target: '.s-select',
    },
    {
      name: 'Multiple Select',
      component: Select,
      props: { placeholder: 'Choose', multiple: true, filterable: true },
      target: '.s-select',
    },
    {
      name: 'Cascader',
      component: Cascader,
      props: { placeholder: 'Choose', options: [] },
      target: '.s-cascader',
    },
    {
      name: 'Search Cascader',
      component: Cascader,
      props: { placeholder: 'Choose', options: [], showSearch: true },
      target: 'input',
    },
    {
      name: 'TableSelect',
      component: TableSelect,
      props: { placeholder: 'Choose', data: [], columns: [] },
      target: '.s-table-select',
    },
    {
      name: 'Editable Tag',
      component: Tag,
      props: { editable: true, editPlaceholder: 'Tag' },
      target: 'input',
    },
    {
      name: 'Icon search',
      component: IconPickerPanel,
      props: { iconList: [], modelValue: '', color: 'primary', showName: true },
      target: 'input',
    },
  ])(
    '$name dissolves on focus and aggregates after blur',
    async ({ component, props, target }) => {
      const wrapper = mount(component as typeof Textarea, {
        props: props as any,
      })
      const placeholder = wrapper.get('.s-placeholder-text')
      const threshold = placeholder.get('[data-dissolve-threshold]')
      const alpha = placeholder.get('[data-dissolve-alpha]')
      expect(threshold.attributes('intercept')).toBe('1')
      expect(
        placeholder.get('.s-placeholder-text__dissolve').attributes('style') ||
          '',
      ).not.toContain('url(')
      await wrapper.get(target).trigger('focus')
      await wrapper.get(target).trigger('focusin')
      advance(16)
      expect(
        placeholder.get('.s-placeholder-text__dissolve').attributes('style') ||
          '',
      ).toContain('url(')
      expect(Number(threshold.attributes('intercept'))).toBeLessThan(1)
      advance(480)
      await nextTick()
      expect(alpha.attributes('slope')).toBe('0')
      expect(
        placeholder.get('.s-placeholder-text__dissolve').attributes('style') ||
          '',
      ).not.toContain('url(')
      await wrapper.get(target).trigger('blur')
      await wrapper.get(target).trigger('focusout')
      advance(1130)
      expect(alpha.attributes('slope')).toBe('1')
      expect(threshold.attributes('intercept')).toBe('1')
      wrapper.unmount()
    },
  )

  it('hides textarea hints for pending IME/deferred content without changing the label', async () => {
    const wrapper = mount(Textarea, {
      props: {
        placeholder: 'Multiline\nhint',
        label: 'Notes',
        immediate: false,
      },
    })
    expect(wrapper.get('.s-placeholder-text').classes()).toContain(
      'is-multiline',
    )
    expect(wrapper.get('textarea').attributes('placeholder')).toBe('')
    expect(wrapper.get('textarea').attributes('aria-label')).toBe('Notes')
    await wrapper.get('textarea').trigger('compositionstart')
    wrapper.get<HTMLTextAreaElement>('textarea').element.value = '中文'
    await wrapper.get('textarea').trigger('input', { isComposing: true })
    expect(wrapper.get('.s-placeholder-text').classes()).toContain('is-hidden')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('.s-textarea__label').text()).toBe('Notes')
  })

  it('does not expose a placeholder over a zero-valued Select option', () => {
    const wrapper = mount(Select, {
      props: {
        placeholder: 'Choose',
        modelValue: 0,
        options: [{ value: 0, label: 'Zero' }],
      },
    })
    expect(wrapper.get('.s-placeholder-text').classes()).toContain('is-hidden')
    expect(wrapper.get('[data-dissolve-alpha]').attributes('slope')).toBe('0')
  })
})
