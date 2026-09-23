import { colorToHsl } from '@vuesax-alpha/utils'

const linearChannel = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4

/** Pick the higher-contrast black or white foreground for an opaque CSS color. */
export const readableDividerLabelColor = (background: string) => {
  const hsl = colorToHsl(background)
  if (!hsl) return undefined

  const hue = hsl.h / 30
  const saturation = hsl.s / 100
  const lightness = hsl.l / 100
  const chroma = saturation * Math.min(lightness, 1 - lightness)
  const channel = (offset: number) => {
    const key = (offset + hue) % 12
    return lightness - chroma * Math.max(-1, Math.min(key - 3, 9 - key, 1))
  }
  const luminance =
    0.2126 * linearChannel(channel(0)) +
    0.7152 * linearChannel(channel(8)) +
    0.0722 * linearChannel(channel(4))

  return luminance > 0.179 ? 'var(--sax-css-black)' : 'var(--sax-css-white)'
}
