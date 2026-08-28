---
description: '在一组关联选项中选择唯一值。'
PROPS:
  - name: v-model / model-value
    type: String | Number | Boolean
    values: 已选单选值
    description: 绑定单选项或单选组的选中值。
    default: '-'
  - name: color
    type: String
    values: Theme colors, RGB, HEX
    description: 设置单选框颜色。
    default: primary
    link: null
    usage: '#color'
    code: null

  - name: disabled
    type: Boolean
    values: true,false
    description: 是否禁用组件。
    default: false
    link: null
    usage: '#default'
    code: null

  - name: loading
    type: Boolean
    values: true,false
    description: 是否显示加载动画并禁用组件。
    default: false
    link: null
    usage: '#loading'
    code: null

  - name: icon-animation
    type: String
    values: auto, draw, pop, none
    description: 设置自定义中心图标动画；描边 SVG 自动绘制，填充图标使用弹入动画。
    default: auto
    link: null
    usage: '#icon'
    code: null

  - name: value
    type: String | Number | Boolean
    values: 单选项值
    description: 当前单选项对应的值。
    default: "''"
    link: null
    usage: '#default'
    code: null

EVENTS:
  - name: update:modelValue / change
    type: RadioValue
    description: Radio、RadioGroup 或 RadioButton 的值变化时触发。
  - name: update:activeKey / tabChange
    type: String | Number
    description: RadioGroupTabs 激活其他页签时触发。
  - name: RadioGroupTabs change
    type: '(value: RadioGroupTabsModelValue, activeKey: String | Number)'
    description: 页签分组选项变化后，携带完整分组值与当前页签触发。
SLOTS:
  - name: default
    type: slot
    values: null
    description: 为组件添加标签。
    default: null
    link: null
    usage: '#label'
    code: null

  - name: icon
    type: slot
    values: checked
    description: 替换选中态中心 SVG，并获取当前选中状态。
    default: null
    link: null
    usage: '#icon'
    code: null
---

# Radio（单选框）

<card>

## 基础、分组、页签与按钮

<docs-warn />

`Radio` 是基础单选项；`RadioGroup` 管理一组唯一值；`RadioGroupTabs` 在多个页签中分别保留一项选择；设置 `type="button"` 后则使用无边框 `RadioButton` 分段样式。四种形态都沿用清晰的 `v-model` 数据流。

<template #example>
<radio-patterns />
</template>

<template #template>

@[code{56-94}](../../.vuepress/components/radio/patterns.vue)

</template>

<template #script>

@[code{1-54}](../../.vuepress/components/radio/patterns.vue)

</template>

<template #style>

@[code{96-142}](../../.vuepress/components/radio/patterns.vue)

</template>

</card>

<card>

## 颜色

<coloren />

<template #example>
<radio-color />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/radio/color.vue)

</template>

<template #script>

@[code{13-17}](../../.vuepress/components/radio/color.vue)

</template>

<template #style>

@[code{18-26}](../../.vuepress/components/radio/color.vue)

</template>

</card>

<card>

## 标签 <Badge text="New"/>

通过默认插槽为单选框添加标签；需要将标签放到前侧时，可使用 `label-before` 属性。

<template #example>
<radio-label />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/radio/label.vue)

</template>

<template #script>

@[code{8-12}](../../.vuepress/components/radio/label.vue)

</template>

<template #style>

@[code{13-21}](../../.vuepress/components/radio/label.vue)

</template>

</card>

<card>

## 加载 <Badge text="New"/>

加载时复用 Button 的呼吸光轨：底部高光沿整个单选项由左向右移动；此时交互行为等同于 `disabled`。

<template #example>
<radio-loading />
</template>

<template #template>

@[code{7-12}](../../.vuepress/components/radio/loading.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/radio/loading.vue)

</template>

<template #style>

@[code{14-20}](../../.vuepress/components/radio/loading.vue)

</template>

</card>

<card>

## 图标 <Badge text="New"/>

外圆和默认中心圆使用同一个 SVG 坐标系绘制，不依赖 input 或定位计算。通过 `icon` 插槽可替换选中态中心 SVG；插槽提供 `checked`。`icon-animation="auto"` 会自动识别描边 SVG 并播放路径绘制动画，填充图标则使用弹入动画，也可显式设置 `draw`、`pop` 或 `none`。

<template #example>
<radio-icons />
</template>

<template #template>

@[code{1-60}](../../.vuepress/components/radio/icons.vue)

</template>

<template #script>

@[code{62-66}](../../.vuepress/components/radio/icons.vue)

</template>

<template #style>

@[code{67-80}](../../.vuepress/components/radio/icons.vue)

</template>

</card>

<card>

### RadioGroup

| 属性              | 类型                          | 默认值    | 说明                                                                 |
| ----------------- | ----------------------------- | --------- | -------------------------------------------------------------------- |
| `v-model`         | `string \| number \| boolean` | `''`      | 组内唯一选中值。                                                     |
| `options`         | `RadioOption[]`               | `[]`      | 数据驱动选项。每项支持 `label`、`value`、`description`、`disabled`。 |
| `type`            | `default \| button`           | `default` | 基础 Radio 或无边框 RadioButton 形态。                               |
| `columns`         | `number`                      | `1`       | 普通数据分组的列数；小屏自动回落为单列。                             |
| `gap`             | `number \| string`            | `8`       | 选项间距，数字按像素处理。                                           |
| `disabled-values` | `RadioValue[]`                | `[]`      | 按值禁用指定选项。                                                   |
| `disabled`        | `boolean`                     | `false`   | 禁用整个组。                                                         |
| `name`            | `string`                      | 自动生成  | 原生 Radio 的共享名称，用于键盘方向键切换。                          |

事件：`update:modelValue(value)`、`change(value)`。插槽：`option`、`empty`；不传 `options` 时，默认插槽中的 `Radio` 或 `RadioButton` 会自动接入组模型。

### RadioGroupTabs

| 属性         | 类型                         | 默认值       | 说明                                                             |
| ------------ | ---------------------------- | ------------ | ---------------------------------------------------------------- |
| `v-model`    | `Record<string, RadioValue>` | `{}`         | 按页签值保存每个面板的单选结果。                                 |
| `tabs`       | `RadioGroupTab[]`            | `[]`         | 页签及其 `options`；页签支持 `disabled`、`columns`、禁用值配置。 |
| `active-key` | `string \| number`           | 首个可用页签 | 当前面板；支持 `v-model:active-key`。                            |
| `columns`    | `number`                     | `2`          | 页签未单独指定时的面板列数。                                     |
| `gap`        | `number \| string`           | `12`         | 面板选项间距。                                                   |
| `disabled`   | `boolean`                    | `false`      | 禁用整个页签分组。                                               |

事件：`update:modelValue(value)`、`change(value, activeKey)`、`update:activeKey(key)`、`tabChange(key)`。插槽：`tab`、`option`、`empty`。页签支持方向键、`Home` 和 `End` 导航。

### RadioButton

`RadioButton` 推荐通过 `<s-radio-group type="button" />` 使用；直接组合时仍支持 `v-model`、`value`、`label`、`description`、`disabled` 与 `name`。选中态使用圆形单选标记、颜色、表面与阴影共同表达，不依赖边框。

</card>
