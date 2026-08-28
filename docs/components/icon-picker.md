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
  - name: output
    type: String
    values: svg / code
    description: Return complete SVG or a compact object containing code, color, and size.
    default: svg
  - name: color
    type: String
    values: HEX / RGB / HSL
    description: Initial icon color.
    default: '#5667F4'
  - name: size
    type: Number
    values: 8 - 256
    description: Fix the output size; omit it to let the user choose in the dialog.
    default: Dialog selection, initially 24
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
description: 'Choose an icon, color, and size in a Promise-based dialog, then return compact icon data or complete SVG.'
---

# Icon picker

<card>

IconPicker provides a Promise-based icon selection dialog. `output: 'svg'`
returns a complete SVG string, while `output: 'code'` returns a compact object
containing the icon code, color, and size. Cancellation, closing, or invocation
during server rendering returns `undefined`.

Passing `size` fixes the output dimensions. If it is omitted, the user can
choose a size from 8–256 px directly in the dialog.

```ts
import { SIconPicker } from 'sax-design-vue'

const svg = await SIconPicker({
  title: 'Insert icon',
  output: 'svg',
  color: '#5667F4',
  showAlpha: true,
})

if (svg) editor.insertHtml(svg)

const icon = await SIconPicker({ output: 'code' })
// { code: 'cb:rocket', color: '#5667F4', size: 24 }
```

</card>

<card>

## Rich-text insertion

Place the caret in the editable area below and choose “Insert icon”. The demo
stores and inserts only the SVG returned by the Promise, not an icon name.

<template #example><icon-picker-default /></template>

<template #template>

@[code{64-93}](../.vuepress/components/icon-picker/default.vue)

</template>

<template #script>

@[code{1-62}](../.vuepress/components/icon-picker/default.vue)

</template>

<template #style>

@[code{95-148}](../.vuepress/components/icon-picker/default.vue)

</template>

</card>

<card>

## Output formats and icon source

`SIconPicker(options)`, `openIconPicker(options)`, and the installed
`this.$iconPicker(options)` property call the same service:

```ts
interface IconPickerCodeResult {
  code: string
  color: string
  size: number
}
```

- `output: 'svg'` returns a complete `<svg>...</svg>` string that can be inserted into HTML without an icon runtime.
- `output: 'code'` returns `IconPickerCodeResult`; it is more compact, but later rendering requires the matching icon collection.
- Cancel or close returns `undefined`.
- `iconList` controls what can be selected in this invocation.
- Path data comes from trusted build-time icon data, and ColorPicker normalizes the color before it is written into the SVG. Do not mix unsanitized external SVG into `iconList`.

</card>
