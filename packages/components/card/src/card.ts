import { useColorProp, useShapeProp } from '@vuesax-alpha/hooks'
import { buildProps, definePropType, isBoolean } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Card from './card.vue'

export const cardTypes = [
  'basic',
  'classic',
  'overlay',
  'split',
  'frosted',
  'reveal',
  'profile',
  'metric',
  'article',
] as const

const legacyCardTypes = [1, '1', 2, '2', 3, '3', 4, '4', 5, '5'] as const
const acceptedCardTypes = [...cardTypes, 'default', ...legacyCardTypes] as const

export const cardOrientations = ['vertical', 'horizontal'] as const
export const cardHoverEffects = ['none', 'lift', 'glow'] as const
export const cardTextures = ['solid', 'liquid-glass', 'liquid-glass-2'] as const
export const cardEffects = ['none', 'spotlight', 'gradient-glow'] as const

export type CardOrientation = (typeof cardOrientations)[number]
export type CardHoverEffect = (typeof cardHoverEffects)[number]
export type CardTexture = (typeof cardTextures)[number] | 'default'
export type CardEffect = (typeof cardEffects)[number] | 'default'
export type CardType = (typeof cardTypes)[number] | 'default'
export type LegacyCardType = (typeof legacyCardTypes)[number]

export const cardProps = buildProps({
  /**
   * @description Card title. The `title` slot takes precedence when provided.
   */
  title: String,
  /**
   * @description Card body text. The `text` slot takes precedence when provided.
   */
  text: String,
  /**
   * @description Secondary text rendered below the card title.
   */
  subtitle: String,
  /**
   * @description Component color - Accept Sax Design color tokens, Hex, rgb
   */
  color: useColorProp,
  /**
   * @description Arrange card media and content vertically or horizontally.
   */
  orientation: {
    type: definePropType<CardOrientation>(String),
    values: cardOrientations,
  },
  /**
   * @description Optional hover and keyboard-focus feedback.
   */
  hoverEffect: {
    type: definePropType<CardHoverEffect>(String),
    values: cardHoverEffects,
  },
  /**
   * @description Card corner geometry. Inherits ConfigProvider shape.
   */
  shape: useShapeProp,
  /**
   * @description Adds keyboard focus and button semantics to a clickable card.
   */
  interactive: Boolean,
  /**
   * @description Makes the card a toggleable selection surface.
   */
  selectable: Boolean,
  /**
   * @description Controlled selected state used with `selectable`.
   */
  selected: Boolean,
  /**
   * @description Replaces card content visually with a stable skeleton.
   */
  loading: Boolean,
  /**
   * @description Surface texture, independent from the card layout and decorative effect.
   * @enum `solid` | `liquid-glass` | `liquid-glass-2`
   * @default solid
   */
  texture: {
    type: definePropType<CardTexture>(String),
    values: [...cardTextures, 'default'] as const,
    default: 'solid',
  },
  /**
   * @description Decorative background effect, independent from the card layout preset.
   * @enum `none` | `spotlight` | `gradient-glow`
   * @default none
   */
  effect: {
    type: definePropType<CardEffect>(String),
    values: [...cardEffects, 'default'] as const,
    default: 'none',
  },
  /**
   * @description Named card preset controlling layout and visual style. Numeric values 1-5 remain as compatibility aliases.
   * @enum `basic` | `classic` | `overlay` | `split` | `frosted` | `reveal` | `profile` | `metric` | `article`
   * @default basic
   */
  type: {
    type: definePropType<CardType | LegacyCardType>([String, Number]),
    values: acceptedCardTypes,
    validator: (val: unknown): val is CardType | LegacyCardType =>
      acceptedCardTypes.includes(val as any),
    default: 'basic',
  },
} as const)

export const cardEmits = {
  'update:selected': (value: boolean) => isBoolean(value),
  select: (value: boolean, event: MouseEvent) =>
    isBoolean(value) && event instanceof MouseEvent,
}

export type CardProps = ExtractPropTypes<typeof cardProps>
export type CardInstance = InstanceType<typeof Card>
