import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Countdown from '../src/countdown.vue'
import type { CountdownFormatter } from '../src/countdown'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Countdown effects', () => {
  it.each([
    { duration: 125_000, format: 'ss', expected: '125' },
    { duration: 5_405_000, format: 'mm:ss', expected: '90:05' },
    {
      duration: 90_065_000,
      format: 'HH:mm:ss',
      expected: '25:01:05',
    },
    {
      duration: 90_065_000,
      format: 'DD:HH:mm:ss',
      expected: '01:01:01:05',
    },
  ])(
    'rolls omitted larger units into $format',
    ({ duration, format, expected }) => {
      vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
      const wrapper = mount(Countdown, {
        props: {
          value: 1_000_000 + duration,
          autoStart: false,
          format,
        },
      })

      expect(wrapper.text()).toBe(expected)
    },
  )

  it('supports custom speed and speed zero as a frozen state', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(1_000_000)
    const wrapper = mount(Countdown, {
      props: {
        value: 1_010_000,
        autoStart: true,
        format: 'ss',
        speed: 2,
      },
    })

    expect(wrapper.text()).toBe('10')
    vi.advanceTimersByTime(1_000)
    await nextTick()
    expect(wrapper.text()).toBe('08')

    await wrapper.setProps({ speed: 0 })
    const frozen = wrapper.text()
    vi.advanceTimersByTime(2_000)
    await nextTick()
    expect(wrapper.text()).toBe(frozen)
  })

  it('formats custom text without bypassing the digit effect', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    const formatter: CountdownFormatter = ({
      totalSeconds,
      minutes,
      seconds,
    }) => `${totalSeconds}s · ${minutes}m ${seconds}s`
    const wrapper = mount(Countdown, {
      props: {
        value: 1_065_000,
        autoStart: false,
        format: 'mm:ss',
        effect: 'flip',
        formatter,
      },
    })

    expect(wrapper.text()).toBe('65s · 1m 5s')
    expect(wrapper.findAll('.s-countdown__digit--flip')).toHaveLength(4)
    expect(wrapper.attributes('aria-label')).toBe('65s · 1m 5s')

    await wrapper.setProps({ value: 1_064_000 })
    await nextTick()

    expect(wrapper.attributes('aria-label')).toBe('64s · 1m 4s')
    expect(wrapper.find('.s-countdown__motion-frame--flip').exists()).toBe(true)

    for (const frame of wrapper.findAll('.s-countdown__motion-frame--flip')) {
      const animationEnd = new Event('animationend', { bubbles: true })
      Object.defineProperty(animationEnd, 'animationName', {
        value: 's-countdown-flip-bottom',
      })
      frame.element.dispatchEvent(animationEnd)
    }
    await nextTick()

    expect(wrapper.text()).toBe('64s · 1m 4s')
  })

  it('keeps the existing presentation as the default effect', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    const wrapper = mount(Countdown, {
      props: { value: 1_065_000, autoStart: false, format: 'mm:ss' },
    })

    expect(wrapper.classes()).toContain('s-countdown--effect-default')
    expect(wrapper.attributes('aria-label')).toBe('01:05')
    expect(wrapper.text()).toBe('01:05')
  })

  it.each(['flip', 'fade', 'particle', 'slide'] as const)(
    'renders the %s digit structure without animating separators',
    (effect) => {
      vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
      const wrapper = mount(Countdown, {
        props: {
          value: 1_065_000,
          autoStart: false,
          format: 'mm:ss',
          effect,
        },
      })

      expect(wrapper.classes()).toContain(`s-countdown--effect-${effect}`)
      expect(wrapper.findAll(`.s-countdown__digit--${effect}`)).toHaveLength(4)
      expect(wrapper.findAll('.s-countdown__separator')).toHaveLength(1)
    },
  )

  it('animates only a changed digit and keeps the full accessible value', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    const wrapper = mount(Countdown, {
      props: {
        value: 1_065_000,
        autoStart: false,
        format: 'mm:ss',
        effect: 'flip',
      },
    })

    await wrapper.setProps({ value: 1_064_000 })
    await nextTick()

    expect(wrapper.attributes('aria-label')).toBe('01:04')
    expect(wrapper.findAll('.s-countdown__digit.is-changing')).toHaveLength(1)
    expect(wrapper.find('.s-countdown__motion-frame--flip').exists()).toBe(true)
  })

  it('returns flip digits to one aligned value after the animation ends', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    const wrapper = mount(Countdown, {
      props: {
        value: 1_065_000,
        autoStart: false,
        format: 'mm:ss',
        effect: 'flip',
      },
    })

    await wrapper.setProps({ value: 1_064_000 })
    await nextTick()

    const frame = wrapper.find('.s-countdown__motion-frame--flip')
    const animationEnd = new Event('animationend', { bubbles: true })
    Object.defineProperty(animationEnd, 'animationName', {
      value: 's-countdown-flip-bottom',
    })
    frame.element.dispatchEvent(animationEnd)
    await nextTick()

    expect(wrapper.find('.s-countdown__motion-frame--flip').exists()).toBe(
      false,
    )
    expect(wrapper.findAll('.s-countdown__digit.is-changing')).toHaveLength(0)
    expect(wrapper.text()).toBe('01:04')
  })

  it('renders lightweight particles only while the value has changed', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    const wrapper = mount(Countdown, {
      props: {
        value: 1_065_000,
        autoStart: false,
        format: 'ss',
        effect: 'particle',
      },
    })

    expect(wrapper.find('.s-countdown__particle').exists()).toBe(false)
    await wrapper.setProps({ value: 1_064_000 })
    await nextTick()

    expect(wrapper.findAll('.s-countdown__particle')).toHaveLength(12)
  })
})
