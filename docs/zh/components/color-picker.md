---
PROPS:
  - name: model-value/v-model
    type: String
    values: hex / rgb / rgba / hsl / hsla
    description: 当前颜色值。
    default: '#5667f4'
  - name: show-alpha
    type: Boolean
    values: true / false
    description: 开启透明度调节。
    default: 'false'
  - name: predefine
    type: Array
    values: Array&lt;{ name, value }&gt; / string[]
    description: 带名称的预置色；色值支持 HEX、RGB(A)、HSL(A)，并兼容字符串数组。
    default: '[]'
  - name: format
    type: String
    values: hex / rgb / hsl
    description: 初始编辑与输出格式，也可在面板内切换。
    default: hex
EVENTS:
  - name: change
    description: 选择或修改颜色时触发。
description: '颜色选择器。'
---

# Color picker 颜色选择器

<card>

点击触发器会直接打开完整取色面板。可调整饱和度、明度、色相与透明度，
也可使用屏幕取色笔，并在 HEX、RGB(A)、HSL(A) 三种通道编辑方式间切换，
主面板本身不再依赖浏览器原生取色器。
取色笔会优先使用 EyeDropper API；API 不可用或调用失败时，自动降级到
浏览器原生颜色选择器。

<template #example><color-picker-default /></template>

<template #template>

@[code{1-9}](../../.vuepress/components/color-picker/default.vue)

</template>

<template #script>

@[code{11-22}](../../.vuepress/components/color-picker/default.vue)

</template>

<template #style>

@[code{24-30}](../../.vuepress/components/color-picker/default.vue)

</template>

</card>
