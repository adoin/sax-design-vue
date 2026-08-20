import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Text from '../src/text.vue'

describe('Text', () => {
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('uses lineClamp 1 for single-line truncation', () => {
    const wrapper = mount(Text, {
      props: { content: 'One line', lineClamp: 1 },
    })

    expect(wrapper.classes()).toContain('is-ellipsis')
    expect(wrapper.classes()).not.toContain('is-clamp')
    expect(wrapper.attributes('title')).toBe('One line')
  })

  it('uses lineClamp values above 1 for multi-line truncation', () => {
    const wrapper = mount(Text, {
      props: { content: 'Two lines', lineClamp: 2 },
    })

    expect(wrapper.classes()).toContain('is-clamp')
    expect(wrapper.attributes('style')).toContain('-webkit-line-clamp: 2')
  })

  it('does not truncate when lineClamp is false', () => {
    const wrapper = mount(Text, {
      props: { content: 'Full text', lineClamp: false },
    })

    expect(wrapper.classes()).not.toContain('is-ellipsis')
    expect(wrapper.classes()).not.toContain('is-clamp')
    expect(wrapper.attributes('title')).toBeUndefined()
  })

  it('types content character by character and removes the caret on finish', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Text, {
      props: { content: '你好', typing: 10 },
    })
    await nextTick()

    expect(wrapper.text()).toBe('')
    expect(wrapper.find('.s-text__typing-caret').exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('你好')
    expect(wrapper.attributes('aria-busy')).toBe('true')

    vi.advanceTimersByTime(10)
    await nextTick()
    expect(wrapper.text()).toBe('你')

    vi.advanceTimersByTime(10)
    await nextTick()
    expect(wrapper.text()).toBe('你好')
    expect(wrapper.find('.s-text__typing-caret').exists()).toBe(false)
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('shows the full text immediately when reduced motion is preferred', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const wrapper = mount(Text, {
      props: { content: 'Accessible text', typing: true },
    })

    await nextTick()
    expect(wrapper.text()).toBe('Accessible text')
    expect(wrapper.find('.s-text__typing-caret').exists()).toBe(false)
  })

  it('cancels the previous typing run when content changes', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Text, {
      props: { content: 'Old', typing: 10 },
    })
    await nextTick()

    await wrapper.setProps({ content: 'New' })
    await nextTick()
    vi.advanceTimersByTime(30)
    await nextTick()

    expect(wrapper.text()).toBe('New')
    expect(vi.getTimerCount()).toBe(0)
  })
})
