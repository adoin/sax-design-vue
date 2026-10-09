import type { ProgressTexture } from './progress'

const tile = (width: number, height: number, body: string) => ({
  width,
  height,
  image: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`)}`,
})

/** Dense, soft microbubbles matching the reference image's 110 × 64 repeat. */
const microbubbles = () => {
  let seed = 47291
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
  const circles: string[] = []
  for (let index = 0; index < 270; index++) {
    const x = random() * 110
    const y = random() * 64
    const radius = 0.55 + 2.65 * random() ** 0.7
    const opacity = 0.3 + random() * 0.6
    for (const dx of [-110, 0, 110])
      for (const dy of [-64, 0, 64])
        if (
          x + dx + radius > 0 &&
          x + dx - radius < 110 &&
          y + dy + radius > 0 &&
          y + dy - radius < 64
        )
          circles.push(
            `<circle cx="${(x + dx).toFixed(2)}" cy="${(y + dy).toFixed(2)}" r="${radius.toFixed(2)}" opacity="${opacity.toFixed(2)}"/>`,
          )
  }
  return `<defs><radialGradient id="microbubble"><stop stop-color="white" stop-opacity=".98"/><stop offset=".42" stop-color="white" stop-opacity=".8"/><stop offset=".78" stop-color="white" stop-opacity=".35"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><g fill="url(#microbubble)">${circles.join('')}</g>`
}

/** SVG image resources are shared; sparkle owns an independent inline timeline. */
export const progressTextureAssets: Record<
  Exclude<ProgressTexture, 'default' | 'sparkle' | 'waves'>,
  ReturnType<typeof tile>
> = {
  bubbles: tile(110, 64, microbubbles()),
}
