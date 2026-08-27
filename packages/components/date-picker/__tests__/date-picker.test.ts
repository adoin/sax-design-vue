import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import dayjs, { type Dayjs } from 'dayjs'
import ConfigProvider from '../../config-provider/src/config-provider'
import DatePicker from '../src/date-picker.vue'

const InputStub = defineComponent({
  name: 'SInput',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    label: String,
    labelFloat: Boolean,
    color: String,
    size: String,
    suffixIcon: String,
  },
  emits: ['update:modelValue'],
  template: '<div class="input-stub" />',
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
    modelValue: Object,
    defaultDate: Object,
    rangeStart: Object,
    rangeEnd: Object,
  },
  emits: ['pick', 'panel-change'],
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
  it('passes floating label, color, and size to its input', () => {
    const wrapper = mountPicker({
      label: 'Appointment date',
      labelFloat: true,
      color: '#123456',
      size: 'large',
    })
    const input = wrapper.getComponent(InputStub)

    expect(input.props()).toMatchObject({
      label: 'Appointment date',
      labelFloat: true,
      color: '#123456',
      size: 'large',
      suffixIcon: 'cb:calendar',
    })
    expect(wrapper.get('.s-date-picker').attributes('style')).toContain(
      '--sax-color: 210deg 65.385% 20.392%',
    )
    expect(wrapper.getComponent(PopperStub).props('popperStyle')).toMatchObject(
      {
        '--sax-color': '210deg 65.385% 20.392%',
      },
    )
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
        suffixIcon: 'cb:calendar',
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
