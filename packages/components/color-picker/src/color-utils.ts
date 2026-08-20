export interface RgbColor {
  red: number
  green: number
  blue: number
  alpha: number
}

export interface HslColor {
  hue: number
  saturation: number
  lightness: number
  alpha: number
}

export interface HsvColor {
  hue: number
  saturation: number
  value: number
  alpha: number
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl'

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const normalizeHue = (value: number) => ((value % 360) + 360) % 360
const roundChannel = (value: number) => Math.round(clamp(value, 0, 255))

const parseAlpha = (value: string | undefined) => {
  if (value === undefined) return 1
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? clamp(parsed, 0, 1) : undefined
}

export const hslToRgb = (color: HslColor): RgbColor => {
  const hue = normalizeHue(color.hue) / 360
  const saturation = clamp(color.saturation, 0, 100) / 100
  const lightness = clamp(color.lightness, 0, 100) / 100
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const section = hue * 6
  const intermediate = chroma * (1 - Math.abs((section % 2) - 1))
  let red = 0
  let green = 0
  let blue = 0

  if (section < 1) [red, green] = [chroma, intermediate]
  else if (section < 2) [red, green] = [intermediate, chroma]
  else if (section < 3) [green, blue] = [chroma, intermediate]
  else if (section < 4) [green, blue] = [intermediate, chroma]
  else if (section < 5) [red, blue] = [intermediate, chroma]
  else [red, blue] = [chroma, intermediate]

  const match = lightness - chroma / 2
  return {
    red: roundChannel((red + match) * 255),
    green: roundChannel((green + match) * 255),
    blue: roundChannel((blue + match) * 255),
    alpha: clamp(color.alpha, 0, 1),
  }
}

export const rgbToHsl = (color: RgbColor): HslColor => {
  const red = clamp(color.red, 0, 255) / 255
  const green = clamp(color.green, 0, 255) / 255
  const blue = clamp(color.blue, 0, 255) / 255
  const maximum = Math.max(red, green, blue)
  const minimum = Math.min(red, green, blue)
  const delta = maximum - minimum
  const lightness = (maximum + minimum) / 2
  let hue = 0

  if (delta) {
    if (maximum === red) hue = ((green - blue) / delta) % 6
    else if (maximum === green) hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4
    hue *= 60
  }

  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0

  return {
    hue: normalizeHue(hue),
    saturation: saturation * 100,
    lightness: lightness * 100,
    alpha: clamp(color.alpha, 0, 1),
  }
}

export const rgbToHsv = (color: RgbColor): HsvColor => {
  const red = clamp(color.red, 0, 255) / 255
  const green = clamp(color.green, 0, 255) / 255
  const blue = clamp(color.blue, 0, 255) / 255
  const maximum = Math.max(red, green, blue)
  const minimum = Math.min(red, green, blue)
  const delta = maximum - minimum
  let hue = 0

  if (delta) {
    if (maximum === red) hue = ((green - blue) / delta) % 6
    else if (maximum === green) hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4
    hue *= 60
  }

  return {
    hue: normalizeHue(hue),
    saturation: maximum ? (delta / maximum) * 100 : 0,
    value: maximum * 100,
    alpha: clamp(color.alpha, 0, 1),
  }
}

export const hsvToRgb = (color: HsvColor): RgbColor => {
  const hue = normalizeHue(color.hue)
  const saturation = clamp(color.saturation, 0, 100) / 100
  const value = clamp(color.value, 0, 100) / 100
  const chroma = value * saturation
  const section = hue / 60
  const intermediate = chroma * (1 - Math.abs((section % 2) - 1))
  let red = 0
  let green = 0
  let blue = 0

  if (section < 1) [red, green] = [chroma, intermediate]
  else if (section < 2) [red, green] = [intermediate, chroma]
  else if (section < 3) [green, blue] = [chroma, intermediate]
  else if (section < 4) [green, blue] = [intermediate, chroma]
  else if (section < 5) [red, blue] = [chroma, intermediate]
  else [red, blue] = [chroma, intermediate]

  const match = value - chroma
  return {
    red: roundChannel((red + match) * 255),
    green: roundChannel((green + match) * 255),
    blue: roundChannel((blue + match) * 255),
    alpha: clamp(color.alpha, 0, 1),
  }
}

export const parseColor = (value: string): RgbColor | undefined => {
  const trimmed = value.trim()
  const hex = trimmed.replace(/^#/, '')

  if (/^[\da-f]{3,4}$/i.test(hex)) {
    const [red, green, blue, alpha = 'f'] = hex
    return {
      red: Number.parseInt(red + red, 16),
      green: Number.parseInt(green + green, 16),
      blue: Number.parseInt(blue + blue, 16),
      alpha: Number.parseInt(alpha + alpha, 16) / 255,
    }
  }

  if (/^[\da-f]{6}([\da-f]{2})?$/i.test(hex)) {
    return {
      red: Number.parseInt(hex.slice(0, 2), 16),
      green: Number.parseInt(hex.slice(2, 4), 16),
      blue: Number.parseInt(hex.slice(4, 6), 16),
      alpha: hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1,
    }
  }

  const rgbMatch = trimmed.match(/^rgba?\(([^)]+)\)$/i)
  if (rgbMatch) {
    const values = rgbMatch[1].split(',').map((part) => part.trim())
    const channels = values.slice(0, 3).map(Number)
    const alpha = parseAlpha(values[3])
    if (
      channels.length === 3 &&
      channels.every(Number.isFinite) &&
      alpha !== undefined
    ) {
      return {
        red: roundChannel(channels[0]),
        green: roundChannel(channels[1]),
        blue: roundChannel(channels[2]),
        alpha,
      }
    }
  }

  const hslMatch = trimmed.match(/^hsla?\(([^)]+)\)$/i)
  if (hslMatch) {
    const values = hslMatch[1].split(',').map((part) => part.trim())
    const hue = Number.parseFloat(values[0])
    const saturation = Number.parseFloat(values[1])
    const lightness = Number.parseFloat(values[2])
    const alpha = parseAlpha(values[3])
    if (
      Number.isFinite(hue) &&
      Number.isFinite(saturation) &&
      Number.isFinite(lightness) &&
      alpha !== undefined
    ) {
      return hslToRgb({ hue, saturation, lightness, alpha })
    }
  }

  return undefined
}

const toHexChannel = (value: number) =>
  roundChannel(value).toString(16).padStart(2, '0').toUpperCase()

export const formatColor = (
  color: RgbColor,
  format: ColorFormat,
  showAlpha = false,
) => {
  const alpha = clamp(color.alpha, 0, 1)

  if (format === 'rgb') {
    const channels = `${roundChannel(color.red)}, ${roundChannel(color.green)}, ${roundChannel(color.blue)}`
    return showAlpha
      ? `rgba(${channels}, ${Number(alpha.toFixed(2))})`
      : `rgb(${channels})`
  }

  if (format === 'hsl') {
    const hsl = rgbToHsl(color)
    const channels = `${Math.round(hsl.hue)}, ${Math.round(hsl.saturation)}%, ${Math.round(hsl.lightness)}%`
    return showAlpha
      ? `hsla(${channels}, ${Number(alpha.toFixed(2))})`
      : `hsl(${channels})`
  }

  const hex = `#${toHexChannel(color.red)}${toHexChannel(color.green)}${toHexChannel(color.blue)}`
  return showAlpha && alpha < 1 ? `${hex}${toHexChannel(alpha * 255)}` : hex
}

export const toCssColor = (color: RgbColor) =>
  `rgba(${roundChannel(color.red)}, ${roundChannel(color.green)}, ${roundChannel(color.blue)}, ${clamp(color.alpha, 0, 1)})`
