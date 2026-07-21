---
PROPS:
  - name: v-model / model-value
    type: String | Date
    values:
    description: 绑定时间值
    default: false
    link: null
    usage: '#default'
    code: null
---

# Time picker

<card>

## 默认

使用 Time Picker 通过时/分/秒滚轮选择任意时间。

::: tip
在 SSR（如 [Nuxt](https://nuxt.com/)）或 SSG（如 [VitePress](https://vitepress.dev/)）中使用时，需要用
<code>\<client-only\> \<\/client-only\></code>
包裹。
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
