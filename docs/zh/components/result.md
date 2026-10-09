---
description: "展示操作结果、提示信息与后续操作。"
PROPS:
  - name: status
    type: String
    values: "success | warning | error | info"
    description: "语义结果状态，默认插画与颜色随状态变化。"
    default: "info"
    usage: '#success'
  - name: title
    type: String
    values: "text"
    description: "结果标题；title 插槽优先。"
    default: null
    usage: '#custom-content'
  - name: description
    type: String
    values: "text"
    description: "辅助说明；默认插槽优先于文字属性。"
    default: null
    usage: '#success'
  - name: content
    type: String
    values: "text"
    description: "description 的兼容字段；同时传入时优先使用 description。"
    default: null
    usage: '#custom-content'
  - name: size
    type: ComponentSize
    values: "small | default | large"
    description: "尺寸，省略时继承全局配置；同时调整插画、文字与间距。"
    default: null
    usage: '#sizes'
  - name: layout
    type: String
    values: "vertical | horizontal"
    description: "纵向居中或横向布局；横向布局在窄屏下自动折叠。"
    default: "vertical"
    usage: '#horizontal-layout'
  - name: animated
    type: Boolean
    values: "true | false"
    description: "默认插画首次进入视口时播放一次入场动画，完成后保持静止；减少动态效果时使用静态图案。"
    default: true
    usage: '#animation'
SLOTS:
  - name: icon
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "替换默认图案，作为标题的装饰内容。"
    usage: '#custom-content'
  - name: title
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "替换标题。"
    usage: '#custom-content'
  - name: default
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "替换说明，可提供块级或富文本内容。"
    usage: '#custom-content'
  - name: details
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "说明下方的结构化详情。"
    usage: '#custom-content'
  - name: extra
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "后续操作区，支持多个按钮自然换行。"
    usage: '#custom-content'
---

# Result（结果）

<card>

## 成功

用 success 呈现已完成的操作。extra 插槽承载后续按钮；按钮行为由调用方决定。

<template #example><result-zh-default /></template>

<template #template>

@[code{7-23}](../../.vuepress/components/result-zh/default.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/result-zh/default.vue)

</template>

<template #style>

@[code{25-64}](../../.vuepress/components/result-zh/default.vue)

</template>

</card>

<card>

## 信息提示

用 info 展示无需警告的结果提示，也可通过操作按钮确认当前信息。

<template #example><result-zh-info /></template>

<template #template>

@[code{7-23}](../../.vuepress/components/result-zh/info.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/result-zh/info.vue)

</template>

<template #style>

@[code{25-64}](../../.vuepress/components/result-zh/info.vue)

</template>

</card>

<card>

## 警告

用 warning 提醒用户继续前检查信息。示例通过状态更新，将确认后的结果切换为成功。

<template #example><result-zh-warning /></template>

<template #template>

@[code{7-23}](../../.vuepress/components/result-zh/warning.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/result-zh/warning.vue)

</template>

<template #style>

@[code{25-64}](../../.vuepress/components/result-zh/warning.vue)

</template>

</card>

<card>

## 错误

用 error 呈现未完成的操作，并提供重试等后续入口。示例展示重试确认后的提示状态。

<template #example><result-zh-error /></template>

<template #template>

@[code{7-23}](../../.vuepress/components/result-zh/error.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/result-zh/error.vue)

</template>

<template #style>

@[code{25-64}](../../.vuepress/components/result-zh/error.vue)

</template>

</card>

<card>

## 尺寸

small、default、large 同时调整插画、标题和内容间距，省略 size 时继承全局尺寸。

<template #example><result-zh-sizes /></template>

<template #template>

@[code{10-24}](../../.vuepress/components/result-zh/sizes.vue)

</template>

<template #script>

@[code{1-8}](../../.vuepress/components/result-zh/sizes.vue)

</template>

<template #style>

@[code{26-65}](../../.vuepress/components/result-zh/sizes.vue)

</template>

</card>

<card>

## 横向布局

layout="horizontal" 将图案放在内容旁边，适合页面内的结果反馈；窄屏时回到上下排列。

<template #example><result-zh-horizontal /></template>

<template #template>

@[code{7-22}](../../.vuepress/components/result-zh/horizontal.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/result-zh/horizontal.vue)

</template>

<template #style>

@[code{24-63}](../../.vuepress/components/result-zh/horizontal.vue)

</template>

</card>

<card>

## 自定义内容

分别使用 icon、title、默认内容、details 和 extra 插槽定制结果。details 适合结构化说明；操作区会自然换行。

<template #example><result-zh-custom /></template>

<template #template>

@[code{7-36}](../../.vuepress/components/result-zh/custom.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/result-zh/custom.vue)

</template>

<template #style>

@[code{38-77}](../../.vuepress/components/result-zh/custom.vue)

</template>

</card>

<card>

## 动画控制

animated 控制默认插画的单次入场动画。重新挂载可以再次播放，减少动态效果时保持静态；自定义 icon 插槽的动效由调用方负责。

<template #example><result-zh-animation /></template>

<template #template>

@[code{8-27}](../../.vuepress/components/result-zh/animation.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/result-zh/animation.vue)

</template>

<template #style>

@[code{29-68}](../../.vuepress/components/result-zh/animation.vue)

</template>

</card>
