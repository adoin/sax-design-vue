---
API_TITLES:
  PROPS: 调用参数
PROPS:
  - name: locale
    type: Language
    values: 组件语言包
    description: 弹窗及其内部控件使用的语言包。
    default: 英文
  - name: title
    type: String
    values: 弹窗标题
    description: 覆盖默认标题。
    default: 插入图标
  - name: iconList
    type: readonly string[]
    values: 已注册的 Iconify 名称
    description: 弹窗内可搜索和选择的图标集合。
    default: 168 个常用 Carbon 图标
  - name: initialIcon
    type: String
    values: prefix:name
    description: 弹窗打开时预选的图标。
    default: "''"
  - name: color
    type: String
    values: HEX / RGB / HSL
    description: 初始图标颜色。
    default: '#5667F4'
  - name: size
    type: Number
    values: 8 - 256
    description: 输出 SVG 的宽高，单位为像素。
    default: 24
  - name: label
    type: String
    values: 无障碍文本
    description: 设置后输出 role=img 与 aria-label；不设置时输出装饰图标。
    default: '-'
  - name: showName
    type: Boolean
    values: true / false
    description: 是否在图标宫格中显示名称。
    default: 'true'
  - name: showAlpha
    type: Boolean
    values: true / false
    description: 是否允许选择透明度。
    default: 'false'
  - name: predefine
    type: Array
    values: 颜色预设
    description: 传给颜色选择器的预设颜色。
    default: '[]'
  - name: maskClosable
    type: Boolean
    values: true / false
    description: 是否允许点击遮罩关闭弹窗。
    default: 'true'
  - name: confirmText / cancelText
    type: String
    values: 按钮文案
    description: 自定义确认与取消按钮文字。
    default: '-'
description: '通过 Promise 弹窗选择图标与颜色，并返回可独立保存的 SVG 代码。'
---

# 图标选择器

<card>

IconPicker 提供 Promise 风格的图标选择弹窗。调用 `SIconPicker(options)` 后，
用户可以选择图标和颜色；确认时返回完整的 SVG 字符串，取消、关闭或在服务端
环境调用时返回 `undefined`。

返回的 SVG 已包含尺寸、颜色与图形路径，可直接插入富文本、持久化存储或用于
其他 HTML 场景。后续展示不依赖 Iconify 名称、运行时注册表、缓存或 `safelist`。

```ts
import { SIconPicker } from 'sax-design-vue'

const svg = await SIconPicker({
  title: '插入图标',
  color: '#5667F4',
  size: 28,
  showAlpha: true,
})

if (svg) editor.insertHtml(svg)
```

</card>

<card>

## 富文本插入

把光标放进下面的可编辑区域，点击“插入图标”。Demo 只保存并插入 Promise
返回的 SVG，不保存图标名称。

<template #example><icon-picker-default /></template>

<template #template>

@[code](../../.vuepress/components/icon-picker/default.vue)

</template>

</card>

<card>

## 返回值与图标来源

`SIconPicker(options)`、`openIconPicker(options)` 和安装后的
`this.$iconPicker(options)` 使用同一套服务：

```ts
type IconPickerResult = Promise<string | undefined>
```

- 确认：返回完整 `<svg>...</svg>` 字符串。
- 取消、关闭：返回 `undefined`。
- `iconList` 只影响这一次弹窗里可以选择什么；一旦生成 SVG，最终内容就与图标库脱离。
- 图形路径来自构建时可信的图标数据，颜色由 ColorPicker 规范化后写入 SVG；不要把未经清理的外部 SVG 混入 `iconList`。

</card>
