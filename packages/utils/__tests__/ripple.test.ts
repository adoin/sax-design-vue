import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clearRipples,
  ripple,
  rippleReverse,
  rippleCut,
  rippleRing,
  rippleGlow,
} from '../ripple'
const hosts: HTMLElement[] = []
const createHost = (run = ripple) => {
  const host = document.createElement('button')
  const child = document.createElement('span')
  host.appendChild(child)
  document.body.appendChild(host)
  hosts.push(host)
  vi.spyOn(host, 'getBoundingClientRect').mockReturnValue({
    left: 100,
    top: 50,
    width: 200,
    height: 40,
  } as DOMRect)
  host.addEventListener('pointerdown', run as EventListener)
  return { host, child }
}
afterEach(() => {
  hosts.forEach((host) => {
    clearRipples(host)
    host.remove()
  })
  hosts.length = 0
  vi.useRealTimers()
  vi.restoreAllMocks()
})
describe('ripple lifecycle and geometry', () => {
  it('uses the button as origin even when a nested icon is pressed', () => {
    const { host, child } = createHost()
    child.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 115,
        clientY: 60,
      }),
    )
    const wave = host.querySelector<HTMLElement>('.s-ripple--default')!
    expect(wave.style.left).toBe('15px')
    expect(wave.style.top).toBe('10px')
    expect(parseFloat(wave.style.width)).toBeCloseTo(Math.hypot(185, 30) * 2)
    expect(host.querySelector('.s-ripple')?.getAttribute('aria-hidden')).toBe(
      'true',
    )
  })
  it.each([
    [rippleReverse, 'invert', 1],
    [rippleCut, 'cut-1', 2],
    [rippleRing, 'ring', 1],
    [rippleGlow, 'glow', 1],
  ] as const)(
    'creates the correct variant and cleans up after animation',
    (run, variant, count) => {
      const { host, child } = createHost(run)
      child.dispatchEvent(
        new MouseEvent('pointerdown', {
          bubbles: true,
          clientX: 150,
          clientY: 70,
        }),
      )
      expect(host.querySelectorAll('.s-ripple > span')).toHaveLength(count)
      host
        .querySelector(`.s-ripple--${variant}`)!
        .dispatchEvent(new Event('animationend', { bubbles: true }))
      expect(host.querySelector('.s-ripple')).toBeNull()
    },
  )
  it('caps rapid presses and removes effects without needing mouseup', () => {
    vi.useFakeTimers()
    const { host, child } = createHost()
    for (let i = 0; i < 12; i++)
      child.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    expect(host.querySelectorAll('.s-ripple')).toHaveLength(4)
    vi.advanceTimersByTime(700)
    expect(host.querySelectorAll('.s-ripple')).toHaveLength(0)
  })
  it('centers keyboard activation and uses currentColor on light surfaces', () => {
    const { host } = createHost()
    host.addEventListener('click', (event) => ripple(event, 'inherit'))
    host.click()
    const layer = host.querySelector<HTMLElement>('.s-ripple')!
    const wave = layer.firstElementChild as HTMLElement
    expect(wave.style.left).toBe('100px')
    expect(wave.style.top).toBe('20px')
    expect(layer.style.getPropertyValue('--s-ripple-ink')).toBe('currentColor')
  })
})
