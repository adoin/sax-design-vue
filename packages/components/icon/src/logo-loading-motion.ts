import type { LogoLoadingPhase } from './logo-loading'

interface Point {
  x: number
  y: number
}

interface Lookup {
  length: number
  at: (distance: number) => Point
}

interface Strand {
  source: Lookup
  angle: number
  end: Point
  controls: [Point, Point]
  exit: number
  bridge: Lookup
  join: number
  returnPath: Lookup
  accent: number
}

interface ReturnRoute {
  total: number
  at: (distance: number) => Point
}

export interface LogoLoadingFrame {
  phase: LogoLoadingPhase
  top: string
  topAccent: string
  bottom: string
  bottomAccent: string
}

const TAU = Math.PI * 2
const RADIUS = 27
const HALF_CIRCUMFERENCE = Math.PI * RADIUS
const CENTER = { x: 28, y: 26.5 }
const SPLIT = { x: 28, y: 29 }
const START_DURATION = 2300
const STOP_DURATION = 3400
const PATH_SAMPLES = 96
const ACCENT_SAMPLES = 24

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress
const smooth = (value: number) => value * value * (3 - 2 * value)
const modulo = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor

const lookup = (points: readonly Point[]): Lookup => {
  const distances = [0]
  for (let index = 1; index < points.length; index++)
    distances.push(
      distances[index - 1] +
        Math.hypot(
          points[index].x - points[index - 1].x,
          points[index].y - points[index - 1].y,
        ),
    )
  const length = distances[distances.length - 1] ?? 0
  return {
    length,
    at(distance) {
      const target = Math.max(0, Math.min(length, distance))
      let low = 0
      let high = distances.length - 1
      while (high - low > 1) {
        const middle = (low + high) >> 1
        if (distances[middle] < target) low = middle
        else high = middle
      }
      const progress =
        (target - distances[low]) / (distances[high] - distances[low] || 1)
      return {
        x: mix(points[low].x, points[high].x, progress),
        y: mix(points[low].y, points[high].y, progress),
      }
    },
  }
}

const linePoints = (from: Point, to: Point, count = 32) =>
  Array.from({ length: count + 1 }, (_, index) => ({
    x: mix(from.x, to.x, index / count),
    y: mix(from.y, to.y, index / count),
  }))

const cubicPoints = (
  from: Point,
  controlA: Point,
  controlB: Point,
  to: Point,
  count = 96,
) =>
  Array.from({ length: count + 1 }, (_, index) => {
    const progress = index / count
    const inverse = 1 - progress
    return {
      x:
        inverse ** 3 * from.x +
        3 * inverse * inverse * progress * controlA.x +
        3 * inverse * progress * progress * controlB.x +
        progress ** 3 * to.x,
      y:
        inverse ** 3 * from.y +
        3 * inverse * inverse * progress * controlA.y +
        3 * inverse * progress * progress * controlB.y +
        progress ** 3 * to.y,
    }
  })

const append = (target: Point[], points: readonly Point[]) =>
  target.push(...points.slice(target.length ? 1 : 0))

const sourcePaths = (() => {
  const top: Point[] = []
  append(top, linePoints({ x: 28, y: 29 }, { x: 22, y: 29 }))
  append(
    top,
    cubicPoints(
      { x: 22, y: 29 },
      { x: 14.3, y: 29 },
      { x: 9, y: 24.8 },
      { x: 9, y: 19 },
    ),
  )
  append(
    top,
    cubicPoints(
      { x: 9, y: 19 },
      { x: 9, y: 13.2 },
      { x: 14.3, y: 9 },
      { x: 22, y: 9 },
    ),
  )
  append(top, linePoints({ x: 22, y: 9 }, { x: 43, y: 9 }))

  const bottom: Point[] = []
  append(bottom, linePoints({ x: 28, y: 29 }, { x: 34, y: 29 }))
  append(
    bottom,
    cubicPoints(
      { x: 34, y: 29 },
      { x: 39.4, y: 29 },
      { x: 43, y: 32.4 },
      { x: 43, y: 36.5 },
    ),
  )
  append(
    bottom,
    cubicPoints(
      { x: 43, y: 36.5 },
      { x: 43, y: 40.6 },
      { x: 39.4, y: 44 },
      { x: 34, y: 44 },
    ),
  )
  append(bottom, linePoints({ x: 34, y: 44 }, { x: 13, y: 44 }))
  return [lookup(top), lookup(bottom)] as const
})()

const circlePoint = (angle: number): Point => ({
  x: CENTER.x + RADIUS * Math.cos(angle),
  y: CENTER.y + RADIUS * Math.sin(angle),
})

const strands: readonly Strand[] = [
  {
    source: sourcePaths[0],
    angle: 0,
    end: { x: 43, y: 9 },
    controls: [
      { x: 52, y: 9 },
      { x: 55, y: 18 },
    ] as [Point, Point],
    exit: Math.PI * 0.75,
  },
  {
    source: sourcePaths[1],
    angle: Math.PI,
    end: { x: 13, y: 44 },
    controls: [
      { x: 4, y: 44 },
      { x: 1, y: 35 },
    ] as [Point, Point],
    exit: Math.PI * 1.75,
  },
].map((definition, index) => {
  const bridge = lookup(
    cubicPoints(
      definition.end,
      definition.controls[0],
      definition.controls[1],
      circlePoint(definition.angle),
      160,
    ),
  )
  const exit = circlePoint(definition.exit)
  const returnPath = lookup(
    cubicPoints(
      exit,
      {
        x: exit.x - 8 * Math.sin(definition.exit),
        y: exit.y + 8 * Math.cos(definition.exit),
      },
      { x: SPLIT.x + (index === 0 ? 6 : -6), y: SPLIT.y },
      SPLIT,
      160,
    ),
  )
  return {
    ...definition,
    bridge,
    join: definition.source.length + bridge.length,
    returnPath,
    accent: 1 - 11 / definition.source.length,
  }
})

const outward = (strand: Strand, distance: number) => {
  if (distance <= strand.source.length) return strand.source.at(distance)
  if (distance <= strand.join)
    return strand.bridge.at(distance - strand.source.length)
  return circlePoint(strand.angle + (distance - strand.join) / RADIUS)
}

const stopRoute = (strand: Strand, angle: number): ReturnRoute => {
  const base = strand.angle + angle
  const exitDistance =
    HALF_CIRCUMFERENCE + modulo(strand.exit - (base + Math.PI), TAU) * RADIUS
  return {
    total: exitDistance + strand.returnPath.length,
    at(distance) {
      if (distance <= exitDistance) return circlePoint(base + distance / RADIUS)
      return strand.returnPath.at(distance - exitDistance)
    },
  }
}

const pathData = (points: readonly Point[]) =>
  points
    .map(
      (point, index) =>
        `${index ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join('')

export class LogoLoadingMotion {
  phase: LogoLoadingPhase = 'idle'
  progress = 0
  angle = 0
  stopAngle = 0
  private pendingStop = false
  private returnRoutes: ReturnRoute[] = []
  private returnTravel = 0

  constructor(
    private readonly onPhaseChange?: (
      phase: LogoLoadingPhase,
      restored: boolean,
    ) => void,
  ) {}

  private setPhase(phase: LogoLoadingPhase, restored = false) {
    if (this.phase === phase) return
    this.phase = phase
    this.onPhaseChange?.(phase, restored)
  }

  start() {
    this.progress = 0
    this.angle = 0
    this.stopAngle = 0
    this.pendingStop = false
    this.setPhase('starting')
  }

  stop() {
    if (this.phase === 'starting') {
      this.pendingStop = true
      return
    }
    if (this.phase !== 'running') return
    this.progress = 0
    this.stopAngle = this.angle
    this.setPhase('stopping')
  }

  reset() {
    this.progress = 0
    this.angle = 0
    this.stopAngle = 0
    this.pendingStop = false
    this.setPhase('idle')
  }

  reduce(active: boolean) {
    this.progress = active ? 1 : 0
    this.angle = 0
    this.stopAngle = 0
    this.pendingStop = false
    this.setPhase(active ? 'running' : 'idle', !active)
  }

  advance(milliseconds: number) {
    if (this.phase === 'starting') {
      this.progress = clamp(this.progress + milliseconds / START_DURATION)
      if (this.progress >= 1) {
        this.progress = 1
        this.angle = 0
        this.setPhase('running')
        if (this.pendingStop) this.stop()
      }
      return
    }
    if (this.phase === 'stopping') {
      this.progress = clamp(this.progress + milliseconds / STOP_DURATION)
      if (this.progress >= 1) {
        this.progress = 0
        this.angle = 0
        this.setPhase('idle', true)
      }
      return
    }
    if (this.phase === 'running') this.angle += (milliseconds / 2200) * TAU
  }

  private position(strand: Strand, progress: number) {
    if (this.phase === 'idle')
      return strand.source.at(progress * strand.source.length)
    if (this.phase === 'starting')
      return outward(
        strand,
        mix(
          progress * strand.source.length,
          strand.join + progress * HALF_CIRCUMFERENCE,
          smooth(this.progress),
        ),
      )
    if (this.phase === 'running')
      return circlePoint(strand.angle + this.angle + progress * Math.PI)
    const route = this.returnRoutes[strands.indexOf(strand)]
    const distance = progress * HALF_CIRCUMFERENCE + this.returnTravel
    if (distance <= route.total) return route.at(distance)
    return strand.source.at(distance - route.total)
  }

  frame(): LogoLoadingFrame {
    if (this.phase === 'stopping') {
      this.returnRoutes = strands.map((strand) =>
        stopRoute(strand, this.stopAngle),
      )
      this.returnTravel =
        Math.max(...this.returnRoutes.map((route) => route.total)) *
        smooth(this.progress)
    }
    const accents = strands.map((strand) =>
      pathData(
        Array.from({ length: ACCENT_SAMPLES + 1 }, (_, index) =>
          this.position(strand, mix(strand.accent, 1, index / ACCENT_SAMPLES)),
        ),
      ),
    )
    if (this.phase === 'running')
      return {
        phase: this.phase,
        top: '',
        topAccent: accents[0],
        bottom: '',
        bottomAccent: accents[1],
      }
    const paths = strands.map((strand) =>
      pathData(
        Array.from({ length: PATH_SAMPLES + 1 }, (_, index) =>
          this.position(strand, index / PATH_SAMPLES),
        ),
      ),
    )
    return {
      phase: this.phase,
      top: paths[0],
      topAccent: accents[0],
      bottom: paths[1],
      bottomAccent: accents[1],
    }
  }
}

type FrameSubscriber = (milliseconds: number) => void
const subscribers = new Set<FrameSubscriber>()
let animationFrame = 0
let previousFrame = 0

const tick = (timestamp: number) => {
  animationFrame = 0
  const milliseconds = previousFrame
    ? Math.min(80, timestamp - previousFrame)
    : 0
  previousFrame = timestamp
  for (const subscriber of subscribers) subscriber(milliseconds)
  if (subscribers.size) animationFrame = requestAnimationFrame(tick)
  else previousFrame = 0
}

export const subscribeLogoLoadingFrame = (subscriber: FrameSubscriber) => {
  subscribers.add(subscriber)
  if (!animationFrame) animationFrame = requestAnimationFrame(tick)
  return () => {
    subscribers.delete(subscriber)
    if (!subscribers.size && animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
      previousFrame = 0
    }
  }
}
