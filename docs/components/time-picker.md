---
PROPS:
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
