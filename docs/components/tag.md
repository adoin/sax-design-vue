---
PROPS:
  - name: v-model
    type: Boolean
    values: 'true, false'
    description: Visibility when closable.
    default: true
    link: null
    usage: '#closable'

  - name: text
    type: String
    values: 'String'
    description: Tag label text.
    default: null
    link: null
    usage: '#default'

  - name: editable
    type: Boolean
    values: 'true, false'
    description: Render a borderless inline editor inside the tag.
    default: 'false'
    link: null
    usage: '#add-and-remove-items'

  - name: edit-placeholder
    type: String
    values: 'String'
    description: Placeholder text for the inline tag editor.
    default: "''"
    link: null
    usage: '#add-and-remove-items'

  - name: edit-autofocus
    type: Boolean
    values: 'true, false'
    description: Focus the editable tag when it is mounted.
    default: 'false'
    link: null
    usage: '#add-and-remove-items'

  - name: closable
    type: Boolean, String
    values: 'true, false'
    description: Show close button.
    default: 'false'
    link: null
    usage: '#closable'

  - name: color
    type: String
    values: 'primary, success, danger, warning, dark, RGB, HEX'
    description: Tag color.
    default: null
    link: null
    usage: '#color'

  - name: status
    type: String
    values: 'primary, success, warning, warn, danger, info, dark'
    description: Apply a semantic tag color. A custom color takes priority.
    default: null
    link: null
    usage: '#default'

  - name: type
    type: String
    values: 'primary, success, warning, warn, danger, info, dark'
    description: Compatibility alias for `status`.
    default: null
    link: null
    usage: '#default'

  - name: disabled
    type: Boolean
    values: 'true, false'
    description: Disable tag click and close interactions.
    default: 'false'
    link: null
    usage: '#default'

  - name: border
    type: Boolean
    values: 'true, false'
    description: Compatibility alias for `variant="outline"`.
    default: 'false'
    link: null
    usage: '#variants'

  - name: transparent
    type: Boolean
    values: 'true, false'
    description: Transparent background style.
    default: 'false'
    link: null
    usage: '#transparent'

  - name: variant
    type: String
    values: 'default, outline, dashed, mark, arrow, flag'
    description: Select the tag's visual treatment independently from its geometry.
    default: default
    link: null
    usage: '#variants'

  - name: tag-style
    type: String
    values: 'default, outline, dashed, mark, arrow, flag'
    description: Compatibility alias for `variant`.
    default: default
    link: null
    usage: '#variants'

  - name: shape
    type: String
    values: 'rounded, square, pill'
    description: Select rounded, square, or pill geometry. Mark and arrow include shape-safe treatments.
    default: rounded
    link: null
    usage: '#shape'

  - name: round
    type: Boolean
    values: 'true, false'
    description: Compatibility alias for `shape="pill"`.
    default: 'false'
    link: null
    usage: '#shape'

  - name: size
    type: String
    values: 'small, default, large'
    description: Tag size.
    default: default
    link: null
    usage: '#variants'

  - name: icon
    type: String
    values: 'Material icon name'
    description: Leading icon inside tag.
    default: null
    link: null
    usage: '#icon'

  - name: close-icon
    type: String
    values: 'Material icon name'
    description: Close button icon.
    default: cb:close
    link: null
    usage: '#closable'
EVENTS:
  - name: update:modelValue
    params: boolean
    description: Emitted when visibility changes (closable).

  - name: update:text
    params: string
    description: Emitted while editable text changes and when it is confirmed.

  - name: edit-confirm
    params: string
    description: Emitted when Enter or blur confirms the edit.

  - name: edit-cancel
    params: null
    description: Emitted when Escape or an empty blur cancels the edit.

  - name: click
    params: null
    description: Emitted on tag click.

  - name: close
    params: null
    description: Emitted when tag is closed.

  - name: s-remove
    params: boolean
    description: Emitted when a tag is removed from TagGroup.
EXPOSES: []
description: 'Tags are compact elements that represent an input, attribute, or action.'
NEWS:
  - default
  - color
  - transparent
  - variants
  - shape
  - icon
  - closable
  - group
---

# Tag

<card>

## Default

Render simple tags with optional close behavior.

<template #example>
<tag-default />
</template>

<template #template>

@[code{1-25}](../.vuepress/components/tag/default.vue)

</template>

<template #script>

@[code{27-31}](../.vuepress/components/tag/default.vue)

</template>

<template #style>

@[code{33-39}](../.vuepress/components/tag/default.vue)

</template>

</card>

<card>

## Variants

Use `variant` for visual treatments such as outline, dashed, mark, arrow, and flag. It does not control corner geometry.

<template #example>
<tag-styles />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/tag/styles.vue)

</template>

<template #style>

@[code{12-20}](../.vuepress/components/tag/styles.vue)

</template>

</card>

<card>

## Shape

Use `shape` for rounded, square, or pill geometry. Arrow remains left-round and right-pointed in pill geometry.

<template #example>
<tag-shape />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/tag/shape.vue)

</template>

<template #style>

@[code{10-16}](../.vuepress/components/tag/shape.vue)

</template>

</card>

<card>

## Size

Use `size` to fit compact controls or stronger status labels.

<template #example>
<tag-sizes />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/tag/sizes.vue)

</template>

<template #style>

@[code{9-16}](../.vuepress/components/tag/sizes.vue)

</template>

</card>

<card>

## Combinations

Combine color, tag style, round, size, and icons after reviewing each property above.

<template #example>
<tag-combinations />
</template>

<template #template>

@[code{1-24}](../.vuepress/components/tag/combinations.vue)

</template>

<template #style>

@[code{26-33}](../.vuepress/components/tag/combinations.vue)

</template>

</card>

<card>

## Color

Color tags using the Sax Design palette or custom values.

<template #example>
<tag-color />
</template>

<template #template>

@[code{1-33}](../.vuepress/components/tag/color.vue)

</template>

<template #script>

@[code{35-40}](../.vuepress/components/tag/color.vue)

</template>

<template #style>

@[code{42-48}](../.vuepress/components/tag/color.vue)

</template>

</card>

<card>

## Transparent

Use `transparent` for a lighter, outlined appearance.

<template #example>
<tag-transparent />
</template>

<template #template>

@[code{1-36}](../.vuepress/components/tag/transparent.vue)

</template>

<template #script>

@[code{38-43}](../.vuepress/components/tag/transparent.vue)

</template>

<template #style>

@[code{45-51}](../.vuepress/components/tag/transparent.vue)

</template>

</card>

<card>

## Icon

Add a leading icon with the `icon` prop.

<template #example>
<tag-icon />
</template>

<template #template>

@[code{1-40}](../.vuepress/components/tag/icon.vue)

</template>

<template #style>

@[code{42-48}](../.vuepress/components/tag/icon.vue)

</template>

</card>

<card>

## Closable

When `closable` is enabled, remove the tag from your data in the `close` event.

<template #example>
<tag-closable />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/tag/closable.vue)

</template>

<template #script>

@[code{12-25}](../.vuepress/components/tag/closable.vue)

</template>

<template #style>

@[code{27-34}](../.vuepress/components/tag/closable.vue)

</template>

</card>

<card>

## Add and Remove Items

`s-tag-group` manages tag data directly through `v-model`. The add action creates a borderless editable tag; Enter or blur confirms, Escape cancels, and each existing tag remains individually removable. Map object arrays with `label-key`, `value-key`, and `create-item`.

<template #example>
<tag-group />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/tag/group.vue)

</template>

<template #script>

@[code{13-29}](../.vuepress/components/tag/group.vue)

</template>

<template #style>

@[code{31-36}](../.vuepress/components/tag/group.vue)

</template>

</card>

<card>

### TagGroup API

| Property         | Type                              | Default    | Description                                                         |
| ---------------- | --------------------------------- | ---------- | ------------------------------------------------------------------- |
| `v-model`        | `TagGroupItem[]`                  | `[]`       | Bind tag data made of strings, numbers, or objects directly.        |
| `label-key`      | `string`                          | `label`    | Object field used as the visible tag label.                         |
| `value-key`      | `string`                          | `value`    | Object field used to create a stable rendered key.                  |
| `create-item`    | `(label: string) => TagGroupItem` | `-`        | Convert new text into a domain object; strings are used by default. |
| `color`          | `string`                          | `primary`  | Color shared by the tags and add action.                            |
| `placeholder`    | `string`                          | `''`       | Placeholder for the temporary editable tag.                         |
| `addable`        | `boolean`                         | `true`     | Show the borderless add action.                                     |
| `closable`       | `boolean`                         | `true`     | Show each tag's own close action.                                   |
| `add-icon`       | `string`                          | `cb:add`   | Add action icon.                                                    |
| `remove-icon`    | `string`                          | `cb:close` | Close icon used by each tag.                                        |
| `add-aria-label` | `string`                          | `Add tag`  | Accessible name for the add action.                                 |

Events: `update:modelValue(items)`, `add(item)`, and `remove(item, index)`. Default rendering is data-driven, so handwritten `s-tag` children are not required.

</card>
