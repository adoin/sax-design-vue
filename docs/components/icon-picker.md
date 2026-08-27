---
API_TITLES:
  PROPS: Call options
PROPS:
  - name: locale
    type: Language
    values: Component locale object
    description: Locale used by the dialog and its nested controls.
    default: English
  - name: title
    type: String
    values: Dialog title
    description: Override the default title.
    default: Insert icon
  - name: iconList
    type: readonly string[]
    values: Registered Iconify names
    description: Icons available for search and selection in the dialog.
    default: 168 common Carbon icons
  - name: initialIcon
    type: String
    values: prefix:name
    description: Initially selected icon.
    default: "''"
  - name: color
    type: String
    values: HEX / RGB / HSL
    description: Initial icon color.
    default: '#5667F4'
  - name: size
    type: Number
    values: 8 - 256
    description: Output SVG width and height in pixels.
    default: 24
  - name: label
    type: String
    values: Accessible text
    description: Adds role=img and aria-label; omitted output is decorative.
    default: '-'
  - name: showName
    type: Boolean
    values: true / false
    description: Show names in the icon grid.
    default: 'true'
  - name: showAlpha
    type: Boolean
    values: true / false
    description: Allow alpha selection.
    default: 'false'
  - name: predefine
    type: Array
    values: Color presets
    description: Preset colors passed to the color picker.
    default: '[]'
  - name: maskClosable
    type: Boolean
    values: true / false
    description: Allow closing by clicking the overlay.
    default: 'true'
  - name: confirmText / cancelText
    type: String
    values: Button labels
    description: Custom confirm and cancel labels.
    default: '-'
description: 'Open a Promise-based icon and color dialog that returns standalone SVG code.'
---

# Icon picker

<card>

IconPicker provides a Promise-based icon selection dialog. Call
`SIconPicker(options)` to let the user choose an icon and color. Confirmation
returns a complete SVG string; cancellation, closing, or invocation during
server rendering returns `undefined`.

The returned SVG contains its dimensions, color, and path data. It can be
inserted into rich text, stored persistently, or used in other HTML contexts.
Later rendering does not require an Iconify name, runtime registry, cache, or
`safelist`.

```ts
import { SIconPicker } from 'sax-design-vue'

const svg = await SIconPicker({
  title: 'Insert icon',
  color: '#5667F4',
  size: 28,
  showAlpha: true,
})

if (svg) editor.insertHtml(svg)
```

</card>

<card>

## Rich-text insertion

Place the caret in the editable area below and choose “Insert icon”. The demo
stores and inserts only the SVG returned by the Promise, not an icon name.

<template #example><icon-picker-default /></template>

<template #template>

@[code](../.vuepress/components/icon-picker/default.vue)

</template>

</card>

<card>

## Return value and icon source

`SIconPicker(options)`, `openIconPicker(options)`, and the installed
`this.$iconPicker(options)` property call the same service:

```ts
type IconPickerResult = Promise<string | undefined>
```

- Confirm returns a complete `<svg>...</svg>` string.
- Cancel or close returns `undefined`.
- `iconList` controls what can be selected in this invocation. Once generated, the SVG is independent of the icon collection.
- Path data comes from trusted build-time icon data, and ColorPicker normalizes the color before it is written into the SVG. Do not mix unsanitized external SVG into `iconList`.

</card>
