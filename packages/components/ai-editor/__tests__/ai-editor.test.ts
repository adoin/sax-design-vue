import { defineComponent, h, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AiEditor from '../src/ai-editor.vue'
import { SFocusTrap } from '../../focus-trap'
import { SPopper } from '../../popper'
import { segmentEditorText } from '../src/segment-text'
import type { AiEditorRequest } from '../src/ai-editor'

const wrappers: { unmount(): void }[] = []
const create = (props: Record<string, unknown> = {}) => {
  const wrapper = mount(AiEditor, {
    attachTo: document.body,
    props: {
      modelValue: 'Hello world\nAnother line',
      animate: false,
      ...props,
    },
  })
  wrappers.push(wrapper)
  return wrapper
}
const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('AI Editor document and request lifecycle', () => {
  it('keeps the toolbar open through the click that finishes a mouse selection', async () => {
    const wrapper = create({ answer: 'Answer' })
    const root = wrapper.get('[role="textbox"]')
    await root.trigger('pointerdown')
    const range = document.createRange()
    range.setStart(root.element.firstChild!, 0)
    range.setEnd(root.element.firstChild!, 5)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
    await root.trigger('pointerup')
    await flushPromises()
    root.element.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1 }),
    )
    await new Promise((resolve) => setTimeout(resolve, 250))
    await flushPromises()
    expect(wrapper.getComponent(SPopper).props('visible')).toBe(true)
    document.querySelector<HTMLButtonElement>('.s-ai-editor__ask')!.click()
    await flushPromises()
    expect(
      document.querySelector('input[aria-label="Ask about the selection"]'),
    ).not.toBeNull()
    document.body.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true }),
    )
    document.body.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1 }),
    )
    await new Promise((resolve) => setTimeout(resolve, 250))
    await flushPromises()
    expect(wrapper.getComponent(SPopper).props('visible')).toBe(false)
  })

  it('does not reopen a dismissed toolbar when the preserved selection emits another selectionchange', async () => {
    const wrapper = create({ answer: 'Answer' })
    wrapper.vm.select(0, 5)
    await flushPromises()
    wrapper.vm.close(true)
    document.dispatchEvent(new Event('selectionchange'))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await flushPromises()
    expect(wrapper.getComponent(SPopper).props('visible')).toBe(false)
    wrapper.vm.select(0, 5)
    await flushPromises()
    expect(wrapper.getComponent(SPopper).props('visible')).toBe(true)
  })

  it('retains the selected range when focus enters a toolbar control before its click', async () => {
    const wrapper = create({ answer: 'Answer' })
    wrapper.vm.select(0, 5)
    await flushPromises()
    const button =
      document.querySelector<HTMLButtonElement>('.s-ai-editor__ask')!
    button.focus()
    window.getSelection()?.removeAllRanges()
    document.dispatchEvent(new Event('selectionchange'))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    button.click()
    await flushPromises()
    expect(
      document.querySelector('input[aria-label="Ask about the selection"]'),
    ).not.toBeNull()
  })
  it('accepts only plain dropped text and does not clear selection on an empty transfer', async () => {
    const wrapper = create({ modelValue: 'Hello' })
    wrapper.vm.select(0, 5)
    await wrapper
      .get('[role="textbox"]')
      .trigger('drop', { dataTransfer: { getData: () => '' } })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.get('[role="textbox"]').trigger('drop', {
      dataTransfer: { getData: () => '<img onerror="boom">' },
    })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      '<img onerror="boom">',
    ])
    expect(wrapper.get('[role="textbox"]').find('img').exists()).toBe(false)
  })
  it('reveals a long complete answer in bounded batches without splitting text', async () => {
    vi.useFakeTimers()
    const answer = '回答👨‍👩‍👦'.repeat(500)
    const wrapper = create({ answer, animate: true })
    wrapper.vm.select(0, 5)
    const operation = wrapper.vm.ask('Explain')
    await vi.advanceTimersByTimeAsync(3500)
    expect(await operation).toBe(true)
    expect(wrapper.emitted('response')?.at(-1)?.[0]).toEqual({
      text: answer,
      sources: [],
    })
  })
  it('keeps the clicked document caret when dismissing an AI prompt highlight', async () => {
    const wrapper = create({ answer: 'Reply' })
    wrapper.vm.select(0, 5)
    await wrapper.vm.ask('Explain')
    const root = wrapper.get('[role="textbox"]').element as HTMLElement
    root.focus()
    const range = document.createRange()
    range.setStart(root.childNodes[1], 3)
    range.collapse(true)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
    wrapper.vm.close()
    expect(window.getSelection()?.anchorOffset).toBe(8)
  })

  it('preserves an external document replacement received during IME composition', async () => {
    const wrapper = create({ modelValue: 'Old' })
    const root = wrapper.get('[role="textbox"]')
    await root.trigger('compositionstart')
    root.element.textContent = 'Old你'
    await wrapper.setProps({ modelValue: 'Authoritative replacement' })
    await root.trigger('compositionend')
    expect(root.text()).toBe('Authoritative replacement')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
  it('segments Unicode answers without splitting a grapheme and keeps Chinese words animated', () => {
    expect(segmentEditorText('A👨‍👩‍👦é', 'grapheme')).toEqual(['A', '👨‍👩‍👦', 'é'])
    expect(segmentEditorText('逐步显示回答', 'word').length).toBeGreaterThan(1)
  })

  it('keeps caret position when controlled text and marks echo back after input', async () => {
    const wrapper = create({ modelValue: 'Hi' })
    const input = wrapper.get('[role="textbox"]')
    input.element.textContent = 'Hi你'
    const range = document.createRange()
    range.setStart(input.element.firstChild!, 3)
    range.collapse(true)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
    await input.trigger('input')
    await wrapper.setProps({ modelValue: 'Hi你', marks: [] })
    await flushPromises()
    expect(window.getSelection()?.anchorOffset).toBe(3)
    expect(window.getSelection()?.anchorNode?.textContent).toBe('Hi你')
  })

  it('allows the teleported prompt to receive focus inside an enclosing modal focus layer', async () => {
    const container = shallowRef<HTMLElement>()
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            SFocusTrap,
            { trapped: true, focusTrapEl: container.value },
            {
              default: () =>
                h('div', { ref: container, tabindex: -1 }, [
                  h(AiEditor, {
                    modelValue: 'Hello world',
                    answer: 'Reply',
                    animate: false,
                  }),
                ]),
            },
          ),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    wrapper.getComponent(AiEditor).vm.select(0, 5)
    await flushPromises()
    document.querySelector<HTMLButtonElement>('.s-ai-editor__ask')?.click()
    await flushPromises()
    expect(document.activeElement?.tagName).toBe('INPUT')
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Ask about the selection',
    )
  })
  it('renders text safely and keeps controlled formatting marks separate', () => {
    const wrapper = create({
      modelValue: '<img onerror="boom">Hello',
      marks: [{ start: 19, end: 24, format: 'bold' }],
    })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.get('[role="textbox"]').text()).toContain(
      '<img onerror="boom">Hello',
    )
    expect(wrapper.get('[role="textbox"]').find('strong').exists()).toBe(true)
  })

  it('toggles only the selected part of a format while preserving overlapping formats', async () => {
    const wrapper = create()
    wrapper.vm.select(0, 11)
    wrapper.vm.format('bold')
    wrapper.vm.select(6, 11)
    wrapper.vm.format('italic')
    wrapper.vm.format('bold')
    await flushPromises()
    expect(wrapper.get('strong').element.textContent).toBe('Hello ')
    expect(wrapper.get('em').text()).toBe('world')
    expect(wrapper.emitted('update:marks')?.at(-1)?.[0]).toEqual([
      { start: 0, end: 6, format: 'bold' },
      { start: 6, end: 11, format: 'italic' },
    ])
    expect(window.getSelection()?.toString()).toBe('world')
  })

  it('maintains the caret across input and does not publish partial IME composition', async () => {
    const wrapper = create({ modelValue: 'Hi' })
    const input = wrapper.get('[role="textbox"]')
    await input.trigger('compositionstart')
    input.element.textContent = 'Hi你'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await input.trigger('compositionend')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Hi你'])
    await flushPromises()
    const selection = window.getSelection()!
    expect(selection.anchorNode?.parentElement).toBe(input.element)
  })

  it('pastes literal text and preserves line breaks without inserting markup', async () => {
    const wrapper = create({ modelValue: 'Hello' })
    wrapper.vm.select(0, 5)
    await wrapper.get('[role="textbox"]').trigger('paste', {
      clipboardData: { getData: () => '<b>Safe</b>\nNext line' },
    })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      '<b>Safe</b>\nNext line',
    ])
    expect(wrapper.get('[role="textbox"]').find('b').exists()).toBe(false)
  })

  it('supports formatting undo and redo through keyboard shortcuts', async () => {
    const wrapper = create()
    wrapper.vm.select(0, 5)
    wrapper.vm.format('underline')
    expect(wrapper.find('u').exists()).toBe(true)
    await wrapper
      .get('[role="textbox"]')
      .trigger('keydown', { key: 'z', ctrlKey: true })
    expect(wrapper.find('u').exists()).toBe(false)
    await wrapper
      .get('[role="textbox"]')
      .trigger('keydown', { key: 'z', ctrlKey: true, shiftKey: true })
    expect(wrapper.get('u').text()).toBe('Hello')
  })

  it('captures prompt, selection and document and applies only the chosen range', async () => {
    const request = vi.fn(({ report }: AiEditorRequest) => {
      report({
        status: 'researching',
        sources: [{ label: 'Docs', href: 'javascript:boom' }],
      })
      return {
        text: '<b>New</b>',
        sources: [{ label: 'Docs', href: 'javascript:boom' }],
      }
    })
    const wrapper = create({ request })
    wrapper.vm.select(6, 11)
    expect(await wrapper.vm.ask('Rewrite')).toBe(true)
    const context = request.mock.calls[0][0]
    expect(context.prompt).toBe('Rewrite')
    expect(context.selection).toEqual({ start: 6, end: 11, text: 'world' })
    expect(context.document).toBe('Hello world\nAnother line')
    expect(document.querySelector('.s-ai-editor__response b')).toBeNull()
    expect(document.querySelector('.s-ai-editor__sources a')).toBeNull()
    expect(wrapper.vm.apply('replace')).toBe(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'Hello <b>New</b>\nAnother line',
    ])
  })

  it('inserts the answer after the selected paragraph', async () => {
    const wrapper = create({ answer: 'Extra text' })
    wrapper.vm.select(0, 5)
    await wrapper.vm.ask('Continue')
    wrapper.vm.apply('insert')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'Hello world\nExtra text\nAnother line',
    ])
  })

  it('cancels and ignores late responses when external document content changes', async () => {
    const pending = deferred<string>()
    let context!: AiEditorRequest
    const wrapper = create({
      request: (request: AiEditorRequest) => {
        context = request
        return pending.promise
      },
    })
    wrapper.vm.select(0, 5)
    const operation = wrapper.vm.ask('Explain')
    await flushPromises()
    await wrapper.setProps({ modelValue: 'New document' })
    expect(context.signal.aborted).toBe(true)
    pending.resolve('Stale answer')
    expect(await operation).toBe(false)
    expect(wrapper.emitted('response')).toBeUndefined()
    expect(wrapper.get('[role="textbox"]').text()).toBe('New document')
  })

  it('renders streamed chunks and discards chunks received after cancel', async () => {
    const pending = deferred<void>()
    const wrapper = create({
      async *request() {
        yield 'First '
        await pending.promise
        yield 'stale'
      },
    })
    wrapper.vm.select(0, 5)
    const operation = wrapper.vm.ask('Explain')
    await flushPromises()
    expect(
      document.querySelector('.s-ai-editor__response')?.textContent,
    ).toContain('First ')
    wrapper.vm.cancel()
    expect(await operation).toBe(false)
    pending.resolve()
    expect(wrapper.emitted('response')).toBeUndefined()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('shows rejection text and permits a retry with a new request', async () => {
    const wrapper = create({
      request: () => Promise.reject(new Error('Unavailable')),
    })
    wrapper.vm.select(0, 5)
    expect(await wrapper.vm.ask('Explain')).toBe(false)
    await flushPromises()
    expect(document.querySelector('[role="alert"]')?.textContent).toBe(
      'Unavailable',
    )
    await wrapper.setProps({ request: () => 'Ready' })
    expect(await wrapper.vm.ask('Retry')).toBe(true)
    expect(wrapper.emitted('response')?.at(-1)?.[0]).toEqual({
      text: 'Ready',
      sources: [],
    })
  })

  it('keeps readonly selection/AI available while blocking mutation and disables all actions when disabled', async () => {
    const wrapper = create({ readonly: true, answer: 'Answer' })
    wrapper.vm.select(0, 5)
    wrapper.vm.format('bold')
    expect(wrapper.find('strong').exists()).toBe(false)
    expect(await wrapper.vm.ask('Explain')).toBe(true)
    expect(wrapper.vm.apply('replace')).toBe(false)
    await wrapper.setProps({ disabled: true })
    expect(wrapper.vm.select(0, 5)).toBe(false)
    expect(await wrapper.vm.ask('Explain')).toBe(false)
  })
})
