import {
  buildProps,
  definePropType,
  isBoolean,
  isString,
} from '@vuesax-alpha/utils'

import { useColorProp } from '@vuesax-alpha/hooks'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import type { ExtractPropTypes } from 'vue'
import type Navbar from './navbar.vue'

export const navbarProps = buildProps({
  modelValue: {
    type: String,
  },
  /**
   * @description Component color - Accept Sax Design color tokens, Hex, rgb
   */
  color: useColorProp,

  /** @description Surface treatment of the navigation shell. */
  variant: {
    type: definePropType<'surface' | 'floating' | 'transparent'>(String),
    values: ['surface', 'floating', 'transparent'] as const,
    default: 'surface',
  },

  /** @description Positioning strategy. The legacy `fixed` prop takes priority. */
  position: {
    type: definePropType<'static' | 'sticky' | 'fixed'>(String),
    values: ['static', 'sticky', 'fixed'] as const,
    default: 'static',
  },

  /** @description Controls the navigation bar height and spacing. */
  size: {
    type: definePropType<'compact' | 'default' | 'spacious'>(String),
    values: ['compact', 'default', 'spacious'] as const,
    default: 'default',
  },

  /** @description Add a backdrop blur to the surface. */
  blurred: {
    type: Boolean,
  },

  /** @description Maximum width of the inner content. */
  contentWidth: {
    type: [Number, String],
    default: '100%',
  },

  /** @description Gap between brand, navigation and action regions. */
  gap: {
    type: [Number, String],
    default: 12,
  },

  /** @description Container width at which opted-in regions collapse. */
  collapseAt: {
    type: Number,
    default: 560,
  },

  /** @description Defines if the component is fixed on the screen. */
  fixed: {
    type: Boolean,
  },

  /** @description Add a shadow to the component. */
  shadow: {
    type: Boolean,
  },

  /** @description Add functionality to add shadow to component when scrollTop is more than 0. */
  shadowScroll: {
    type: Boolean,
  },

  /** @description Add the functionality to hide and show the component based on whether the scroll is lowered or raised.*/
  hideScroll: {
    type: Boolean,
  },

  /** @description Change the text color of items to white. */
  textWhite: {
    type: Boolean,
  },

  /** @description Change the border radius to 0 by making the component square. */
  square: {
    type: Boolean,
  },

  /** @description Determines if the component has padding and the user scrolling is removed making an effect. */
  paddingScroll: {
    type: Boolean,
  },

  /** @description Delete the active line in the component. */
  notLine: {
    type: Boolean,
  },

  /** @description Add the functionality that when the elements of this slot cannot be correctly they are visually removed. */
  leftCollapsed: {
    type: Boolean,
  },

  /** @description Add the functionality that when the elements of this slot cannot be correctly they are visually removed. */
  centerCollapsed: {
    type: Boolean,
  },

  /** @description Add the functionality that when the elements of this slot cannot be correctly they are visually removed. */
  rightCollapsed: {
    type: Boolean,
  },

  /** @description Determines the element to which the scroll event will be requested. */
  targetScroll: {
    type: String,
  },
} as const)

export type NavbarProps = ExtractPropTypes<typeof navbarProps>

export const navbarEmits = {
  collapsed: (val: unknown): val is boolean => isBoolean(val),
  [UPDATE_MODEL_EVENT]: (val: string): val is string => isString(val),
}

export type NavbarEmits = typeof navbarEmits

export type NavbarInstance = InstanceType<typeof Navbar>
