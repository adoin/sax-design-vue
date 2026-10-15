import { getCssColor } from './color'

const activeRipples = new WeakMap<HTMLElement, Set<() => void>>()
type RippleMode = 'default' | 'invert' | 'cut' | 'ring' | 'glow'

export const clearRipples = (element: HTMLElement) => {
  activeRipples.get(element)?.forEach((dispose) => dispose())
  activeRipples.delete(element)
}

const createRipple = (
  event: MouseEvent,
  mode: RippleMode,
  color?: string,
  solid?: boolean,
) => {
  const element = event.currentTarget
  if (!(element instanceof HTMLElement)) return
  const rect = element.getBoundingClientRect()
  const width = element.clientWidth || rect.width
  const height = element.clientHeight || rect.height
  if (!width || !height) return
  const keyboard = event.type === 'click' && event.detail === 0
  const x = keyboard
    ? width / 2
    : Math.max(
        0,
        Math.min(
          width,
          ((event.clientX - rect.left) * width) / (rect.width || width),
        ),
      )
  const y = keyboard
    ? height / 2
    : Math.max(
        0,
        Math.min(
          height,
          ((event.clientY - rect.top) * height) / (rect.height || height),
        ),
      )
  const diameter = Math.max(
    1,
    Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) * 2,
  )
  const layer = document.createElement('span')
  layer.className = 's-ripple'
  layer.setAttribute('aria-hidden', 'true')
  const currentColor = color === 'inherit' || solid
  layer.style.setProperty(
    '--s-ripple-ink',
    currentColor
      ? 'currentColor'
      : color
        ? getCssColor(color) || color
        : '#fff',
  )
  layer.style.setProperty('--s-ripple-strength', currentColor ? '0.22' : '0.4')
  layer.style.setProperty('--s-ripple-travel', `${diameter * 0.32}px`)
  for (const name of mode === 'cut' ? ['cut-1', 'cut-2'] : [mode]) {
    const wave = document.createElement('span')
    wave.className = `s-ripple--${name}`
    wave.style.left = `${x}px`
    wave.style.top = `${y}px`
    wave.style.width = `${mode === 'cut' ? Math.max(14, diameter * 0.18) : diameter}px`
    wave.style.height = `${diameter}px`
    layer.appendChild(wave)
  }
  const effects = activeRipples.get(element) || new Set<() => void>()
  activeRipples.set(element, effects)
  if (effects.size >= 4) effects.values().next().value?.()
  let timer: ReturnType<typeof setTimeout>
  const dispose = () => {
    clearTimeout(timer)
    layer.removeEventListener('animationend', dispose)
    layer.remove()
    effects.delete(dispose)
    if (!effects.size) activeRipples.delete(element)
  }
  effects.add(dispose)
  layer.addEventListener('animationend', dispose, { once: true })
  element.appendChild(layer)
  const duration =
    getComputedStyle(layer.firstElementChild!)
      .animationDuration.split(',')[0]
      ?.trim() || '0.5s'
  const milliseconds =
    parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000)
  timer = setTimeout(
    dispose,
    (Number.isFinite(milliseconds) && milliseconds > 0 ? milliseconds : 500) +
      100,
  )
}

const ripple = (event: MouseEvent, color?: string, solid?: boolean) =>
  createRipple(event, 'default', color, solid)
const rippleReverse = (event: MouseEvent, color?: string) =>
  createRipple(event, 'invert', color)
const rippleCut = (event: MouseEvent, color?: string) =>
  createRipple(event, 'cut', color)
const rippleRing = (event: MouseEvent, color?: string) =>
  createRipple(event, 'ring', color)
const rippleGlow = (event: MouseEvent, color?: string) =>
  createRipple(event, 'glow', color)
export { rippleReverse, rippleCut, rippleRing, rippleGlow, ripple }
