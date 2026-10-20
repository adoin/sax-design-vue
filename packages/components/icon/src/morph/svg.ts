import type { SaxIconData } from '../icon'
import type { MorphShape } from './types'

const counts: Record<string, number> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
}

/** Split at moves, retaining absolute coordinates for relative subpaths. */
export const splitSubpaths = (d: string): string[] => {
  const tokens =
    d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi) || []
  const paths: string[] = []
  let index = 0,
    command = '',
    x = 0,
    y = 0,
    startX = 0,
    startY = 0
  let current = ''
  while (index < tokens.length) {
    if (/^[a-z]$/i.test(tokens[index])) command = tokens[index++]
    let upper = command.toUpperCase()
    const count = counts[upper]
    if (count === undefined) throw new Error('Unsupported SVG path command')
    if (upper === 'Z') {
      current += 'Z'
      x = startX
      y = startY
      command = ''
      continue
    }
    const args = tokens.slice(index, index + count).map(Number)
    if (args.length !== count || args.some((value) => !Number.isFinite(value)))
      throw new Error('Invalid SVG path')
    index += count
    if (command !== upper) {
      if (upper === 'H') args[0] += x
      else if (upper === 'V') args[0] += y
      else if (upper === 'A') {
        args[5] += x
        args[6] += y
      } else
        for (let i = 0; i < args.length; i += 2) {
          args[i] += x
          args[i + 1] += y
        }
    }
    if (upper === 'H') {
      args.push(y)
      upper = 'L'
    }
    if (upper === 'V') {
      args.unshift(x)
      upper = 'L'
    }
    if (upper === 'M') {
      if (current) paths.push(current)
      current = ''
      startX = args[0]
      startY = args[1]
      command = command === 'm' ? 'l' : 'L'
    }
    current += `${upper}${args.join(' ')} `
    x = args[args.length - 2]
    y = args[args.length - 1]
  }
  if (current) paths.push(current)
  return paths
}

const geometryPath = (element: Element): string => {
  const number = (name: string) => Number(element.getAttribute(name) || 0)
  switch (element.localName) {
    case 'path':
      return element.getAttribute('d') || ''
    case 'line':
      return `M${number('x1')} ${number('y1')}L${number('x2')} ${number('y2')}`
    case 'polyline':
    case 'polygon':
      return `M${element.getAttribute('points') || ''}${element.localName === 'polygon' ? 'Z' : ''}`
    case 'circle':
    case 'ellipse': {
      const x = number('cx'),
        y = number('cy')
      const rx = number(element.localName === 'circle' ? 'r' : 'rx')
      const ry = number(element.localName === 'circle' ? 'r' : 'ry')
      return `M${x - rx} ${y}A${rx} ${ry} 0 1 0 ${x + rx} ${y}A${rx} ${ry} 0 1 0 ${x - rx} ${y}Z`
    }
    case 'rect': {
      const x = number('x'),
        y = number('y'),
        w = number('width'),
        h = number('height')
      const rx = Math.min(w / 2, number('rx') || number('ry'))
      const ry = Math.min(h / 2, number('ry') || number('rx'))
      if (!rx || !ry) return `M${x} ${y}h${w}v${h}h${-w}Z`
      return `M${x + rx} ${y}H${x + w - rx}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}V${y + h - ry}A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}V${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`
    }
    default:
      throw new Error('Unsupported SVG geometry')
  }
}

const attributes = [
  'fill',
  'stroke',
  'stroke-width',
  'fill-rule',
  'stroke-linecap',
  'stroke-linejoin',
  'fill-opacity',
  'stroke-opacity',
]
const cache = new Map<string, MorphShape[]>()

/** Browser geometry handles nested transforms and viewBox scaling for both engines. */
export const readMorphShapes = (data: SaxIconData): MorphShape[] => {
  const key = JSON.stringify(data)
  const cached = cache.get(key)
  if (cached) return cached
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  for (const [name, value] of Object.entries(data.attributes))
    svg.setAttribute(name, value)
  svg.setAttribute('width', '24')
  svg.setAttribute('height', '24')
  svg.style.cssText =
    'position:fixed;left:0;top:0;width:24px;height:24px;visibility:hidden;pointer-events:none'
  svg.innerHTML = data.body
  // Complex paint servers keep the original static SVG instead of losing artwork.
  if (
    svg.querySelector(
      'defs,mask,clipPath,filter,use,text,image,foreignObject,style,script,svg',
    ) ||
    svg.querySelector('[mask],[clip-path],[filter],[class]')
  )
    throw new Error('Complex SVG stays static')
  document.body.append(svg)
  try {
    const shapes: MorphShape[] = []
    let group = 0
    for (const element of svg.querySelectorAll('*')) {
      if (['g', 'title', 'desc'].includes(element.localName)) continue
      const geometry = element as SVGGraphicsElement
      const computed = getComputedStyle(geometry)
      if (computed.display === 'none' || computed.visibility === 'collapse')
        continue
      const matrix = geometry.getCTM()
      if (!matrix) throw new Error('SVG geometry unavailable')
      const attrs: Record<string, string> = {}
      for (const name of attributes) {
        let owner: Element | null = element
        let value: string | undefined
        while (owner && owner !== svg.parentElement) {
          value =
            (owner as SVGElement).style?.getPropertyValue(name) ||
            owner.getAttribute(name) ||
            undefined
          if (value) break
          owner = owner.parentElement
        }
        value ||=
          name === 'fill' ? 'currentColor' : computed.getPropertyValue(name)
        if (value.includes('url(') || value.includes('var('))
          throw new Error('Complex paint stays static')
        if (value) attrs[name] = value
      }
      let opacity = 1
      let owner: Element | null = element
      while (owner && owner !== svg.parentElement) {
        opacity *= Number(getComputedStyle(owner).opacity || 1)
        owner = owner.parentElement
      }
      attrs.opacity = String(opacity)
      attrs['stroke-width'] = String(
        Number.parseFloat(attrs['stroke-width'] || '1') *
          Math.sqrt(Math.abs(matrix.a * matrix.d - matrix.b * matrix.c)),
      )
      for (const d of splitSubpaths(geometryPath(element)))
        shapes.push({
          group,
          d,
          matrix: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f],
          attributes: attrs,
          closed: /z\s*$/i.test(d),
        })
      group++
    }
    if (!shapes.length || shapes.length > 64)
      throw new Error('Unsupported SVG complexity')
    if (cache.size >= 128) cache.delete(cache.keys().next().value!)
    cache.set(key, shapes)
    return shapes
  } finally {
    svg.remove()
  }
}
