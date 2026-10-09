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
    values: "top | top-start | top-end | bottom | bottom-start | bottom-end | left | left-start | left-end | right | right-start | right-end"
    description: 首选方向。未设置时，根据可视裁剪区域依次尝试上、下、右、左；均无法容纳时选择溢出最少的方向。显式设置时以该方向作为初始首选。
    default: null
  - name: flip
    type: Boolean | Object
    values: "true | false | FlipOptions"
    description: 启用空间不足时的方向切换，或配置候选方向和裁剪边界。false 保持首选方向。
    default: '{}'
  - name: shift
    type: Boolean | Object
    values: "true | false | ShiftOptions"
    description: 沿选定方向调整对齐位置，尽量保持在可视裁剪区域内。false 禁用此调整。
    default: '{}'
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
  - name: close-on-click-outside
    type: Boolean
    values: "true | false"
    description: 点击浮层外部时关闭。设为 false 后改为右上角关闭控件。
    default: 'true'
  - name: outside-click-ignore
    type: Array
    values: "CSS 选择器"
    description: 外部点击判定中视为浮层内部的选择器。
    default: '[]'
  - name: close-on-reference-hidden
    type: Boolean
    values: "true | false"
    description: 触发器离开视口时关闭。设为 false 可保持本次明确打开的会话。
    default: 'true'
  - name: show-close
    type: Boolean
    values: "true | false"
    description: 显示右上角关闭控件。close-on-click-outside 为 false 时默认开启。
    default: null
  - name: translucent
    type: Boolean
    values: "true | false"
    description: 让浮层半透明，以便看到下方界面。
    default: 'false'
  - name: v-model:translucent
    type: Boolean
    values: "true | false"
    description: 指针或键盘回到浮层时恢复不透明。
    default: 'false'
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

# Popper 弹出层

<card>

## 默认

浮层默认提供内边距、圆角和主题阴影，可在 `content` 插槽中放入说明或操作。点击触发按钮打开，点击外部关闭。

未设置 `placement` 时优先显示在上方，可视空间不足时自动选择其他方向。滚动或调整窗口大小会重新定位。设置 `placement` 可指定初始方向，设置 `:flip="false"` 可禁用方向切换。

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
