import { defineSvgFilter } from './index'

export const cardLiquidGlassFilter = defineSvgFilter({
  key: 'card-liquid-glass',
  attrs: {
    x: '-20%',
    y: '-20%',
    width: '140%',
    height: '140%',
    'color-interpolation-filters': 'sRGB',
  },
  nodes: [
    {
      tag: 'feTurbulence',
      attrs: {
        type: 'fractalNoise',
        baseFrequency: '0.008 0.008',
        numOctaves: '2',
        seed: '92',
        result: 'noise',
      },
    },
    {
      tag: 'feGaussianBlur',
      attrs: {
        in: 'noise',
        stdDeviation: '4',
        result: 'blurred-noise',
      },
    },
    {
      tag: 'feDisplacementMap',
      attrs: {
        in: 'SourceGraphic',
        in2: 'blurred-noise',
        scale: '48',
        xChannelSelector: 'R',
        yChannelSelector: 'G',
      },
    },
  ],
})

export const cardLiquidGlassSpecularFilter = defineSvgFilter({
  key: 'card-liquid-glass-2',
  attrs: {
    x: '0%',
    y: '0%',
    width: '100%',
    height: '100%',
    filterUnits: 'objectBoundingBox',
    'color-interpolation-filters': 'sRGB',
  },
  nodes: [
    {
      tag: 'feTurbulence',
      attrs: {
        type: 'fractalNoise',
        baseFrequency: '0.01 0.01',
        numOctaves: '1',
        seed: '5',
        result: 'turbulence',
      },
    },
    {
      tag: 'feComponentTransfer',
      attrs: {
        in: 'turbulence',
        result: 'mapped',
      },
      children: [
        {
          tag: 'feFuncR',
          attrs: {
            type: 'gamma',
            amplitude: '1',
            exponent: '10',
            offset: '0.5',
          },
        },
        {
          tag: 'feFuncG',
          attrs: {
            type: 'gamma',
            amplitude: '0',
            exponent: '1',
            offset: '0',
          },
        },
        {
          tag: 'feFuncB',
          attrs: {
            type: 'gamma',
            amplitude: '0',
            exponent: '1',
            offset: '0.5',
          },
        },
      ],
    },
    {
      tag: 'feGaussianBlur',
      attrs: {
        in: 'turbulence',
        stdDeviation: '3',
        result: 'soft-map',
      },
    },
    {
      tag: 'feSpecularLighting',
      attrs: {
        in: 'soft-map',
        surfaceScale: '5',
        specularConstant: '1',
        specularExponent: '100',
        'lighting-color': 'white',
        result: 'specular-light',
      },
      children: [
        {
          tag: 'fePointLight',
          attrs: {
            x: '-200',
            y: '-200',
            z: '300',
          },
        },
      ],
    },
    {
      tag: 'feComposite',
      attrs: {
        in: 'specular-light',
        operator: 'arithmetic',
        k1: '0',
        k2: '1',
        k3: '1',
        k4: '0',
        result: 'lit-image',
      },
    },
    {
      tag: 'feDisplacementMap',
      attrs: {
        in: 'SourceGraphic',
        in2: 'soft-map',
        scale: '150',
        xChannelSelector: 'R',
        yChannelSelector: 'G',
      },
    },
  ],
})

export const tagShapeShadowFilter = defineSvgFilter({
  key: 'tag-shape-shadow',
  attrs: {
    x: '-60%',
    y: '-80%',
    width: '220%',
    height: '260%',
    'color-interpolation-filters': 'sRGB',
  },
  nodes: [
    {
      tag: 'feMorphology',
      attrs: {
        in: 'SourceAlpha',
        operator: 'dilate',
        radius: '0.35',
        result: 'expanded-alpha',
      },
    },
    {
      tag: 'feGaussianBlur',
      attrs: {
        in: 'expanded-alpha',
        stdDeviation: '0.8',
        result: 'ambient-blur',
      },
    },
    {
      tag: 'feOffset',
      attrs: {
        in: 'ambient-blur',
        dy: '1',
        result: 'ambient-offset',
      },
    },
    {
      tag: 'feFlood',
      attrs: {
        'flood-color': 'var(--sax-css-primary)',
        'flood-opacity': '0.18',
        result: 'ambient-color',
      },
    },
    {
      tag: 'feComposite',
      attrs: {
        in: 'ambient-color',
        in2: 'ambient-offset',
        operator: 'in',
        result: 'ambient-shadow',
      },
    },
    {
      tag: 'feGaussianBlur',
      attrs: {
        in: 'expanded-alpha',
        stdDeviation: '2.4',
        result: 'depth-blur',
      },
    },
    {
      tag: 'feOffset',
      attrs: {
        in: 'depth-blur',
        dy: '3',
        result: 'depth-offset',
      },
    },
    {
      tag: 'feFlood',
      attrs: {
        'flood-color': 'var(--sax-css-primary)',
        'flood-opacity': '0.2',
        result: 'depth-color',
      },
    },
    {
      tag: 'feComposite',
      attrs: {
        in: 'depth-color',
        in2: 'depth-offset',
        operator: 'in',
        result: 'depth-shadow',
      },
    },
    {
      tag: 'feMerge',
      children: [
        {
          tag: 'feMergeNode',
          attrs: {
            in: 'depth-shadow',
          },
        },
        {
          tag: 'feMergeNode',
          attrs: {
            in: 'ambient-shadow',
          },
        },
        {
          tag: 'feMergeNode',
          attrs: {
            in: 'SourceGraphic',
          },
        },
      ],
    },
  ],
})
