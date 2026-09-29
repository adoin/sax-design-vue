import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useGlobalConfig } from '@vuesax-alpha/hooks'
import dayjs, { type Dayjs } from 'dayjs'
import { getCalendarWeek } from '@vuesax-alpha/utils'
import ConfigProvider from '../../config-provider/src/config-provider'
import DatePicker from '../src/date-picker.vue'
import DatePanel from '../src/date-panel.vue'
import DatePickerTags from '../src/date-picker-tags.vue'
import DatePickerAction from '../src/date-picker-action.vue'
import Calendar from '../../calendar/src/calendar.vue'
import { parseWeekValue, withWeekRules } from '../src/utils'

const globalConfig = useGlobalConfig()
const originalConfig = globalConfig.value
beforeEach(() => {
  globalConfig.value = {}
})
afterEach(() => {
  globalConfig.value = originalConfig
})

const InputStub = defineComponent({
  name: 'SInput',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    loading: Boolean,
    label: String,
    labelFloat: Boolean,
    color: String,
    size: String,
    shape: String,
    suffixIcon: String,
  },
  emits: ['update:modelValue'],
  template:
    '<div class="input-stub"><slot name="prefix" /><slot name="suffix" /></div>',
})

const PopperStub = defineComponent({
  name: 'SPopper',
  inheritAttrs: false,
  props: { popperStyle: Object, visible: Boolean },
  emits: ['update:visible'],
  template: '<div class="popper-stub"><slot /><slot name="content" /></div>',
})

const DatePanelStub = defineComponent({
  name: 'SDatePanel',
  props: {
    color: String,
    modelValue: Object,
    defaultDate: Object,
    rangeStart: Object,
    rangeEnd: Object,
    rangeHover: Object,
  },
  emits: ['pick', 'hover', 'panel-change'],
  template: '<div class="date-panel-stub" />',
})

const ButtonStub = defineComponent({
  name: 'SButton',
  emits: ['click'],
  template:
    '<button class="button-stub" type="button" @click="$emit(\'click\', $event)"><slot /></button>',
})

const mountPicker = (props = {}) =>
  mount(DatePicker, {
    props,
    global: {
      stubs: {
        SInput: InputStub,
        SPopper: PopperStub,
        SDatePanel: DatePanelStub,
        STimePanel: true,
        SButton: ButtonStub,
      },
    },
  })

describe('DatePicker input presentation', () => {
  it('forwards loading to both range inputs and ignores date selection while loading', async () => {
    const wrapper = mountPicker({
      type: 'daterange',
      loading: true,
      modelValue: ['2026-09-01', '2026-09-10'],
    })
    expect(
      wrapper
        .findAllComponents(InputStub)
        .map((input) => input.props('loading')),
    ).toEqual([true, true])
    expect(wrapper.findComponent(DatePickerAction).exists()).toBe(false)
    wrapper.getComponent(DatePanelStub).vm.$emit('pick', dayjs('2026-10-10'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.setProps({ loading: false })
    expect(wrapper.getComponent(InputStub).props('modelValue')).toBe(
      '2026-09-01',
    )
    wrapper.unmount()
  })
  it('removes one multiple date and clears through the single suffix action', async () => {
    const wrapper = mountPicker({
      multiple: true,
      clearable: true,
      valueFormat: 'YYYY-MM-DD',
      modelValue: ['2026-09-17', '2026-09-19'],
    })
    wrapper.getComponent(DatePickerTags).vm.$emit('remove', 0)
    await wrapper.vm.$nextTick()
    await wrapper.get('.s-date-picker').trigger('mouseenter')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      '2026-09-19',
    ])
    expect(wrapper.getComponent(DatePickerAction).props('clear')).toBe(true)
    wrapper.getComponent(DatePickerAction).vm.$emit('clear')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBeNull()
    expect(wrapper.getComponent(DatePickerAction).props('clear')).toBe(false)
    wrapper.unmount()
  })

  it('applies global week rules to Calendar and preserves a local override', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { firstDayOfWeek: 0, firstWeekContainsDate: 1 },
      slots: {
        default: () =>
          h('div', [
            h(Calendar, { date: '2021-01-01', showWeekNumber: true }),
            h(Calendar, {
              date: '2021-01-01',
              firstDayOfWeek: 1,
              showWeekNumber: true,
            }),
          ]),
      },
    })
    const calendars = wrapper.findAllComponents(Calendar)
    const firstWeekday = (index: number) =>
      calendars[index].findAll('.s-calendar__weekday')[1].text()
    expect(firstWeekday(0)).not.toBe(firstWeekday(1))
    await wrapper.setProps({ firstDayOfWeek: 1, firstWeekContainsDate: 4 })
    expect(firstWeekday(0)).toBe(firstWeekday(1))
    expect(calendars[0].get('.s-calendar__week-number').text()).toBe('53')
    wrapper.unmount()
  })

  it('keeps configured week-year formatting in a timezone and round-trips week values', async () => {
    const wrapper = mountPicker({
      type: 'week',
      timezone: 'Asia/Shanghai',
      valueFormat: 'gggg-[W]ww',
      modelValue: '2020-W53',
    })
    const panel = wrapper.getComponent(DatePanelStub)
    expect((panel.props('modelValue') as Dayjs).format('YYYY-MM-DD')).toBe(
      '2020-12-28',
    )
    panel.vm.$emit('pick', dayjs('2021-01-01'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('2020-W53')
    wrapper.unmount()
  })

  it('blocks a week with any disabled day and navigates enabled rows with arrow keys', async () => {
    const wrapper = mount(DatePanel, {
      attachTo: document.body,
      props: {
        pickerType: 'week',
        defaultDate: dayjs('2026-09-01'),
        disabledDate: (date: Date) => date.getDate() === 9,
      },
    })
    const rows = wrapper.findAll<HTMLButtonElement>('.s-date-panel__week-row')
    expect(rows[1].element.disabled).toBe(true)
    await rows[1].trigger('click')
    expect(wrapper.emitted('pick')).toBeUndefined()
    rows[0].element.focus()
    await rows[0].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(rows[2].element)
    wrapper.unmount()
  })

  it('uses consistent cross-year week numbering without changing the global locale', () => {
    const locale = dayjs.locale()
    for (const firstDay of [0, 1, 6]) {
      for (const firstWeekDate of [1, 4, 7]) {
        for (const text of [
          '2020-12-27',
          '2020-12-31',
          '2021-01-01',
          '2021-01-04',
        ]) {
          const date = dayjs(text)
          const info = getCalendarWeek(date.toDate(), firstDay, firstWeekDate)
          const formatted = withWeekRules(date, firstDay, firstWeekDate).format(
            'gggg-[W]ww',
          )
          expect(formatted).toBe(
            `${info.year}-W${String(info.week).padStart(2, '0')}`,
          )
          expect(
            parseWeekValue(formatted, firstDay, firstWeekDate)?.day(),
          ).toBe(firstDay)
        }
      }
    }
    expect(dayjs.locale()).toBe(locale)
    expect(parseWeekValue('2021-W53', 1, 4)).toBeNull()
  })

  it('selects whole weeks and preserves selectDay through the picker', async () => {
    const wrapper = mountPicker({
      type: 'week',
      startDay: 1,
      selectDay: 3,
      valueFormat: 'YYYY-MM-DD',
    })
    wrapper.getComponent(DatePanelStub).vm.$emit('pick', dayjs('2026-09-23'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('2026-09-23')
    wrapper.unmount()
  })

  it('renders a current week row, selects it as one unit and responds to global week changes', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { firstDayOfWeek: 1 },
      slots: {
        default: () =>
          h(DatePanel, {
            pickerType: 'week',
            defaultDate: dayjs('2026-09-01'),
            currentDate: dayjs('2026-09-23'),
          }),
      },
    })
    const panel = wrapper.getComponent(DatePanel)
    const current = panel.get('.s-date-panel__week-row.is-today')
    expect(current.findAll('.s-date-panel__week-day')).toHaveLength(7)
    expect(current.attributes('aria-label')).toBe('2026-09-21 – 2026-09-27')
    await current.trigger('click')
    expect(
      (panel.emitted('pick')?.[0]?.[0] as Dayjs).format('YYYY-MM-DD'),
    ).toBe('2026-09-21')
    await wrapper.setProps({ firstDayOfWeek: 0 })
    expect(
      panel.get('.s-date-panel__week-row.is-today').attributes('aria-label'),
    ).toBe('2026-09-20 – 2026-09-26')
    wrapper.unmount()
  })

  it.each(['date', 'month', 'quarter', 'year'] as const)(
    'marks the current %s independently of selection',
    (pickerType) => {
      const wrapper = mount(DatePanel, {
        props: {
          pickerType,
          defaultDate: dayjs('2026-09-01'),
          currentDate: dayjs('2026-09-23'),
        },
      })
      expect(wrapper.findAll('.is-today')).toHaveLength(1)
      expect(wrapper.get('.is-today').classes()).not.toContain('is-selected')
      wrapper.unmount()
    },
  )

  it('shares a temporary range preview across panels without committing it', async () => {
    const wrapper = mountPicker({ type: 'daterange' })
    const panels = wrapper.findAllComponents(DatePanelStub)
    panels[0].vm.$emit('pick', dayjs('2026-09-18'))
    await wrapper.vm.$nextTick()
    panels[1].vm.$emit('hover', dayjs('2026-10-13'))
    await wrapper.vm.$nextTick()
    expect((panels[0].props('rangeHover') as Dayjs).format('YYYY-MM-DD')).toBe(
      '2026-10-13',
    )
    expect(panels[0].props('rangeEnd')).toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    panels[1].vm.$emit('hover', null)
    await wrapper.vm.$nextTick()
    expect(panels[0].props('rangeHover')).toBeNull()
    panels[1].vm.$emit('pick', dayjs('2026-10-13'))
    await wrapper.vm.$nextTick()
    panels[0].vm.$emit('hover', dayjs('2026-09-05'))
    await wrapper.vm.$nextTick()
    expect(panels[0].props('rangeHover')).toBeNull()
    wrapper.unmount()
  })

  it('previews backwards ranges and clears a disabled hover target', async () => {
    const wrapper = mount(DatePanel, {
      props: {
        pickerType: 'date',
        defaultDate: dayjs('2026-09-01'),
        rangeStart: dayjs('2026-09-18'),
        rangeHover: dayjs('2026-09-12'),
        disabledDate: (date: Date) => date.getDate() === 11,
      },
    })
    expect(wrapper.findAll('.is-range-preview')).toHaveLength(7)
    expect(wrapper.get('.is-range-start').text()).toBe('12')
    expect(wrapper.get('.is-range-end').text()).toBe('18')
    const disabled = wrapper
      .findAll('.s-date-panel__cell')
      .find((cell) => cell.text() === '11')!
    await wrapper.get('.is-range-start').trigger('mouseleave')
    await disabled.trigger('mouseenter')
    expect(wrapper.emitted('hover')?.at(-1)).toEqual([null])
    await wrapper.setProps({ rangeHover: null })
    expect(wrapper.findAll('.is-range-preview')).toHaveLength(0)
    wrapper.unmount()
  })

  it('passes floating label, color, and size to its input', () => {
    const wrapper = mountPicker({
      label: 'Appointment date',
      labelFloat: true,
      color: '#123456',
      size: 'large',
      shape: 'square',
    })
    const input = wrapper.getComponent(InputStub)

    expect(input.props()).toMatchObject({
      label: 'Appointment date',
      labelFloat: true,
      color: '#123456',
      size: 'large',
      shape: 'square',
      suffixIcon: undefined,
    })
    expect(wrapper.get('.s-date-picker').attributes('style')).toContain(
      '--sax-color: 210deg 65.385% 20.392%',
    )
    expect(wrapper.get('.s-date-picker').classes()).toContain('is-square')
    expect(wrapper.getComponent(PopperStub).props('popperStyle')).toMatchObject(
      {
        '--sax-color': '210deg 65.385% 20.392%',
      },
    )
    expect(wrapper.getComponent(DatePanelStub).props('color')).toBe('#123456')
  })

  it('uses independent floating labels for both range inputs', () => {
    const wrapper = mountPicker({
      type: 'daterange',
      labelFloat: true,
      startLabel: 'Start date',
      endLabel: 'End date',
      color: 'success',
      size: 'small',
    })
    const inputs = wrapper.findAllComponents(InputStub)

    expect(inputs).toHaveLength(2)
    expect(inputs.map((input) => input.props('label'))).toEqual([
      'Start date',
      'End date',
    ])
    for (const input of inputs) {
      expect(input.props()).toMatchObject({
        labelFloat: true,
        color: 'success',
        size: 'small',
        suffixIcon: undefined,
      })
    }
  })

  it('uses the primary theme color when no local color is provided', () => {
    const wrapper = mountPicker()

    expect(wrapper.get('.s-date-picker').attributes('style')).toContain(
      '--sax-color: var(--sax-primary)',
    )
    expect(wrapper.getComponent(PopperStub).props('popperStyle')).toMatchObject(
      {
        '--sax-color': 'var(--sax-primary)',
      },
    )
  })

  it('inherits autoApplyNow and commits the current datetime', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { autoApplyNow: true },
      slots: {
        default: () =>
          h(DatePicker, {
            type: 'datetime',
            timezone: 'Asia/Shanghai',
            valueFormat: 'timestamp',
          }),
      },
      global: {
        stubs: {
          SInput: InputStub,
          SPopper: PopperStub,
          SDatePanel: DatePanelStub,
          STimePanel: true,
          SButton: ButtonStub,
        },
      },
    })
    const picker = wrapper.getComponent(DatePicker)
    const popper = wrapper.getComponent(PopperStub)

    popper.vm.$emit('update:visible', true)
    await wrapper.vm.$nextTick()
    const nowButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Now')
    expect(nowButton).toBeDefined()
    await nowButton!.trigger('click')

    expect(picker.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(
      expect.any(Number),
    )
    expect(popper.props('visible')).toBe(false)
  })

  it('renders absolute values and emits wall time in the configured timezone', async () => {
    const instant = Date.UTC(2026, 7, 5, 6, 0, 22)
    const wrapper = mountPicker({
      type: 'datetime',
      modelValue: instant,
      timezone: 'Asia/Shanghai',
    })

    expect(wrapper.getComponent(InputStub).props('modelValue')).toBe(
      '2026-08-05 14:00:22',
    )

    await wrapper.setProps({
      modelValue: null,
      valueFormat: 'timestamp',
      timezone: 'America/New_York',
    })
    wrapper
      .getComponent(InputStub)
      .vm.$emit('update:modelValue', '2026-08-05 14:00:22')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(
      Date.UTC(2026, 7, 5, 18, 0, 22),
    )
  })

  it('opens a selected range on adjacent months', () => {
    const wrapper = mountPicker({
      type: 'daterange',
      modelValue: ['2026-07-01', '2026-07-22'],
    })
    const panels = wrapper.findAllComponents(DatePanelStub)

    expect(panels).toHaveLength(2)
    expect((panels[0].props('modelValue') as Dayjs).format('YYYY-MM')).toBe(
      '2026-07',
    )
    expect((panels[1].props('modelValue') as Dayjs).format('YYYY-MM')).toBe(
      '2026-08',
    )
  })

  it('opens an empty range on the current and following months', () => {
    const wrapper = mountPicker({ type: 'daterange' })
    const panels = wrapper.findAllComponents(DatePanelStub)
    const currentMonth = dayjs().format('YYYY-MM')
    const followingMonth = dayjs().add(1, 'month').format('YYYY-MM')

    expect((panels[0].props('defaultDate') as Dayjs).format('YYYY-MM')).toBe(
      currentMonth,
    )
    expect((panels[1].props('modelValue') as Dayjs).format('YYYY-MM')).toBe(
      followingMonth,
    )
  })

  it('keeps a picked range as a draft until confirmation', async () => {
    const wrapper = mountPicker({
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
    })
    const panels = wrapper.findAllComponents(DatePanelStub)

    panels[0].vm.$emit('pick', dayjs('2026-08-05'))
    await wrapper.vm.$nextTick()
    wrapper
      .findAllComponents(DatePanelStub)[1]
      .vm.$emit('pick', dayjs('2026-09-06'))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(
      wrapper
        .findAllComponents(InputStub)
        .map((input) => input.props('modelValue')),
    ).toEqual(['2026-08-05', '2026-09-06'])

    const footerButtons = wrapper.findAllComponents(ButtonStub)
    expect(footerButtons).toHaveLength(3)
    footerButtons.at(-1)!.vm.$emit('click', new MouseEvent('click'))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      '2026-08-05',
      '2026-09-06',
    ])
  })
})

describe('DatePanel theme color', () => {
  it('uses the primary theme color when rendered standalone', () => {
    const wrapper = mount(DatePanel, {
      props: {
        pickerType: 'date',
        modelValue: dayjs('2026-08-18'),
      },
    })

    expect(wrapper.attributes('style')).toContain(
      '--sax-color: var(--sax-primary)',
    )
  })

  it('supports an explicit custom theme color', () => {
    const wrapper = mount(DatePanel, {
      props: {
        pickerType: 'date',
        color: '#123456',
        modelValue: dayjs('2026-08-18'),
      },
    })

    expect(wrapper.attributes('style')).toContain(
      '--sax-color: 210deg 65.385% 20.392%',
    )
  })
})
