import { revealWatermarkPixels } from './watermark-utils'

export interface WatermarkRevealOptions {
  /** Color-channel amplification, from 1 to 128. Default: 32. */
  gain?: number
}

/** Reveal a local screenshot's blind watermark as a PNG data URL. No upload. */
export async function revealWatermark(
  file: Blob,
  options: WatermarkRevealOptions = {},
): Promise<string> {
  if (typeof document === 'undefined')
    throw new Error('Watermark reveal requires a browser.')
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    if (
      !image.naturalWidth ||
      !image.naturalHeight ||
      image.naturalWidth * image.naturalHeight > 24000000
    ) {
      throw new Error('Watermark reveal supports images up to 24 megapixels.')
    }
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas is unavailable.')
    context.drawImage(image, 0, 0)
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
    pixels.data.set(revealWatermarkPixels(pixels.data, options.gain))
    context.putImageData(pixels, 0, 0)
    return canvas.toDataURL('image/png')
  } finally {
    URL.revokeObjectURL(url)
  }
}
