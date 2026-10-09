import type { SvgFilterAnimationModule } from './index'

const clamp = (value: number) => Math.max(0, Math.min(1, value))
export const svgDissolveFrame = (progress: number) => {
  const p = clamp(progress)
  const erosion = clamp(p / 0.7)
  const scatter = clamp((p - 0.28) / 0.72) ** 2
  return {
    slope: 8 + erosion * 18,
    intercept: 1 - erosion * 14,
    scale: scatter * 26,
    dx: scatter * 12,
    dy: -scatter * 3.5,
    alpha: p === 1 ? 0 : p < 0.88 ? 1 : 1 - clamp((p - 0.88) / 0.12),
  }
}

export const dissolveAnimationDefinition: SvgFilterAnimationModule = {
  name: 'dissolve',
  duration: 480,
  reverseDuration: 650,
  frame: svgDissolveFrame,
  regions: {
    text: { x: '-100%', y: '-250%', width: '300%', height: '600%' },
    // Placeholder padding already exceeds the maximum 25px/16.5px scatter.
    'padded-text': { x: '0%', y: '0%', width: '100%', height: '100%' },
    surface: { x: '-10%', y: '-10%', width: '120%', height: '120%' },
  },
  definition: {
    key: 'animation-dissolve',
    attrs: { 'color-interpolation-filters': 'sRGB' },
    nodes: [
      {
        tag: 'feTurbulence',
        attrs: {
          type: 'fractalNoise',
          baseFrequency: '.62 .78',
          numOctaves: 2,
          seed: 13,
          result: 'noise',
        },
      },
      {
        tag: 'feColorMatrix',
        attrs: {
          in: 'noise',
          type: 'matrix',
          values: '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .333 .333 .333 0 0',
          result: 'noiseAlpha',
        },
      },
      {
        tag: 'feComponentTransfer',
        attrs: { in: 'noiseAlpha', result: 'particleMask' },
        children: [
          {
            tag: 'feFuncA',
            attrs: {
              'data-dissolve-threshold': '',
              type: 'linear',
              slope: 8,
              intercept: 1,
            },
          },
        ],
      },
      {
        tag: 'feComposite',
        attrs: {
          in: 'SourceGraphic',
          in2: 'particleMask',
          operator: 'in',
          result: 'cut',
        },
      },
      {
        tag: 'feDisplacementMap',
        attrs: {
          in: 'cut',
          in2: 'noise',
          scale: 0,
          xChannelSelector: 'R',
          yChannelSelector: 'G',
          result: 'moved',
        },
      },
      {
        tag: 'feOffset',
        attrs: { in: 'moved', dx: 0, dy: 0, result: 'shifted' },
      },
      {
        tag: 'feComponentTransfer',
        attrs: { in: 'shifted' },
        children: [
          {
            tag: 'feFuncA',
            attrs: {
              'data-dissolve-alpha': '',
              type: 'linear',
              slope: 1,
              intercept: 0,
            },
          },
        ],
      },
    ],
  },
  bindings: [
    { path: [2, 0], attribute: 'slope', channel: 'slope' },
    { path: [2, 0], attribute: 'intercept', channel: 'intercept' },
    { path: [4], attribute: 'scale', channel: 'scale' },
    { path: [5], attribute: 'dx', channel: 'dx' },
    { path: [5], attribute: 'dy', channel: 'dy' },
    { path: [6, 0], attribute: 'slope', channel: 'alpha' },
  ],
}
