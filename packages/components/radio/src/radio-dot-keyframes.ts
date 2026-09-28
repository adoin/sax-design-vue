export interface RadioDotPoint {
  x: number
  y: number
}

/** Each intermediate point is a visual landing, never a model update. */
export function radioDotKeyframes(
  points: RadioDotPoint[],
  fill: string,
  flight: string,
  horizontal: boolean,
): Keyframe[] {
  const hops = points.length - 1
  if (hops < 1) return []
  const frames: Keyframe[] = [
    {
      offset: 0,
      transform: `translate(${points[0].x}px, ${points[0].y}px) scale(1)`,
      fill,
    },
  ]
  for (let hop = 0; hop < hops; hop++) {
    const from = points[hop]
    const to = points[hop + 1]
    const distance = Math.hypot(to.x - from.x, to.y - from.y)
    const lift = horizontal ? Math.min(18, Math.max(8, distance * 0.2)) : 0
    for (let step = 1; step <= 8; step++) {
      const t = step / 8
      const x = from.x + (to.x - from.x) * t
      const y = from.y + (to.y - from.y) * t - Math.sin(Math.PI * t) * lift
      const landing = step === 8
      const final = landing && hop === hops - 1
      frames.push({
        offset: (hop + t) / hops,
        transform: final
          ? 'translate(0, 0) scale(1)'
          : `translate(${x}px, ${landing ? to.y : y}px) scale(${landing ? 0.88 : 1 + Math.sin(Math.PI * t) * 0.12})`,
        fill: final ? fill : flight,
      })
    }
  }
  return frames
}
