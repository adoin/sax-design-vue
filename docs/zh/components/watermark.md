---
description: "明水印与截图溯源暗水印。"
PROPS:
  - name: content
    type: String
    values: "text"
    description: "明水印文字；支持换行。默认也用作暗水印标识。"
    default: null
  - name: mode
    type: String
    values: "visible, blind, both"
    description: "明水印、暗水印或两者叠加。"
    default: "visible"
  - name: blind-content
    type: String
    values: "text"
    description: "独立的暗水印标识，建议由业务传入用户或会话编号；未设置时使用 content。"
    default: null
  - name: blind-strength
    type: Number
    values: "1 - 16"
    description: "暗水印色通道变化幅度；越大越易显影，也越容易被察觉。"
    default: 2
  - name: gap
    type: Number
    values: "0 - 1000"
    description: "水印平铺间距，单位 px。"
    default: 96
  - name: opacity
    type: Number
    values: "0 - 1"
    description: "仅控制明水印透明度，不影响暗水印。"
    default: 0.12
  - name: rotate
    type: Number
    values: "-360 - 360"
    description: "每块水印的旋转角度。"
    default: -18
  - name: font-size
    type: Number
    values: "8 - 96"
    description: "水印字号，单位 px。"
    default: 13
  - name: color
    type: String
    values: "CSS color"
    description: "明水印颜色，默认使用项目 HSL 文本色。"
    default: null
  - name: z-index
    type: Number
    values: "number"
    description: "容器内部的水印层级。"
    default: 10
---

# Watermark 水印

<card>

## 明水印

文字按容器大小自动重复，覆盖内容且不拦截鼠标操作。可调整间距、角度、字号、颜色和透明度。

<template #example>
<watermark-zh-default />
</template>

<template #template>

@[code{6-14}](../../.vuepress/components/watermark-zh/default.vue)

</template>

<template #script>

@[code{1-4}](../../.vuepress/components/watermark-zh/default.vue)

</template>

<template #style>

@[code{16-21}](../../.vuepress/components/watermark-zh/default.vue)

</template>

</card>

<card>

## 暗水印与截图显影

设置 `mode="blind"`，通过极小的色通道差异叠加标识；`mode="both"` 同时显示明水印。通过 `blind-content` 传入用户或会话编号，显影后可人工读取该标识，用于关联业务记录。组件不会自动采集身份，也不检测截图动作。

截取下方文档区域，保存原始 PNG，然后点击“选择截图显影”。`revealWatermark(file, { gain: 32 })` 在浏览器本地返回显影 PNG 的 data URL，不上传图片。示例只使用演示编号，不包含真实个人信息。

这是页面色差信号的显影，不是加密或自动身份认证。原始 PNG、平坦背景更容易辨认；复杂彩色背景会干扰显影，JPEG 压缩、缩放、滤镜或拍照可能破坏信号。它也不能阻止使用者修改页面后再截图。暗水印区域默认使用主题背景色，传入自定义背景时请保持不透明。

<template #example>
<watermark-zh-blind />
</template>

<template #template>

@[code{27-62}](../../.vuepress/components/watermark-zh/blind.vue)

</template>

<template #script>

@[code{1-25}](../../.vuepress/components/watermark-zh/blind.vue)

</template>

<template #style>

@[code{64-86}](../../.vuepress/components/watermark-zh/blind.vue)

</template>

</card>
