import type { Gradient, Paint, PaintStyle } from 'svg-morpheus-ts/core'

/** DOM adapter only: interpolation and gradient rendering live in the shared core. */
export const readPaint = (
  element: Element,
  svg: SVGSVGElement,
  attributes: Record<string, string>,
): PaintStyle => {
  const gradients = new Map<string, Gradient>()
  const resolve = (
    value: string | undefined,
    seen = new Set<string>(),
  ): Paint | undefined => {
    const id = value && /^url\(\s*["']?#([^\s)"']+)["']?\s*\)$/.exec(value)?.[1]
    if (!id) return value
    if (seen.has(id)) throw new Error('Cyclic gradient reference')
    const cached = gradients.get(id)
    if (cached) return cached
    seen.add(id)
    const node = [...svg.querySelectorAll('[id]')].find((n) => n.id === id) as
      SVGElement | undefined
    if (!node || !['linearGradient', 'radialGradient'].includes(node.localName))
      throw new Error('Unsupported paint server')
    const href = node.getAttribute('href') || node.getAttribute('xlink:href')
    const parent = href ? resolve(`url(${href})`, seen) : undefined
    const inherited = typeof parent === 'object' ? parent : undefined
    const attrs = { ...inherited?.attributes }
    for (const name of [
      'x1',
      'y1',
      'x2',
      'y2',
      'cx',
      'cy',
      'r',
      'fx',
      'fy',
      'fr',
      'gradientUnits',
      'spreadMethod',
      'gradientTransform',
    ]) {
      const v = node.getAttribute(name)
      if (v !== null) attrs[name] = v
    }
    // DOMMatrix accepts matrix() while SVGTransformList also handles rotate/translate/scale.
    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    probe.setAttribute('transform', attrs.gradientTransform || '')
    const matrix = probe.transform.baseVal.consolidate()?.matrix
    attrs.gradientTransform = matrix
      ? `matrix(${[matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f].join(' ')})`
      : 'matrix(1 0 0 1 0 0)'
    if (attrs.gradientUnits === 'userSpaceOnUse') {
      const box = svg.viewBox.baseVal
      for (const key of [
        'x1',
        'y1',
        'x2',
        'y2',
        'cx',
        'cy',
        'r',
        'fx',
        'fy',
        'fr',
      ]) {
        const v = attrs[key]
        if (!v?.endsWith('%')) continue
        const horizontal = ['x1', 'x2', 'cx', 'fx'].includes(key),
          vertical = ['y1', 'y2', 'cy', 'fy'].includes(key)
        const size = horizontal
          ? box.width
          : vertical
            ? box.height
            : Math.hypot(box.width, box.height) / Math.SQRT2
        attrs[key] = String(
          (horizontal ? box.x : vertical ? box.y : 0) +
            (Number.parseFloat(v) * size) / 100,
        )
      }
      const defaults =
        node.localName === 'radialGradient'
          ? {
              cx: box.x + box.width / 2,
              cy: box.y + box.height / 2,
              r: Math.hypot(box.width, box.height) / Math.SQRT2 / 2,
            }
          : { x1: box.x, y1: box.y, x2: box.x + box.width, y2: box.y }
      for (const [key, v] of Object.entries(defaults)) attrs[key] ??= String(v)
    }
    const stops = [...node.children]
      .filter((n) => n.localName === 'stop')
      .map((n) => {
        const stop = n as SVGElement,
          offset = stop.getAttribute('offset') || '0'
        const alpha =
          stop.style.getPropertyValue('stop-opacity') ||
          stop.getAttribute('stop-opacity') ||
          '1'
        return {
          offset: Math.max(
            0,
            Math.min(
              1,
              Number.parseFloat(offset) / (offset.endsWith('%') ? 100 : 1),
            ),
          ),
          color:
            stop.style.getPropertyValue('stop-color') ||
            stop.getAttribute('stop-color') ||
            'black',
          opacity: Math.max(
            0,
            Math.min(
              1,
              Number.parseFloat(alpha) / (alpha.endsWith('%') ? 100 : 1),
            ),
          ),
        }
      })
    let previous = 0
    for (const stop of stops) {
      stop.offset = Math.max(previous, stop.offset)
      previous = stop.offset
    }
    const gradient: Gradient = {
      type: node.localName as Gradient['type'],
      attributes: attrs,
      stops: stops.length
        ? stops
        : (inherited?.stops ?? [{ offset: 0, color: 'transparent' }]),
    }
    gradients.set(id, gradient)
    return gradient
  }
  const groups: NonNullable<PaintStyle['groups']> = []
  const nodes = [...svg.querySelectorAll('*')]
  let owner: Element | null = element.parentElement
  while (owner && owner !== svg.parentElement) {
    const computed = getComputedStyle(owner)
    const alpha = computed.opacity || owner.getAttribute('opacity') || '1'
    const opacity = Math.max(
      0,
      Math.min(1, Number.parseFloat(alpha) / (alpha.endsWith('%') ? 100 : 1)),
    )
    const blend =
      computed.mixBlendMode === 'plus-lighter'
        ? ('plus-lighter' as const)
        : undefined
    const isolate = computed.isolation === 'isolate'
    if (opacity !== 1 || blend || isolate)
      groups.unshift({
        id: owner === svg ? 'root' : String(nodes.indexOf(owner)),
        opacity,
        blend,
        isolate,
      })
    owner = owner.parentElement
  }
  return {
    attributes,
    fill: resolve(attributes.fill),
    stroke: resolve(attributes.stroke),
    groups,
  }
}
