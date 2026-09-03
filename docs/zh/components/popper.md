---
description: '将浮层内容定位到触发元素附近。'
PROPS:
  - name: loading
    type: Boolean
    values: "true | false / 生命周期守卫"
    description: 显示加载反馈，并在打开或关闭前执行拦截。
    default: 'false'
  - name: process-before-open
    type: Function
    values: "true | false / 生命周期守卫"
    description: 显示加载反馈，并在打开或关闭前执行拦截。
    default: '() => true'
  - name: process-before-close
    type: Function
    values: "true | false / 生命周期守卫"
    description: 显示加载反馈，并在打开或关闭前执行拦截。
    default: '() => true'
  - name: v-model:visible
    type: Boolean
    values: "true | false"
    description: 控制浮层内容是否显示。
    default: 'null'
  - name: visible
    type: Boolean
    values: "true | false"
    description: 控制浮层内容是否显示。
    default: 'null'
  - name: trigger
    type: String | String[]
    values: "hover | focus | click | contextmenu"
    description: 打开 Popper 的触发事件。
    default: hover
  - name: placement
    type: String
    values: "floating-ui placement | pixels | absolute | fixed"
    description: 配置浮层内容的位置。
    default: 'bottom'
  - name: offset
    type: Number | Object
    values: "floating-ui placement | pixels | absolute | fixed"
    description: 配置浮层内容的位置。
    default: '12'
  - name: strategy
    type: String
    values: "floating-ui placement | pixels | absolute | fixed"
    description: 配置浮层内容的位置。
    default: 'absolute'
  - name: disabled
    type: Boolean
    values: "true | false"
    description: 控制可用性、箭头、挂载位置和生命周期。
    default: 'false'
  - name: show-arrow
    type: Boolean
    values: "true | false"
    description: 控制可用性、箭头、挂载位置和生命周期。
    default: 'true'
  - name: teleported
    type: Boolean
    values: "true | false"
    description: 控制可用性、箭头、挂载位置和生命周期。
    default: 'true'
  - name: persistent
    type: Boolean
    values: "true | false"
    description: 控制可用性、箭头、挂载位置和生命周期。
    default: 'false'
  - name: content
    type: String
    values: "text or HTML"
    description: 不使用 content 插槽时提供浮层内容。
    default: null
  - name: raw-content
    type: Boolean
    values: "text or HTML"
    description: 不使用 content 插槽时提供浮层内容。
    default: 'false'
  - name: popper-class
    type: String | Object | Array
    values: "CSS values"
    description: 自定义浮层内容和层级。
    default: "''"
  - name: popper-style
    type: String | Object | Array
    values: "CSS values"
    description: 自定义浮层内容和层级。
    default: "''"
  - name: z-index
    type: Number
    values: "CSS values"
    description: 自定义浮层内容和层级。
    default: null
EVENTS:
  - name: before-show
    description: 在可见性生命周期内触发。
  - name: show
    description: 在可见性生命周期内触发。
  - name: before-hide
    description: 在可见性生命周期内触发。
  - name: hide
    description: 在可见性生命周期内触发。
SLOTS:
  - name: default
    type: slot
    values: "null"
    description: Popper 触发与参考元素。
    default: null
    link: null
    usage: '#default'
    code: null

  - name: content
    type: slot
    values: "null"
    description: 自定义内容。
    default: null
    link: null
    usage: '#default'
    code: >
---

# Popper（弹出层）

<card>

## 默认

浮层默认提供内边距、圆角和主题阴影，可在 `content` 插槽中放入说明或操作。点击触发按钮打开，点击外部关闭。

<template #example>
<popper-zh-default />
</template>

<template #template>

@[code{1-14}](../../.vuepress/components/popper-zh/default.vue)

</template>

<template #style>

@[code{16-31}](../../.vuepress/components/popper-zh/default.vue)

</template>

</card>

<card>

## 下拉操作

通用下拉内容统一使用 Popper。迁移原 Pulldown 用法时，将 `v-model` 换为 `v-model:visible`，将 `dropdown` 插槽换为 `content`；选中操作后将可见状态设为 `false` 即可关闭。下例仅展示选择结果，不会执行项目操作。

<template #example>
<popper-zh-dropdown />
</template>

<template #template>

@[code{14-39}](../../.vuepress/components/popper-zh/dropdown.vue)

</template>

<template #script>

@[code{1-12}](../../.vuepress/components/popper-zh/dropdown.vue)

</template>

<template #style>

@[code{41-68}](../../.vuepress/components/popper-zh/dropdown.vue)

</template>

</card>
