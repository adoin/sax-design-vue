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
  - name: output
    type: String
    values: svg / code
    description: 控制 Promise 返回完整 SVG，或包含 code、color、size 的精简对象。
    default: svg
  - name: color
    type: String
    values: HEX / RGB / HSL
    description: 初始图标颜色。
    default: '#5667F4'
  - name: size
    type: Number
    values: 8 - 256
    description: 固定输出尺寸；不传时由用户在弹窗内选择。
    default: 弹窗选择，初始为 24
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
description: '通过 Promise 弹窗选择图标、颜色与尺寸，按需返回图标代码或完整 SVG。'
---

# 图标选择器

<card>

IconPicker 提供 Promise 风格的图标选择弹窗。`output: 'svg'` 返回完整 SVG
字符串；`output: 'code'` 返回包含图标代码、颜色和尺寸的精简对象。取消、关闭或在
服务端环境调用时返回 `undefined`。

传入 `size` 会固定输出尺寸；不传时，用户可以直接在弹窗中选择 8–256 px 的尺寸。

```ts
import { SIconPicker } from 'sax-design-vue'

const svg = await SIconPicker({
  title: '插入图标',
  output: 'svg',
  color: '#5667F4',
  showAlpha: true,
})

if (svg) editor.insertHtml(svg)

const icon = await SIconPicker({ output: 'code' })
// { code: 'cb:rocket', color: '#5667F4', size: 24 }
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

## 返回格式与图标来源

`SIconPicker(options)`、`openIconPicker(options)` 和安装后的
`this.$iconPicker(options)` 使用同一套服务：

```ts
interface IconPickerCodeResult {
  code: string
  color: string
  size: number
}
```

- `output: 'svg'`：返回完整 `<svg>...</svg>` 字符串，可直接插入 HTML，后续展示不依赖图标运行时。
- `output: 'code'`：返回 `IconPickerCodeResult`，数据更精简，后续展示需要对应的图标库。
- 取消、关闭：返回 `undefined`。
- `iconList` 控制这一次弹窗中可选择的图标。
- 图形路径来自构建时可信的图标数据，颜色由 ColorPicker 规范化后写入 SVG；不要把未经清理的外部 SVG 混入 `iconList`。

</card>
