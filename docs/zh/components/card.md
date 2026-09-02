---
description: '用灵活的内容表面组织媒体、正文、操作与交互状态。'
PROPS:
  - name: title
    type: String
    values: String
    description: 卡片标题；title 插槽优先。
    default: null
    usage: '#默认'
  - name: subtitle
    type: String
    values: String
    description: 标题下方的辅助文本。
    default: null
    usage: '#默认'
  - name: text
    type: String
    values: String
    description: 卡片描述；text 插槽优先。
    default: null
    usage: '#默认'
  - name: color
    type: String
    values: Sax Design 颜色 | RGB | HEX
    description: 彩色表面与交互效果使用的语义强调色。
    default: primary
    usage: '#扩展表面样式'
  - name: variant
    type: String
    values: elevated | outlined | soft | solid | plain | glass
    description: 表面样式，与布局和交互行为彼此独立。
    default: null
    usage: '#扩展表面样式'
  - name: orientation
    type: String
    values: vertical | horizontal
    description: 垂直或水平排列媒体与内容。
    default: null
    usage: '#排列方向'
  - name: hover-effect
    type: String
    values: none | lift | glow
    description: 鼠标悬停与键盘聚焦时的视觉反馈。
    default: null
    usage: '#悬停效果'
  - name: shape
    type: String
    values: rounded | square
    description: 卡片圆角形态，可继承 ConfigProvider 的全局配置。
    default: rounded
    usage: '#外形'
  - name: interactive
    type: Boolean
    values: true | false
    description: 为可点击卡片添加按钮语义与键盘焦点。
    default: 'false'
    usage: '#悬停效果'
  - name: selectable
    type: Boolean
    values: true | false
    description: 让卡片成为可切换的选择表面。
    default: 'false'
    usage: '#选择与加载'
  - name: selected
    type: Boolean
    values: true | false
    description: 受控选中状态，支持 v-model:selected。
    default: 'false'
    usage: '#选择与加载'
  - name: loading
    type: Boolean
    values: true | false
    description: 显示稳定的骨架屏并禁用交互。
    default: 'false'
    usage: '#选择与加载'
  - name: type
    type: String
    values: classic | overlay | split | frosted | reveal | profile | metric | article
    description: 选择一套有明确语义的完整卡片预设；数字 1-5 仅作为兼容别名保留。
    default: classic
    usage: '#文章卡片'
EVENTS:
  - name: update:selected
    type: Boolean
    description: 可选择卡片请求改变选中状态时触发。
  - name: select
    type: Boolean, MouseEvent
    description: 选中后携带新状态与触发事件。
SLOTS:
  - name: default
    type: slot
    values: 'null'
    description: 自定义正文内容。
    default: null
  - name: header
    type: slot
    values: 'null'
    description: 自定义卡片头部。
    default: null
  - name: extra
    type: slot
    values: 'null'
    description: 添加位于头部末端的内容。
    default: null
  - name: media
    type: slot
    values: 'null'
    description: 为结构化卡片布局添加图片或视频媒体。
    default: null
  - name: title
    type: slot
    values: 'null'
    description: 自定义标题。
    default: null
  - name: subtitle
    type: slot
    values: 'null'
    description: 自定义副标题。
    default: null
  - name: text
    type: slot
    values: 'null'
    description: 自定义描述。
    default: null
  - name: footer
    type: slot
    values: 'null'
    description: 替换完整底部区域。
    default: null
  - name: actions
    type: slot
    values: 'null'
    description: 为结构化卡片布局添加底部操作。
    default: null
  - name: interactions
    type: slot
    values: 'null'
    description: 在媒体区域上方添加控件。
    default: null
  - name: img
    type: slot
    values: 'null'
    description: 为预设卡片添加图片或视频内容。
    default: null
  - name: buttons
    type: slot
    values: 'null'
    description: 为预设卡片添加按钮。
    default: null
---

# Card（卡片）

<card>

## 默认

`classic` 是默认预设，适合常见的图片、文字与操作布局。

<template #example>
<card-zh-default />
</template>

<template #template>

@[code{1-22}](../../.vuepress/components/card-zh/default.vue)

</template>

<template #style>

@[code{24-35}](../../.vuepress/components/card-zh/default.vue)

</template>

</card>

<card>

## 图片叠层

设置 `type="overlay"`，让文字在图片上渐进浮现。

<template #example>
<card-zh-type2 />
</template>

<template #template>

@[code{1-24}](../../.vuepress/components/card-zh/type2.vue)

</template>

<template #style>

@[code{26-37}](../../.vuepress/components/card-zh/type2.vue)

</template>

</card>

<card>

## 横向分栏

设置 `type="split"`，使用紧凑的图文横向分栏布局。

<template #example>
<card-zh-type3 />
</template>

<template #template>

@[code{1-24}](../../.vuepress/components/card-zh/type3.vue)

</template>

<template #style>

@[code{26-37}](../../.vuepress/components/card-zh/type3.vue)

</template>

</card>

<card>

## 毛玻璃说明

设置 `type="frosted"`，在沉浸式图片上显示半透明说明面板。

<template #example>
<card-zh-type4 />
</template>

<template #template>

@[code{1-24}](../../.vuepress/components/card-zh/type4.vue)

</template>

<template #style>

@[code{26-37}](../../.vuepress/components/card-zh/type4.vue)

</template>

</card>

<card>

## 居中浮现

设置 `type="reveal"`，让居中的说明面板从图片下方浮现。

<template #example>
<card-zh-type5 />
</template>

<template #template>

@[code{1-24}](../../.vuepress/components/card-zh/type5.vue)

</template>

<template #style>

@[code{26-37}](../../.vuepress/components/card-zh/type5.vue)

</template>

</card>

<card>

## 人物资料

`profile` 提供头像、身份信息、关键数据和操作区，组成一张完整的人物资料卡。

<template #example>
<card-zh-profile />
</template>

<template #template>

@[code{1-25}](../../.vuepress/components/card-zh/profile.vue)

</template>

<template #style>

@[code{27-45}](../../.vuepress/components/card-zh/profile.vue)

</template>

</card>

<card>

## 数据指标

`metric` 用清晰的层级组织主指标、变化趋势、小型图表与目标进度。

<template #example>
<card-zh-metric />
</template>

<template #template>

@[code{1-32}](../../.vuepress/components/card-zh/metric.vue)

</template>

<template #script>

@[code{34-36}](../../.vuepress/components/card-zh/metric.vue)

</template>

<template #style>

@[code{38-70}](../../.vuepress/components/card-zh/metric.vue)

</template>

</card>

<card>

## 文章卡片

`article` 组合响应式配图、内容元数据、作者信息与明确的阅读操作。

<template #example>
<card-zh-article />
</template>

<template #template>

@[code{1-25}](../../.vuepress/components/card-zh/article.vue)

</template>

<template #style>

@[code{27-44}](../../.vuepress/components/card-zh/article.vue)

</template>

</card>

<card>

## 扩展表面样式

八种具名 `type` 是 Card 的主要预设。只有需要明确组合表面效果时，才使用 `variant` 扩展能力。

<template #example>
<card-zh-variants />
</template>

<template #template>

@[code{12-23}](../../.vuepress/components/card-zh/variants.vue)

</template>

<template #script>

@[code{1-10}](../../.vuepress/components/card-zh/variants.vue)

</template>

<template #style>

@[code{25-46}](../../.vuepress/components/card-zh/variants.vue)

</template>

</card>

<card>

## 悬停效果

卡片默认保持静态。整张卡片需要执行操作时，添加 `interactive` 获取键盘语义，并选择 `lift` 或 `glow`。

<template #example>
<card-zh-hover-effects />
</template>

<template #template>

@[code{1-28}](../../.vuepress/components/card-zh/hover-effects.vue)

</template>

<template #style>

@[code{30-38}](../../.vuepress/components/card-zh/hover-effects.vue)

</template>

</card>

<card>

## 排列方向

使用 `horizontal` 将媒体放在内容侧面；窄屏下会自动恢复为垂直排列。

<template #example>
<card-zh-orientation />
</template>

<template #template>

@[code{1-31}](../../.vuepress/components/card-zh/orientation.vue)

</template>

<template #style>

@[code{33-40}](../../.vuepress/components/card-zh/orientation.vue)

</template>

</card>

<card>

## 选择与加载

`selectable` 通过 `v-model:selected` 支持受控选择；加载状态在禁止交互的同时保持卡片尺寸稳定。

<template #example>
<card-zh-states />
</template>

<template #template>

@[code{7-23}](../../.vuepress/components/card-zh/states.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/card-zh/states.vue)

</template>

<template #style>

@[code{25-33}](../../.vuepress/components/card-zh/states.vue)

</template>

</card>

<card>

## 外形

可以为单个卡片设置 `shape="square"`，也可以继承 `s-config-provider` 的全局配置。

<template #example>
<card-zh-shape />
</template>

<template #template>

@[code{1-16}](../../.vuepress/components/card-zh/shape.vue)

</template>

<template #style>

@[code{18-26}](../../.vuepress/components/card-zh/shape.vue)

</template>

</card>

<card>

## 组合

需要横向滚动排列卡片时使用 `s-card-group`；它不会改变单个卡片的样式。

<template #example>
<card-zh-group />
</template>

<template #template>

@[code{1-26}](../../.vuepress/components/card-zh/group.vue)

</template>

<template #style>

@[code{28-39}](../../.vuepress/components/card-zh/group.vue)

</template>

</card>
