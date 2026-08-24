import { describe, expect, it } from 'vitest'
import {
  applyThemeConfig,
  colorToHsl,
  createThemeCssVars,
  getVsColor,
} from '..'

describe('HSL theme colors', () => {
  it('normalizes supported colors to HSL channels', () => {
    expect(colorToHsl('#195bff')).toEqual({
      h: 222.783,
      s: 100,
      l: 54.902,
    })
    expect(getVsColor('rgb(25, 91, 255)')).toBe('222.783deg 100% 54.902%')
    expect(getVsColor('hsl(222 100% 55%)')).toBe('222deg 100% 55%')
  })

  it('keeps the primary hue while deriving a dark primary', () => {
    const variables = createThemeCssVars({ primary: '#4f46e5' })

    expect(variables['--sax-theme-primary-h']).toBe('243.396deg')
    expect(variables['--sax-theme-primary-dark-h']).toBe('243.396deg')
    expect(variables['--sax-theme-primary-dark-s']).toBe('67.355%')
    expect(variables['--sax-theme-primary-dark-l']).toBe('73.627%')
  })

  it('exposes light and dark state offsets', () => {
    const variables = createThemeCssVars({
      states: { hover: { saturation: -3, lightness: -6 } },
      darkStates: { active: { lightness: 10 } },
    })

    expect(variables['--sax-theme-state-hover-s']).toBe('-3%')
    expect(variables['--sax-theme-state-hover-l']).toBe('-6%')
    expect(variables['--sax-theme-dark-state-active-l']).toBe('10%')
  })

  it('restores inline variables after a theme is removed', () => {
    const element = document.createElement('div')
    element.style.setProperty('--sax-theme-primary-h', '120deg')

    const restore = applyThemeConfig({ primary: '#4f46e5' }, element)
    expect(element.style.getPropertyValue('--sax-theme-primary-h')).toBe(
      '243.396deg',
    )

    restore()
    expect(element.style.getPropertyValue('--sax-theme-primary-h')).toBe(
      '120deg',
    )
  })
})
