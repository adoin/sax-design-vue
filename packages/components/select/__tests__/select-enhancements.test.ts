import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import zhCn from '@vuesax-alpha/locale/lang/zh-cn'
import { localeContextKey } from '@vuesax-alpha/hooks'
import Select from '../src/select.vue'
import { selectProps } from '../src/select'
import type { ComponentMountingOptions } from '@vue/test-utils'

const PopperStub = defineComponent({
  name: 'SPopper',
  props: {
    popperClass: [String, Array, Object],
    popperStyle: [Object, Array],
    fit: Boolean,
  },
  setup(_, { expose }) {
    expose({
      contentRef: undefined,
      isFocusInsideContent: false,
      popperPlacement: 'bottom',
      updatePopper: () => undefined,
    })
  },
  template:
    '<div class="popper-stub"><slot /><div class="popper-content"><slot name="content" /></div></div>',
})

const virtualScrollToIndex = vi.fn()
const virtualScrollToOffset = vi.fn()
const virtualMeasure = vi.fn()

const VirtualListStub = defineComponent({
  name: 'SVirtualList',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { expose, slots }) {
    expose({
      scrollToIndex: virtualScrollToIndex,
      scrollToOffset: virtualScrollToOffset,
      measure: virtualMeasure,
    })

    return () =>
      h(
        'div',
        { class: 'virtual-list-stub' },
        props.items.map((item, index) =>
          slots.default?.({ item, index, keyValue: index }),
        ),
      )
  },
})

const mountSelect = (
  props: Record<string, unknown>,
  slots: NonNullable<ComponentMountingOptions<typeof Select>['slots']> = {},
  locale?: typeof zhCn,
) =>
  mount(Select, {
    props,
    slots,
    global: {
      provide: locale
        ? {
            [localeContextKey as symbol]: ref(locale),
          }
        : {},
      stubs: {
        SPopper: PopperStub,
        SScrollbar: { template: '<div><slot /></div>' },
        STag: {
          props: ['size'],
          template: '<span class="tag-stub" :data-size="size"><slot /></span>',
        },
        SIcon: { template: '<i class="icon-stub" />' },
        IconClose: { template: '<i />' },
        IconLoading: { template: '<i />' },
        SCollapseTransition: { template: '<div><slot /></div>' },
        SVirtualList: VirtualListStub,
      },
    },
  })

afterEach(() => {
  vi.useRealTimers()
})

describe('Select enhanced capabilities', () => {
  it('uses a trailing control loader and blocks input without clearing the selection', () => {
    const wrapper = mountSelect({
      modelValue: 'a',
      loading: true,
      options: [{ value: 'a', label: 'Alpha' }],
    })
    expect(wrapper.find('.s-control-loading').exists()).toBe(true)
    expect(wrapper.find('.s-select__arrow').exists()).toBe(false)
    expect(
      wrapper.get<HTMLInputElement>('.s-select__input').element.disabled,
    ).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
  it('uses placeholder as the floating label and prioritizes an explicit label', async () => {
    const wrapper = mountSelect({
      modelValue: '',
      labelFloat: true,
      placeholder: 'Choose a city',
      options: [{ label: 'Paris', value: 'paris' }],
    })
    expect(wrapper.get('.s-select__label').text()).toBe('Choose a city')
    expect(wrapper.get('.s-select__label').classes()).toContain(
      'is-placeholder',
    )
    await wrapper.setProps({ modelValue: 'paris' })
    expect(wrapper.get('.s-select__label').classes()).not.toContain(
      'is-placeholder',
    )
    await wrapper.setProps({ label: 'City' })
    expect(wrapper.get('.s-select__label').text()).toBe('City')
    await wrapper.setProps({
      label: '',
      placeholder: 'Choose again',
      modelValue: '',
    })
    expect(wrapper.get('.s-select__label').text()).toBe('Choose again')
    expect(wrapper.get('.s-select__label').classes()).toContain(
      'is-placeholder',
    )
    wrapper.unmount()
  })

  it('keeps an empty multiple floating label inside without duplicate placeholder text', () => {
    const wrapper = mountSelect({
      modelValue: [],
      multiple: true,
      filterable: true,
      labelFloat: true,
      placeholder: 'Choose cities',
    })
    expect(wrapper.get('.s-select__label').text()).toBe('Choose cities')
    expect(wrapper.get('.s-select__label').classes()).toContain(
      'is-placeholder',
    )
    expect(
      wrapper.get('.s-select__input-filter').attributes('placeholder'),
    ).toBe('')
    wrapper.unmount()
  })

  it.each(['small', 'default', 'large'] as const)(
    'renders the inherited %s size class',
    (size) => {
      const wrapper = mountSelect({ size })
      expect(wrapper.get('.s-select').classes()).toContain(`s-select--${size}`)
    },
  )

  it.each(['small', 'default', 'large'] as const)(
    'uses the %s size for visible and measured multiple tags',
    async (size) => {
      const wrapper = mountSelect({
        size,
        multiple: true,
        modelValue: ['ada', 'grace'],
        options: [
          { label: 'Ada', value: 'ada' },
          { label: 'Grace', value: 'grace' },
        ],
      })
      await nextTick()
      const tags = wrapper.findAll('.tag-stub')
      expect(tags.length).toBeGreaterThan(2)
      expect(tags.every((tag) => tag.attributes('data-size') === size)).toBe(
        true,
      )
    },
  )

  it('disables the native trigger and cancels keyboard opening when disabled', async () => {
    const wrapper = mountSelect({
      disabled: true,
      options: [{ label: 'A', value: 'a' }],
    })
    const input = wrapper.get<HTMLInputElement>('.s-select__input')
    expect(input.element.disabled).toBe(true)
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.s-select.is-open').exists()).toBe(false)
    await wrapper.setProps({ disabled: false })
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.s-select.is-open').exists()).toBe(true)
    await wrapper.setProps({ disabled: true })
    expect(input.element.disabled).toBe(true)
    expect(wrapper.find('.s-select.is-open').exists()).toBe(false)
    await wrapper.setProps({ disabled: false })
    expect(wrapper.find('.s-select.is-open').exists()).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
  it('keeps square geometry on the trigger and popup while open', async () => {
    const wrapper = mountSelect({
      modelValue: '',
      shape: 'square',
      options: [{ value: 'design', label: 'Design' }],
    })
    await nextTick()

    expect(wrapper.get('.s-select').classes()).toContain('is-square')

    await wrapper.get('.s-select').trigger('mouseenter')
    await wrapper.get('.s-select').trigger('click')
    await nextTick()

    expect(wrapper.get('.s-select').classes()).toEqual(
      expect.arrayContaining(['is-square', 'is-open']),
    )
    expect(wrapper.getComponent(PopperStub).props('popperClass')).toEqual(
      expect.arrayContaining(['s-select__content', 'is-square']),
    )
  })

  it('collapses overflowing multiple tags by default', () => {
    expect(selectProps.collapseTags.default).toBe(true)
  })

  it('uses cached options to restore a selected label', async () => {
    const wrapper = mountSelect({
      modelValue: 'cached',
      options: [{ value: 'current', label: 'Current result' }],
      cachedOptions: [{ value: 'cached', label: 'Cached result' }],
    })
    await nextTick()

    expect(
      (wrapper.get('.s-select__input').element as HTMLInputElement).value,
    ).toBe('Cached result')
  })

  it.each(['normal', 'grouped', 'virtual'])(
    'renders custom %s options with reactive search context',
    async (mode) => {
      vi.useFakeTimers()
      const option = { value: 'hz', name: 'Hangzhou' }
      const group = { label: 'Cities', options: [option] }
      const renderItem = vi.fn((item, context) =>
        h(
          'strong',
          { class: 'custom-option' },
          context.highlight(context.label),
        ),
      )
      const wrapper = mountSelect({
        modelValue: 'hz',
        filterable: true,
        highlightSearch: true,
        optionProps: { label: 'name' },
        options: mode === 'grouped' ? [] : [option],
        optionGroups: mode === 'grouped' ? [group] : [],
        virtual: mode === 'virtual',
        virtualConfig: { threshold: 1 },
        renderItem,
      })
      await nextTick()
      expect(wrapper.get('.custom-option').text()).toBe('Hangzhou')
      expect(renderItem).toHaveBeenLastCalledWith(
        option,
        expect.objectContaining({
          keyword: 'Hangzhou',
          matched: true,
          selected: true,
          group: mode === 'grouped' ? group : undefined,
        }),
      )
      await wrapper.get('.s-select').trigger('click')
      await wrapper.get('.s-select__input').setValue('ZHOU')
      vi.runAllTimers()
      await nextTick()
      expect(wrapper.get('.custom-option mark').text()).toBe('zhou')
      expect(renderItem).toHaveBeenLastCalledWith(
        option,
        expect.objectContaining({ keyword: 'ZHOU', matched: true }),
      )
      await wrapper.setProps({ highlightSearch: false })
      expect(wrapper.find('.custom-option mark').exists()).toBe(false)
      expect(renderItem).toHaveBeenLastCalledWith(
        option,
        expect.objectContaining({ keyword: 'ZHOU', matched: true }),
      )
    },
  )

  it('prefers the option slot over renderItem and exposes search helpers', async () => {
    const renderItem = vi.fn(() => 'callback')
    const wrapper = mountSelect(
      { options: [{ value: 'a', label: 'Alpha' }], renderItem },
      {
        option: ({ label, highlight }) => h('em', highlight(label)),
      },
    )
    await nextTick()
    expect(wrapper.get('em').text()).toBe('Alpha')
    expect(renderItem).not.toHaveBeenCalled()
  })

  it('highlights text matched by data-driven filtering', async () => {
    vi.useFakeTimers()
    const wrapper = mountSelect({
      modelValue: '',
      filterable: true,
      highlightSearch: true,
      options: [
        { value: 'shanghai', label: 'Shanghai' },
        { value: 'hangzhou', label: 'Hangzhou' },
      ],
    })

    await wrapper.get('.s-select').trigger('click')
    await wrapper.get('.s-select__input').setValue('zhou')
    vi.runAllTimers()
    await nextTick()

    expect(wrapper.get('.s-select__option-highlight').text()).toBe('zhou')
    expect(wrapper.findAll('.s-select__option:not(.is-hidden)')).toHaveLength(1)
  })

  it('bulk-selects visible options and exposes footer counts', async () => {
    const wrapper = mountSelect(
      {
        modelValue: [],
        multiple: true,
        options: [
          { value: 'ada', label: 'Ada' },
          { value: 'grace', label: 'Grace' },
        ],
        selectionTools: ['all'],
      },
      {
        footer: (scope) =>
          h(
            'span',
            { class: 'counts' },
            `${scope.selectedCount}/${scope.filteredCount}/${scope.totalCount}`,
          ),
      },
    )
    await nextTick()

    expect(wrapper.get('.counts').text()).toBe('0/2/2')
    await wrapper.get('.s-select__selection-tool').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      ['ada', 'grace'],
    ])
  })

  it('replaces the text summary with the search field while open', async () => {
    const wrapper = mountSelect({
      modelValue: ['ada'],
      multiple: true,
      filterable: true,
      multipleDisplayMode: 'text',
      searchPlaceholder: 'Filter members',
      options: [{ value: 'ada', label: 'Ada Lovelace' }],
    })
    await nextTick()

    expect(wrapper.get('.s-select__selection-text').text()).toBe('Ada Lovelace')
    await wrapper.get('.s-select').trigger('mouseenter')
    await wrapper.get('.s-select').trigger('click')
    await nextTick()

    expect(wrapper.find('.s-select__selection-text').exists()).toBe(false)
    expect(
      wrapper.get('.s-select__input-filter').attributes('placeholder'),
    ).toBe('Filter members')
    expect(wrapper.get('.s-select__input').attributes('placeholder')).toBe(
      undefined,
    )
  })

  it('keeps the placeholder visible for an empty filterable multiple select', async () => {
    const wrapper = mountSelect({
      modelValue: [],
      multiple: true,
      filterable: true,
      placeholder: 'Choose members',
      options: [{ value: 'ada', label: 'Ada Lovelace' }],
    })
    await nextTick()

    const filterInput = wrapper.get('.s-select__input-filter')
    expect(filterInput.attributes('placeholder')).toBe('Choose members')
    expect(filterInput.classes()).not.toContain('is-idle')
  })

  it('uses the configured locale for built-in selection tools', async () => {
    const wrapper = mountSelect(
      {
        modelValue: [],
        multiple: true,
        options: [{ value: 'ada', label: 'Ada' }],
        selectionTools: ['all', 'invert', 'clear'],
      },
      {},
      zhCn,
    )
    await nextTick()

    expect(
      wrapper.findAll('.s-select__selection-tool').map((tool) => tool.text()),
    ).toEqual(['全选', '反选', '清空'])
  })

  it('only scrolls a virtual list for keyboard navigation, not mouse hover', async () => {
    const wrapper = mountSelect({
      modelValue: '',
      virtual: true,
      virtualConfig: { threshold: 1 },
      options: [
        { value: 'alpha', label: 'Alpha' },
        { value: 'beta', label: 'Beta' },
        { value: 'gamma', label: 'Gamma' },
      ],
    })
    await nextTick()

    await wrapper.findAll('.s-select__option')[1].trigger('mouseenter')
    await nextTick()
    expect(virtualScrollToIndex).not.toHaveBeenCalled()

    const input = wrapper.get('.s-select__input')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(virtualScrollToIndex).toHaveBeenCalledTimes(1)
  })

  it('keeps popup width under Select control during Popper repositioning', async () => {
    const auto = mountSelect({
      modelValue: '',
      options: [{ value: 'a', label: 'Option A' }],
    })
    vi.spyOn(
      auto.get('.s-select').element,
      'getBoundingClientRect',
    ).mockReturnValue({ width: 200.4 } as DOMRect)
    await auto.get('.s-select').trigger('mouseenter')
    await auto.get('.s-select').trigger('click')
    await nextTick()
    await nextTick()

    const autoPopper = auto.getComponent(PopperStub)
    expect(autoPopper.props('fit')).toBe(false)
    expect(
      (autoPopper.props('popperStyle') as Record<string, string>[])[1].width,
    ).toBe('200.4px')

    const explicit = mountSelect({
      modelValue: '',
      options: [{ value: 'a', label: 'Option A' }],
      popupConfig: { width: 260 },
    })
    const explicitPopper = explicit.getComponent(PopperStub)
    expect(explicitPopper.props('fit')).toBe(false)
    expect(
      (explicitPopper.props('popperStyle') as Record<string, string>[])[1]
        .width,
    ).toBe('260px')
  })
})
