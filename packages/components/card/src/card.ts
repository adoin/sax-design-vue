import { useColorProp, useShapeProp } from '@vuesax-alpha/hooks'
import { buildProps, definePropType, isBoolean } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Card from './card.vue'

export const cardTypes = [
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
const acceptedCardTypes = [...cardTypes, ...legacyCardTypes] as const

export const cardVariants = [
  'elevated',
  'outlined',
  'soft',
  'solid',
  'plain',
  'glass',
] as const
export const cardOrientations = ['vertical', 'horizontal'] as const
export const cardHoverEffects = ['none', 'lift', 'glow'] as const

export type CardVariant = (typeof cardVariants)[number]
export type CardOrientation = (typeof cardOrientations)[number]
export type CardHoverEffect = (typeof cardHoverEffects)[number]
export type CardType = (typeof cardTypes)[number]
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
   * @description Surface treatment, independent from content layout.
   */
  variant: {
    type: definePropType<CardVariant>(String),
    values: cardVariants,
  },
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
   * @description Named card preset controlling layout and visual style. Numeric values 1-5 remain as compatibility aliases.
   * @enum `classic` | `overlay` | `split` | `frosted` | `reveal` | `profile` | `metric` | `article`
   * @default classic
   */
  type: {
    type: definePropType<CardType | LegacyCardType>([String, Number]),
    values: acceptedCardTypes,
    validator: (val: unknown): val is CardType | LegacyCardType =>
      acceptedCardTypes.includes(val as any),
    default: 'classic',
  },
} as const)

export const cardEmits = {
  'update:selected': (value: boolean) => isBoolean(value),
  select: (value: boolean, event: MouseEvent) =>
    isBoolean(value) && event instanceof MouseEvent,
}

export type CardProps = ExtractPropTypes<typeof cardProps>
export type CardInstance = InstanceType<typeof Card>
