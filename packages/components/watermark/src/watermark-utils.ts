const xmlEntities: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
}
const escapeXml = (value: string) =>
  value.replace(/[<>&"']/g, (char) => xmlEntities[char])

export const watermarkNumber = (
  value: number,
  fallback: number,
  min: number,
  max: number,
) => (Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback)

/** A repeating alpha mask, shared by visible and blind watermark layers. */
export function createWatermarkMask(
  content: string,
  fontSize: number,
  gap: number,
  rotate: number,
) {
  const size = watermarkNumber(fontSize, 13, 8, 96)
  const spacing = watermarkNumber(gap, 96, 0, 1000)
  const angle = watermarkNumber(rotate, -18, -360, 360)
  const lines = content.split('\n')
  const textWidth =
    Math.max(
      1,
      ...lines.map((line) =>
        Array.from(line).reduce(
          (width, char) =>
            width + (char.charCodeAt(0) > 255 ? size : size * 0.7),
          0,
        ),
      ),
    ) +
    size * 2
  const textHeight = lines.length * size * 1.5 + size
  const radians = (angle * Math.PI) / 180
  const width = Math.ceil(
    Math.abs(textWidth * Math.cos(radians)) +
      Math.abs(textHeight * Math.sin(radians)) +
      spacing,
  )
  const height = Math.ceil(
    Math.abs(textWidth * Math.sin(radians)) +
      Math.abs(textHeight * Math.cos(radians)) +
      spacing,
  )
  const text = lines
    .map(
      (line, index) =>
        `<text x="0" y="${(index - (lines.length - 1) / 2) * size * 1.5}">${escapeXml(line)}</text>`,
    )
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><g transform="translate(${width / 2} ${height / 2}) rotate(${angle})" font-family="sans-serif" font-size="${size}" text-anchor="middle" dominant-baseline="central" fill="white">${text}</g></svg>`
  return {
    image: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    size: `${width}px ${height}px`,
  }
}

/** Amplify the green/magenta difference without changing the source pixels. */
export function revealWatermarkPixels(source: Uint8ClampedArray, gain = 32) {
  const amplification = watermarkNumber(gain, 32, 1, 128)
  const result = new Uint8ClampedArray(source.length)
  for (let i = 0; i < source.length; i += 4) {
    const value =
      128 + (source[i + 1] - (source[i] + source[i + 2]) / 2) * amplification
    result[i] = result[i + 1] = result[i + 2] = value
    result[i + 3] = source[i + 3]
  }
  return result
}
