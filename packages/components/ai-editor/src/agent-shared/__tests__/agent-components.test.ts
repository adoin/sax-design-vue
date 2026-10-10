import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { renderToString } from '@vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ReasoningSteps from '../../../../reasoning-steps/src/reasoning-steps.vue'
import TaskList from '../../../../task-list/src/task-list.vue'
import FileDiff from '../../../../file-diff/src/file-diff.vue'
import ImageGeneration from '../../../../image-generation/src/image-generation.vue'
import GenerationCanvas from '../../../../image-generation/src/generation-canvas.vue'
import StreamingText from '../../../../streaming-text/src/streaming-text.vue'
import InlineCitations from '../../../../inline-citations/src/inline-citations.vue'
import ChatHistory from '../../../../chat-history/src/chat-history.vue'
import CodeBlock from '../../../../code-block/src/code-block.vue'
import ChatInput from '../../../../chat-input/src/chat-input.vue'
import PlanCard from '../../../../plan-card/src/plan-card.vue'
import QuestionCard from '../../../../question-card/src/question-card.vue'
import Message from '../../../../message/src/message.vue'
import MessageScroller from '../../../../message-scroller/src/message-scroller.vue'
import { SConfigProvider } from '../../../../config-provider'
import { clampProgress, safeAgentHref } from '../utils'
import { tokenizeAgentCode } from '../../../../code-block/src/tokenize-code'
import type { Component } from 'vue'

const wrappers: { unmount(): void }[] = []
const create = (
  component: Component,
  props: Record<string, unknown> = {},
  slots = {},
) => {
  const wrapper = mount(component, { props, slots, attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}
const tasks = [
  { id: '1', title: 'Research', status: 'running', progress: 150 },
  { id: '2', title: 'Write', status: 'complete' },
]
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Agent process, result and safety contracts', () => {
  it('keeps the generation canvas frame loop bounded and cancels it on unmount', async () => {
    vi.useFakeTimers()
    const context = {
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
    } as unknown as CanvasRenderingContext2D
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(context)
    const wrapper = create(GenerationCanvas, { active: true, progress: 50 })
    await vi.advanceTimersByTimeAsync(100)
    expect(context.arc).toHaveBeenCalled()
    expect(vi.getTimerCount()).toBeLessThanOrEqual(1)
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('selects question letter shortcuts without intercepting custom answer typing', async () => {
    const wrapper = create(QuestionCard, {
      questions: [
        {
          id: 'q',
          title: 'Choose',
          allowCustom: true,
          options: [
            { value: 'a', label: 'First' },
            { value: 'b', label: 'Second' },
          ],
        },
      ],
    })
    await wrapper.trigger('keydown', { key: 'b' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      [{ questionId: 'q', value: 'b', custom: false }],
    ])
    await wrapper.get('input').trigger('keydown', { key: 'a' })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('previews only three plan tasks until more is explicitly expanded', async () => {
    const wrapper = create(PlanCard, {
      tasks: Array.from({ length: 5 }, (_, i) => ({
        id: String(i),
        title: `Task ${i}`,
        status: 'pending',
      })),
    })
    expect(wrapper.findAll('.s-agent-plan-tasks li')).toHaveLength(3)
    await wrapper.get('.s-agent-plan-tasks > button').trigger('click')
    expect(wrapper.findAll('.s-agent-plan-tasks li')).toHaveLength(5)
    expect(wrapper.emitted('approve')).toBeUndefined()
  })

  it('replaces source chips with incoming reasoning and collapses at completion', async () => {
    vi.useFakeTimers()
    const wrapper = create(ReasoningSteps, {
      steps: tasks,
      sources: [{ id: 's', title: 'Source', iconSrc: '/source.svg' }],
    })
    expect(wrapper.find('.s-reasoning-steps__sources').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('/source.svg')
    await wrapper.setProps({
      reasoning: ['First observation', 'Second observation'],
    })
    await vi.advanceTimersByTimeAsync(250)
    expect(wrapper.find('.s-reasoning-steps__sources').exists()).toBe(false)
    expect(wrapper.findAll('.s-reasoning-steps__paragraph')).toHaveLength(2)
    await vi.advanceTimersByTimeAsync(6750)
    await wrapper.setProps({
      steps: tasks.map((task) => ({ ...task, status: 'complete' })),
    })
    await vi.advanceTimersByTimeAsync(250)
    expect(wrapper.find('.s-reasoning-steps__summary-text').text()).toBe(
      'Thought for 7s',
    )
    expect(wrapper.find('.s-reasoning-steps__reasoning').exists()).toBe(false)
    expect(wrapper.emitted('update:expanded')?.at(-1)).toEqual([false])
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:expanded')?.at(-1)).toEqual([true])
    await wrapper.setProps({ expanded: true })
    expect(wrapper.findAll('.s-reasoning-steps__paragraph')).toHaveLength(2)
  })

  it('keeps controlled reasoning expansion and reports the selected step', async () => {
    const wrapper = create(ReasoningSteps, { steps: tasks, expanded: true })
    expect(wrapper.attributes('aria-busy')).toBe('true')
    await wrapper.find('button').trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('update:expanded')).toEqual([[false]])
    expect(wrapper.find('ol').exists()).toBe(true)
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('step-click')?.[0][0]).toEqual(tasks[0])
    await wrapper.setProps({ expanded: false })
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
  })
  it('clamps task progress and keeps error and cancelled labels visible without color', () => {
    const wrapper = create(TaskList, {
      tasks: [
        ...tasks,
        { id: '3', title: 'Failed task', status: 'error' },
        { id: '4', title: 'Cancelled task', status: 'cancelled' },
      ],
    })
    expect(
      wrapper.find('[role="progressbar"]').attributes('aria-valuenow'),
    ).toBe('100')
    expect(
      wrapper.find('.is-error .s-agent-status-marker').attributes('aria-label'),
    ).toBe('Failed')
    expect(
      wrapper
        .find('.is-cancelled .s-agent-status-marker')
        .attributes('aria-label'),
    ).toBe('Cancelled')
  })
  it('only enables task actions when opted in', async () => {
    const wrapper = create(TaskList, {
      tasks,
      interactive: true,
      disabled: true,
    })
    await wrapper.find('.s-agent-text-button').trigger('click')
    expect(wrapper.emitted('task-click')).toBeUndefined()
    await wrapper.setProps({ disabled: false })
    await wrapper.find('.s-agent-text-button').trigger('click')
    expect(wrapper.emitted('task-click')).toHaveLength(1)
  })
  it('renders diff code as text and retains the original line numbers', async () => {
    const wrapper = create(FileDiff, {
      filename: 'a.vue',
      lines: [
        { type: 'remove', content: '<script>alert(1)</script>', oldLine: 7 },
        { type: 'add', content: 'safe', newLine: 8 },
      ],
    })
    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.find('code').text()).toBe('<script>alert(1)</script>')
    expect(wrapper.text()).toContain('7')
    await wrapper
      .findAllComponents({ name: 'SButton' })[0]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('apply')).toHaveLength(1)
  })
  it('renders image progress and sends cancel, retry and download without requesting a service', async () => {
    const wrapper = create(ImageGeneration, {
      status: 'running',
      progress: Number.NaN,
    })
    expect(
      wrapper.find('[role="progressbar"]').attributes('aria-valuenow'),
    ).toBe('0')
    await wrapper
      .findComponent({ name: 'SButton' })
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    await wrapper.setProps({ status: 'error', error: 'Network unavailable' })
    await new Promise((resolve) => setTimeout(resolve, 250))
    expect(wrapper.text()).toContain('Network unavailable')
    await wrapper
      .findComponent({ name: 'SButton' })
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('retry')).toHaveLength(1)
    await wrapper.setProps({
      status: 'complete',
      src: 'https://example.com/image.png',
      alt: 'Landscape',
    })
    await new Promise((resolve) => setTimeout(resolve, 250))
    expect(wrapper.find('img').attributes('alt')).toBe('Landscape')
    await wrapper
      .findComponent({ name: 'SButton' })
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('download')).toEqual([
      ['https://example.com/image.png'],
    ])
  })
  it('rejects unsafe citation protocols and normalizes safe absolute links', () => {
    expect(safeAgentHref('javascript:alert(1)')).toBeUndefined()
    expect(safeAgentHref('data:text/html,hello')).toBeUndefined()
    expect(safeAgentHref('https://example.com')).toBe('https://example.com/')
    expect(clampProgress(Infinity)).toBe(0)
  })
  it('opens escaped citation previews through the shared teleported popper', async () => {
    const wrapper = create(InlineCitations, {
      sources: [
        {
          id: '1',
          title: '<img onerror=alert(1)>',
          href: 'javascript:alert(1)',
        },
      ],
    })
    await wrapper.find('button').trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    await flushPromises()
    expect(document.body.textContent).toContain('<img onerror=alert(1)>')
    expect(document.body.querySelector('.s-agent-source a')).toBeNull()
    expect(wrapper.findComponent({ name: 'SPopper' }).props('teleported')).toBe(
      true,
    )
  })
  it('filters history to user prompts and closes after selection', async () => {
    const wrapper = create(ChatHistory, {
      modelValue: true,
      messages: [
        { id: '1', role: 'user', content: 'Prompt' },
        { id: '2', role: 'assistant', content: 'Response' },
      ],
    })
    await flushPromises()
    const button = document.body.querySelector<HTMLButtonElement>(
      '.s-agent-history-item',
    )!
    expect(button.textContent).toContain('Prompt')
    expect(
      document.body.querySelectorAll('.s-agent-history-item'),
    ).toHaveLength(1)
    button.click()
    await nextTick()
    expect(wrapper.emitted('select')?.[0][0]).toEqual({
      id: '1',
      role: 'user',
      content: 'Prompt',
    })
    expect(wrapper.emitted('update:modelValue')).toContainEqual([false])
  })
  it('tokenizes code safely across multiline comments and preserves every character', () => {
    const code = '/* hello\nworld */\nconst x = "<script>";\n'
    const lines = tokenizeAgentCode(code, 'ts')
    expect(
      lines.map((line) => line.map((token) => token.text).join('')).join('\n'),
    ).toBe(code)
    expect(lines[1][0].kind).toBe('comment')
    expect(tokenizeAgentCode(code, 'unknown')[0][0].kind).toBeUndefined()
  })
  it('copies exact code, announces success and handles clipboard rejection', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const wrapper = create(CodeBlock, {
      code: 'const x = "<img>"',
      language: 'ts',
    })
    await wrapper
      .findAllComponents({ name: 'SButton' })[0]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('const x = "<img>"')
    expect(wrapper.emitted('copy')).toHaveLength(1)
    expect(wrapper.find('img').exists()).toBe(false)
    writeText.mockRejectedValueOnce(new Error('Denied'))
    await wrapper
      .findAllComponents({ name: 'SButton' })[0]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    await flushPromises()
    expect(wrapper.emitted('copy-error')).toHaveLength(1)
  })
  it('inherits square geometry through the shared provider', () => {
    const wrapper = create(
      defineComponent({
        setup: () => () =>
          h(
            SConfigProvider,
            { shape: 'square' },
            { default: () => h(TaskList, { tasks: [] }) },
          ),
      }),
    )
    expect(wrapper.find('.s-task-list').classes()).toContain('is-square')
  })
  it('forwards a local rounded override to action buttons inside a square provider', () => {
    const wrapper = create(
      defineComponent({
        setup: () => () =>
          h(
            SConfigProvider,
            { shape: 'square' },
            { default: () => h(PlanCard, { shape: 'rounded', title: 'Plan' }) },
          ),
      }),
    )
    expect(wrapper.find('.s-plan-card').classes()).toContain('is-rounded')
    const buttons = wrapper.findAllComponents({ name: 'SButton' })
    expect(buttons.every((button) => button.props('shape') === 'rounded')).toBe(
      true,
    )
    expect(
      buttons.every((button) => button.classes().includes('s-button--rounded')),
    ).toBe(true)
  })
})

describe('Streaming lifecycle', () => {
  it('preserves graphemes, pauses, appends, replaces and finishes once per text', async () => {
    vi.useFakeTimers()
    const wrapper = create(StreamingText, { text: '👨‍👩‍👧你好', interval: 20 })
    await vi.advanceTimersByTimeAsync(20)
    expect(wrapper.find('.s-agent-stream').text()).toContain('👨‍👩‍👧')
    await wrapper.setProps({ paused: true })
    const before = wrapper.find('.s-agent-stream').text()
    await vi.advanceTimersByTimeAsync(100)
    expect(wrapper.find('.s-agent-stream').text()).toBe(before)
    await wrapper.setProps({ paused: false })
    await vi.runAllTimersAsync()
    expect(wrapper.emitted('finish')).toHaveLength(1)
    await wrapper.setProps({ text: '👨‍👩‍👧你好世界' })
    await vi.runAllTimersAsync()
    expect(wrapper.emitted('finish')).toHaveLength(2)
    await wrapper.setProps({ text: 'New', animate: false })
    await nextTick()
    expect(wrapper.find('.s-agent-stream').text()).toContain('New')
  })
  it('cleans timers on unmount and bounds long text reveal work', async () => {
    vi.useFakeTimers()
    const wrapper = create(StreamingText, {
      text: 'a'.repeat(10000),
      interval: 5,
    })
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.emitted('finish')).toHaveLength(1)
    await wrapper.setProps({ text: 'different' })
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('shows text immediately under reduced motion', async () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const wrapper = create(StreamingText, { text: 'Reduced motion' })
    await nextTick()
    expect(wrapper.find('.s-agent-stream').text()).toContain('Reduced motion')
    expect(wrapper.emitted('finish')).toHaveLength(1)
  })
})

describe('Input, confirmation and message actions', () => {
  it('does not send during IME, allows Shift+Enter and submits once on Enter', async () => {
    const wrapper = create(ChatInput, { modelValue: '你好' })
    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown', { key: 'Enter', isComposing: true })
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: true })
    expect(wrapper.emitted('submit')).toBeUndefined()
    await textarea.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('submit')).toEqual([['你好', []]])
    expect(wrapper.props('modelValue')).toBe('你好')
  })
  it('blocks whitespace and loading submissions but exposes stop', async () => {
    const wrapper = create(ChatInput, { modelValue: '   ' })
    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('submit')).toBeUndefined()
    await wrapper.setProps({ loading: true, modelValue: 'Hello' })
    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('submit')).toBeUndefined()
    await wrapper
      .findAllComponents({ name: 'SButton' })
      .slice(-1)[0]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('stop')).toHaveLength(1)
  })
  it('supports attachment-only submissions and removal events', async () => {
    const attachment = { id: 'a', name: 'notes.txt' }
    const wrapper = create(ChatInput, { attachments: [attachment] })
    await wrapper
      .findAllComponents({ name: 'SButton' })
      .slice(-1)[0]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('submit')).toEqual([['', [attachment]]])
    wrapper.findComponent({ name: 'STag' }).vm.$emit('close')
    expect(wrapper.emitted('remove-attachment')).toEqual([[attachment]])
  })
  it('only presents plan decisions while pending and keeps expansion controlled', async () => {
    const wrapper = create(PlanCard, { title: 'Plan', content: 'Details' })
    await wrapper
      .findAllComponents({ name: 'SButton' })[1]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('approve')).toHaveLength(1)
    await wrapper.find('.s-agent-text-button').trigger('click')
    expect(wrapper.emitted('update:expanded')).toEqual([[true]])
    await wrapper.setProps({ status: 'approved' })
    expect(wrapper.find('[role="status"]').text()).toBe('Approved')
  })
  it('validates answers, rejects disabled options and completes a controlled question sequence', async () => {
    const questions = [
      {
        id: 'q1',
        title: 'Choose',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      },
      { id: 'q2', title: 'Explain', options: [], allowCustom: true },
    ]
    const wrapper = create(QuestionCard, { questions })
    await wrapper.findAll('.s-agent-option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.findAll('.s-agent-option')[0].trigger('click')
    const answers = wrapper.emitted('update:modelValue')![0][0]
    await wrapper.setProps({ modelValue: answers })
    await wrapper
      .findAllComponents({ name: 'SButton' })
      .slice(-1)[0]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('update:activeIndex')).toEqual([[1]])
    await wrapper.setProps({
      activeIndex: 1,
      modelValue: [
        { questionId: 'q1', value: 'a' },
        { questionId: 'q2', value: ' ', custom: true },
      ],
    })
    expect(
      wrapper
        .findAllComponents({ name: 'SButton' })
        .slice(-1)[0]
        .attributes('disabled'),
    ).toBeDefined()
    await wrapper.setProps({
      modelValue: [
        { questionId: 'q1', value: 'a' },
        { questionId: 'q2', value: 'Answer', custom: true },
      ],
    })
    await wrapper.trigger('keydown', { key: 'Enter', ctrlKey: true })
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })
  it('only allows explicit optional questions to skip', async () => {
    const wrapper = create(QuestionCard, {
      questions: [{ id: 'q', title: 'Optional', options: [], optional: true }],
    })
    await wrapper
      .findAllComponents({ name: 'SButton' })[0]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('skip')).toHaveLength(1)
    expect(wrapper.emitted('submit')).toEqual([[[]]])
  })
  it('exposes controlled timestamps and toggled feedback without mutating content', async () => {
    const wrapper = create(Message, {
      content: '<b>Literal</b>',
      sentAt: 'Today',
    })
    expect(wrapper.find('b').exists()).toBe(false)
    await wrapper.find('.s-agent-message-body').trigger('click')
    expect(wrapper.emitted('update:showTime')).toEqual([[true]])
    await wrapper
      .findAllComponents({ name: 'SButton' })[1]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('update:feedback')).toEqual([['like']])
    await wrapper.setProps({ feedback: 'like', showTime: true })
    await wrapper
      .findAllComponents({ name: 'SButton' })[1]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('update:feedback')?.[1]).toEqual([null])
    expect(wrapper.find('time').text()).toBe('Today')
  })
})

describe('Message scroll ownership', () => {
  it('follows new content, pauses when reading history, preserves prepends and cleans observers', async () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    })
    let resize!: () => void
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
    const messages = shallowRef(['one', 'two'])
    const wrapper = create(
      defineComponent({
        setup: () => () =>
          h(
            MessageScroller,
            {},
            {
              default: () =>
                messages.value.map((message) =>
                  h('p', { key: message }, message),
                ),
            },
          ),
      }),
    )
    await flushPromises()
    const viewport = wrapper.find('.s-agent-viewport').element as HTMLElement
    let height = 500
    Object.defineProperties(viewport, {
      scrollHeight: { get: () => height },
      clientHeight: { value: 200 },
      scrollTop: { value: 300, writable: true },
    })
    viewport.scrollTo = vi.fn((options?: ScrollToOptions | number) => {
      if (typeof options === 'object') viewport.scrollTop = options.top ?? 0
    }) as typeof viewport.scrollTo
    resize()
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await nextTick()
    expect(viewport.scrollTo).toHaveBeenCalled()
    viewport.scrollTop = 100
    await wrapper.find('.s-agent-viewport').trigger('scroll')
    const scroller = wrapper.findComponent(MessageScroller)
    expect(scroller.emitted('follow-change')).toContainEqual([false])
    height = 600
    messages.value = ['earlier', ...messages.value]
    await nextTick()
    resize()
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await nextTick()
    expect(viewport.scrollTop).toBe(200)
    expect(wrapper.text()).toContain('Latest messages')
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalled()
  })
})

describe('History isolation and question completion', () => {
  it('makes the optional transcript inert while history is open and restores it on close', async () => {
    const wrapper = create(
      ChatHistory,
      {
        modelValue: true,
        messages: [{ id: '1', role: 'user', content: 'Prompt' }],
      },
      { default: '<button>Transcript action</button>' },
    )
    expect(
      wrapper.find('.s-agent-history-transcript').attributes('inert'),
    ).toBeDefined()
    expect(
      wrapper.find('.s-agent-history-transcript').attributes('aria-hidden'),
    ).toBe('true')
    await wrapper.setProps({ modelValue: false })
    expect(
      wrapper.find('.s-agent-history-transcript').attributes('inert'),
    ).toBeUndefined()
    expect(wrapper.find('.s-agent-history-transcript').classes()).not.toContain(
      'is-open',
    )
  })
  it('does not submit a skipped final question when an earlier required answer is absent', async () => {
    const wrapper = create(QuestionCard, {
      activeIndex: 1,
      questions: [
        {
          id: 'required',
          title: 'Required',
          options: [{ value: 'a', label: 'A' }],
        },
        { id: 'optional', title: 'Optional', options: [], optional: true },
      ],
    })
    await wrapper
      .findAllComponents({ name: 'SButton' })[1]
      .find('button')
      .trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 65))
    expect(wrapper.emitted('skip')).toHaveLength(1)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})

describe('Server rendering and local downloads', () => {
  it('renders all Agent components without browser-only work during setup', async () => {
    const components = [
      ReasoningSteps,
      TaskList,
      FileDiff,
      ImageGeneration,
      StreamingText,
      InlineCitations,
      ChatHistory,
      CodeBlock,
      ChatInput,
      PlanCard,
      QuestionCard,
      Message,
      MessageScroller,
    ]
    for (const component of components) {
      const html = await renderToString(
        h(component, { text: 'Hello', content: 'Hello' }),
      )
      expect(html).toContain('s-')
    }
  })
  it('downloads exact source and releases its object URL', async () => {
    vi.useFakeTimers()
    const createObjectURL = vi.fn().mockReturnValue('blob:agent-code')
    const revokeObjectURL = vi.fn()
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    })
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {})
    const wrapper = create(CodeBlock, {
      code: 'const a = 1\n',
      filename: 'a.ts',
    })
    wrapper.vm.download()
    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob)
    expect(click).toHaveBeenCalledOnce()
    expect(wrapper.emitted('download')).toHaveLength(1)
    await vi.runAllTimersAsync()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:agent-code')
  })
})
