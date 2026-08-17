---
description: 'Select a time value with an editable input and time columns.'
PROPS:
  - name: color / size / label-float / label
    type: String / Boolean
    values: Theme color / small | default | large / label text
    description: Customize the trigger color, density, and floating label.
    default: '-'
    link: null
    usage: '#default'
  - name: format / clearable
    type: String / Boolean
    values: Day.js tokens / true | false
    description: Format and clear the selected time.
    default: 'HH:mm:ss / true'
    link: null
    usage: '#default'
  - name: disabled-hours / disabled-minutes / disabled-seconds / time-config
    type: Function / Object
    values: disabled time units and column configuration
    description: Restrict time choices and configure the time columns.
    default: '-'
    link: null
    usage: '#default'
  - name: v-model / model-value
    type: String | Date
    values:
    description: binding time value
    default: false
    link: null
    usage: '#default'
    code: null
---

# Time picker

<card>

## Default

Use Time Picker for arbitrary time input with hour/minute/second spinners.

::: tip
This component requires the
<code>\<client-only\> \<\/client-only\></code>
wrap when used in SSR (eg: [Nuxt](https://nuxt.com/)) and SSG (eg: [VitePress](https://vitepress.dev/)).
:::

<template #example>
<time-picker-default />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/time-picker/default.vue)

</template>

<template #script>

@[code{13-17}](../.vuepress/components/time-picker/default.vue)

</template>

</card>

<card>

## API

</card>
