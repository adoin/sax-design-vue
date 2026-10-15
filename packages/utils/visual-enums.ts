/** Canonical names mapped to retained internal CSS/animation names for compatibility. */
export const visualEnumAliases = {
  button: {
    type: 'solid',
    loadingType: 'logo',
    size: 'medium',
  },
  card: {
    type: 'basic',
    texture: 'solid',
    effect: 'none',
  },
  avatar: {
    shape: 'rounded',
  },
  countdown: {
    effect: 'static',
  },
  images: {
    hover: 'none',
  },
  loading: {
    type: 'logo',
  },
  link: {
    underlineEffect: 'plain',
  },
  navbar: {
    size: 'comfortable',
  },
  progress: {
    texture: 'none',
  },
  'radio-group': {
    type: 'radio',
  },
  text: {
    effect: 'none',
  },
  tooltip: {
    shape: 'rounded',
  },
  tag: {
    variant: 'filled',
    tagStyle: 'filled',
    size: 'medium',
  },
  'verification-code': {
    status: 'neutral',
  },
  steps: {
    size: 'medium',
  },
  tabs: {
    size: 'medium',
  },
  divider: {
    color: 'neutral',
  },
} as const

export const resolveVisualEnumProps = <T extends object>(
  component: string,
  props: T,
): T => {
  const aliases = (visualEnumAliases as Record<string, Record<string, string>>)[
    component
  ]
  if (!aliases) return props
  return new Proxy(props, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      return typeof key === 'string' &&
        Object.prototype.hasOwnProperty.call(aliases, key) &&
        aliases[key] === value
        ? 'default'
        : value
    },
  })
}
