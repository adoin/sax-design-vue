import { getIconData } from 'sax-design-vue-iconify'
import {
  formatColor,
  parseColor,
  toCssColor,
} from '@vuesax-alpha/components/color-picker'
import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type { ColorPickerPresetInput } from '@vuesax-alpha/components/color-picker'
import type { Language } from '@vuesax-alpha/locale'
import type IconPicker from './icon-picker.vue'

export const DEFAULT_ICON_LIST = [
  'cb:home',
  'cb:search',
  'cb:settings',
  'cb:menu',
  'cb:overflow-menu-horizontal',
  'cb:overflow-menu-vertical',
  'cb:arrow-up',
  'cb:arrow-down',
  'cb:arrow-left',
  'cb:arrow-right',
  'cb:arrow-up-left',
  'cb:arrow-up-right',
  'cb:arrow-down-left',
  'cb:arrow-down-right',
  'cb:chevron-up',
  'cb:chevron-down',
  'cb:chevron-left',
  'cb:chevron-right',
  'cb:caret-up',
  'cb:caret-down',
  'cb:caret-left',
  'cb:caret-right',
  'cb:launch',
  'cb:maximize',
  'cb:minimize',
  'cb:expand-all',
  'cb:collapse-all',
  'cb:renew',
  'cb:restart',
  'cb:undo',
  'cb:redo',
  'cb:rotate',
  'cb:reset',
  'cb:zoom-in',
  'cb:zoom-out',
  'cb:add',
  'cb:add-alt',
  'cb:subtract',
  'cb:close',
  'cb:checkmark',
  'cb:checkmark-outline',
  'cb:edit',
  'cb:trash-can',
  'cb:save',
  'cb:copy',
  'cb:cut',
  'cb:paste',
  'cb:link',
  'cb:unlink',
  'cb:attachment',
  'cb:share',
  'cb:send',
  'cb:download',
  'cb:upload',
  'cb:cloud-download',
  'cb:cloud-upload',
  'cb:document-add',
  'cb:folder-add',
  'cb:bookmark',
  'cb:favorite',
  'cb:star',
  'cb:document',
  'cb:document-blank',
  'cb:document-pdf',
  'cb:document-word-processor',
  'cb:table-split',
  'cb:folder',
  'cb:folder-open',
  'cb:folder-shared',
  'cb:image',
  'cb:image-search',
  'cb:video',
  'cb:music',
  'cb:camera',
  'cb:microphone',
  'cb:headphones',
  'cb:play',
  'cb:pause',
  'cb:stop',
  'cb:skip-back',
  'cb:skip-forward',
  'cb:volume-up',
  'cb:volume-down',
  'cb:volume-mute',
  'cb:printer',
  'cb:user',
  'cb:user-avatar',
  'cb:user-multiple',
  'cb:group',
  'cb:email',
  'cb:email-new',
  'cb:chat',
  'cb:phone',
  'cb:notification',
  'cb:calendar',
  'cb:time',
  'cb:location',
  'cb:map',
  'cb:earth',
  'cb:globe',
  'cb:wifi',
  'cb:rss',
  'cb:information',
  'cb:warning',
  'cb:error',
  'cb:help',
  'cb:checkmark-filled',
  'cb:error-outline',
  'cb:warning-alt',
  'cb:locked',
  'cb:unlocked',
  'cb:password',
  'cb:security',
  'cb:shield-alert',
  'cb:view',
  'cb:view-off',
  'cb:login',
  'cb:logout',
  'cb:filter',
  'cb:filter-reset',
  'cb:sort-ascending',
  'cb:sort-descending',
  'cb:list',
  'cb:list-bulleted',
  'cb:grid',
  'cb:table',
  'cb:chart-bar',
  'cb:chart-line',
  'cb:chart-pie',
  'cb:dashboard',
  'cb:analytics',
  'cb:data-base',
  'cb:cloud',
  'cb:code',
  'cb:code-block',
  'cb:terminal',
  'cb:tools',
  'cb:idea',
  'cb:light',
  'cb:color-palette',
  'cb:tag',
  'cb:shopping-cart',
  'cb:wallet',
  'cb:currency-dollar',
  'cb:receipt',
  'cb:delivery',
  'cb:car',
  'cb:train',
  'cb:flight-international',
  'cb:building',
  'cb:industry',
  'cb:gift',
  'cb:rocket',
  'cb:portfolio',
  'cb:task',
  'cb:event',
  'cb:flag',
  'cb:pin',
  'cb:meter',
  'cb:network-3',
  'cb:api',
  'cb:app',
  'cb:package',
  'cb:workspace',
  'cb:campsite',
  'cb:accessibility',
  'cb:face-satisfied',
  'cb:face-dissatisfied',
] as const

export const iconPickerProps = buildProps({
  locale: {
    type: definePropType<Language>(Object),
  },
  title: String,
  iconList: {
    type: definePropType<readonly string[]>(Array),
    default: () => [...DEFAULT_ICON_LIST],
  },
  initialIcon: { type: String, default: '' },
  color: { type: String, default: '#5667F4' },
  size: {
    type: Number,
    default: 24,
    validator: (value: number) =>
      Number.isFinite(value) && value >= 8 && value <= 256,
  },
  label: String,
  showName: { type: Boolean, default: true },
  showAlpha: Boolean,
  predefine: {
    type: definePropType<ColorPickerPresetInput[]>(Array),
    default: () => [],
  },
  maskClosable: { type: Boolean, default: true },
  confirmText: String,
  cancelText: String,
} as const)

export const iconPickerEmits = {
  confirm: (svg: string) => typeof svg === 'string',
  cancel: () => true,
  closed: () => true,
}

export interface CreateIconSvgOptions {
  name: string
  color: string
  size?: number
  label?: string
}

export interface IconPickerOptions {
  locale?: Language
  title?: string
  iconList?: readonly string[]
  initialIcon?: string
  color?: string
  size?: number
  label?: string
  showName?: boolean
  showAlpha?: boolean
  predefine?: ColorPickerPresetInput[]
  maskClosable?: boolean
  confirmText?: string
  cancelText?: string
}

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export const normalizeIconList = (iconList: readonly string[]) => {
  const unique = new Set<string>()
  iconList.forEach((icon) => {
    const value = icon.trim()
    if (/^[^:\s]+:[^:\s]+$/.test(value) && getIconData(value)) {
      unique.add(value)
    }
  })
  return [...unique]
}

export const createIconSvg = ({
  name,
  color,
  size = 24,
  label,
}: CreateIconSvgOptions) => {
  const data = getIconData(name)
  const parsedColor = parseColor(color)
  if (!data || !parsedColor) return

  const normalizedSize = Math.min(Math.max(Math.round(size), 8), 256)
  const normalizedColor =
    parsedColor.alpha < 1
      ? toCssColor(parsedColor)
      : formatColor(parsedColor, 'hex')
  const body = data.body.replace(/currentColor/g, normalizedColor)
  const attributes: Record<string, string> = {
    ...data.attributes,
    xmlns: 'http://www.w3.org/2000/svg',
    width: String(normalizedSize),
    height: String(normalizedSize),
  }

  if (label) {
    attributes.role = 'img'
    attributes['aria-label'] = label
  } else {
    attributes['aria-hidden'] = 'true'
  }

  const serializedAttributes = Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeAttribute(String(value))}"`)
    .join(' ')

  return `<svg ${serializedAttributes}>${body}</svg>`
}

export type IconPickerProps = ExtractPropTypes<typeof iconPickerProps>
export type IconPickerInstance = InstanceType<typeof IconPicker>
