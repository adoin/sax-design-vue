import { unref } from 'vue'
import {
  hexFullRE,
  hexShorthandRE,
  hslRE,
  leadingHashRE,
  rgbNumberRE,
  rgbRE,
  vuesaxColors,
} from '@vuesax-alpha/constants'
import { debugWarn } from './error'
import type { MaybeRef } from './typescript'
import type {
  ThemeConfig,
  ThemeState,
  ThemeStateScale,
  VuesaxColor,
} from '@vuesax-alpha/constants'

const CLASS_NAMESPACE = 's'
const CSS_VAR_NAMESPACE = 'sax'

export const getCssVariable = (el: HTMLElement, property: string) => {
  return getComputedStyle(el).getPropertyValue(property)
}

export const isColorDark = (color?: string | boolean): boolean => {
  if (color === undefined || color === false) return false
  return color === 'dark' || color === true
}

export const normalizeVsColor = (color: string): string =>
  color === 'warning' ? 'warn' : color

export const isVsColor = (color: string): boolean =>
  vuesaxColors.includes(normalizeVsColor(color) as VuesaxColor)

/**
 * #eee -> length hex shorthand, shorthand with alpha, classic, hex alpha
 */
export const isHexColor = (color: string) =>
  leadingHashRE.test(color) && [4, 7, 5, 9].includes(color.length)

export const isRgbColor = (color: string) => rgbRE.test(color)

export const isHslColor = (color: string) => hslRE.test(color)

export const isRGBNumbers = (color: string) => rgbNumberRE.test(color)

export const hexToRgb = (color: string) => {
  color = color.replace(
    hexShorthandRE,
    (_, r: string, g: string, b: string) => r + r + g + g + b + b,
  )
  const res = hexFullRE.exec(color)

  return res
    ? {
        r: Number.parseInt(res[1], 16),
        g: Number.parseInt(res[2], 16),
        b: Number.parseInt(res[3], 16),
      }
    : null
}

export type HslChannels = { h: number; s: number; l: number }

const roundChannel = (value: number) => Number(value.toFixed(3))

export const rgbToHsl = (r: number, g: number, b: number): HslChannels => {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  const lightness = (max + min) / 2
  let hue = 0

  if (delta) {
    if (max === red) hue = ((green - blue) / delta) % 6
    else if (max === green) hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4
    hue *= 60
  }

  if (hue < 0) hue += 360
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0

  return {
    h: roundChannel(hue),
    s: roundChannel(saturation * 100),
    l: roundChannel(lightness * 100),
  }
}

export const hexToHsl = (color: string) => {
  const rgb = hexToRgb(color)
  return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
}

const parseFunctionalChannels = (color: string) =>
  color
    .replace(/^[a-z]+\(/i, '')
    .replace(/\)$/, '')
    .split('/')[0]
    .trim()
    .split(/[\s,]+/)

export const parseHsl = (color: string): HslChannels | null => {
  const [hue, saturation, lightness] = parseFunctionalChannels(color)
  if (!hue || !saturation || !lightness) return null

  const h = Number.parseFloat(hue)
  const s = Number.parseFloat(saturation)
  const l = Number.parseFloat(lightness)
  if (![h, s, l].every(Number.isFinite)) return null

  return {
    h: roundChannel(((h % 360) + 360) % 360),
    s: roundChannel(Math.min(100, Math.max(0, s))),
    l: roundChannel(Math.min(100, Math.max(0, l))),
  }
}

export const colorToHsl = (color: string): HslChannels | null => {
  if (isHexColor(color)) return hexToHsl(color)
  if (isHslColor(color)) return parseHsl(color)
  if (isRgbColor(color)) {
    const [r, g, b] = parseFunctionalChannels(color).map(Number.parseFloat)
    return [r, g, b].every(Number.isFinite) ? rgbToHsl(r, g, b) : null
  }
  if (isRGBNumbers(color)) {
    const [r, g, b] = color.split(',').map(Number)
    return rgbToHsl(r, g, b)
  }
  return null
}

export const hslToChannels = ({ h, s, l }: HslChannels) =>
  `${roundChannel(h)}deg ${roundChannel(s)}% ${roundChannel(l)}%`

export const setColor = (
  colorName: string,
  color: string,
  el: HTMLElement,
  addClass?: boolean,
  namespace = CLASS_NAMESPACE,
) => {
  let newColor
  if (color == 'dark' && el) {
    if (addClass) {
      el.classList.add(`${namespace}-component-dark`)
    }
  }
  if (isRgbColor(color) || isHslColor(color) || isHexColor(color)) {
    const hsl = colorToHsl(color)
    if (!hsl) return
    newColor = hslToChannels(hsl)
    setCssVar(colorName, newColor, el)
    if (addClass) {
      el.classList.add(`${namespace}-change-color`)
    }
  } else if (isVsColor(color)) {
    const style = window.getComputedStyle(document.body)
    newColor = style.getPropertyValue(
      `--${CSS_VAR_NAMESPACE}-${normalizeVsColor(color)}`,
    )
    setCssVar(colorName, newColor, el)
    if (addClass) {
      el.classList.add(`${namespace}-change-color`)
    }
  } else if (isRGBNumbers(color)) {
    const hsl = colorToHsl(color)
    if (!hsl) return
    setCssVar(colorName, hslToChannels(hsl), el)
    if (addClass) {
      el.classList.add(`${namespace}-change-color`)
    }
  }
}

/**
 * Accept Sax Design color tokens, hex colors, and rgb colors.
 * @param color string
 */
export const acceptColor = (color: string) => {
  const isValid =
    isVsColor(color) ||
    isHexColor(color) ||
    isRgbColor(color) ||
    isHslColor(color)

  if (isValid) return true
  debugWarn(
    'Invalid Color',
    '[Sax Design] color must be a theme token, hex, rgb(a), or hsl(a) value',
  )
  return false
}

/**
 * Convert a Sax Design color token, hex, rgb, or hsl color to HSL channels.
 *
 * e.g 'rgb(25,91,255)' -> '222.783deg 100% 54.902%'
 */
export const getVsColor = (
  colorRef: MaybeRef<string | undefined>,
  namespace = CSS_VAR_NAMESPACE,
): string => {
  const color = unref(colorRef)
  if (!color) return ''

  const isRGB = rgbRE.test(color)
  const isHSL = hslRE.test(color)
  const isRGBNumbers = rgbNumberRE.test(color)
  const isHEX = leadingHashRE.test(color)

  let newColor = ''

  if (isRGB || isHSL || isHEX || isRGBNumbers) {
    const hsl = colorToHsl(color)
    newColor = hsl ? hslToChannels(hsl) : ''
  } else if (isVsColor(color as VuesaxColor)) {
    newColor = `var(--${namespace}-${normalizeVsColor(color)})`
  }
  return newColor
}

const stateKeys = ['hover', 'active', 'subtle'] as const

const pushStateVars = (
  variables: Record<string, string>,
  prefix: string,
  states?: ThemeStateScale,
) => {
  if (!states) return
  for (const state of stateKeys) {
    const value = states[state] as ThemeState | undefined
    if (value?.saturation !== undefined) {
      variables[`--sax-theme-${prefix}${state}-s`] = `${value.saturation}%`
    }
    if (value?.lightness !== undefined) {
      variables[`--sax-theme-${prefix}${state}-l`] = `${value.lightness}%`
    }
  }
}

export const createThemeCssVars = (theme: ThemeConfig) => {
  const variables: Record<string, string> = {}
  const primary = theme.primary ? colorToHsl(theme.primary) : null
  const explicitDark = theme.darkPrimary ? colorToHsl(theme.darkPrimary) : null

  if (primary) {
    variables['--sax-theme-primary-h'] = `${primary.h}deg`
    variables['--sax-theme-primary-s'] = `${primary.s}%`
    variables['--sax-theme-primary-l'] = `${primary.l}%`

    const dark = explicitDark ?? {
      h: primary.h,
      s: roundChannel(Math.max(0, primary.s - 8)),
      l: roundChannel(Math.min(82, primary.l + 15)),
    }
    variables['--sax-theme-primary-dark-h'] = `${dark.h}deg`
    variables['--sax-theme-primary-dark-s'] = `${dark.s}%`
    variables['--sax-theme-primary-dark-l'] = `${dark.l}%`
  }

  pushStateVars(variables, 'state-', theme.states)
  pushStateVars(variables, 'dark-state-', theme.darkStates)
  return variables
}

export const applyThemeConfig = (
  theme: ThemeConfig,
  el: HTMLElement = document.documentElement,
) => {
  const variables = createThemeCssVars(theme)
  const previous = new Map<string, { value: string; priority: string }>()

  for (const [name, value] of Object.entries(variables)) {
    previous.set(name, {
      value: el.style.getPropertyValue(name),
      priority: el.style.getPropertyPriority(name),
    })
    el.style.setProperty(name, value)
  }

  return () => {
    for (const [name, old] of previous) {
      if (old.value) el.style.setProperty(name, old.value, old.priority)
      else el.style.removeProperty(name)
    }
  }
}

/**
 * @param propertyName The name of the property
 * @param value The value of the property
 * @param el The element to set the property. Default document.documentElement
 * @param namespace The CSS variable namespace. Default 'sax'
 */
export const setCssVar = (
  propertyName: string,
  value: string,
  el?: HTMLElement,
  namespace = CSS_VAR_NAMESPACE,
) => {
  if (!el && document?.documentElement) {
    document.documentElement.style.setProperty(
      `--${namespace}-${propertyName}`,
      value,
    )
  } else {
    if (el?.nodeName !== '#comment') {
      el?.style.setProperty(`--${namespace}-${propertyName}`, value)
    }
  }
}
