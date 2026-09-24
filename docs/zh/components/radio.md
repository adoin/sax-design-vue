---
description: '在一组关联选项中选择唯一值。'
API_TITLES:
  GROUP_PROPS: "RadioGroup 属性"
  GROUP_TABS_PROPS: "RadioGroupTabs 属性"
  BUTTON_PROPS: "RadioButton 属性"
PROPS:
  - name: size
    type: ComponentSize
    values: 'small | default | large'
    description: 设置或继承单选控件尺寸；Radio Group 会传给后代控件。
    default: null
  - name: v-model
    type: String | Number | Boolean
    values: '已选单选值'
    description: 绑定单选项或单选组的选中值。
    default: null
  - name: model-value
    type: String | Number | Boolean
    values: '已选单选值'
    description: 绑定单选项或单选组的选中值。
    default: null
  - name: color
    type: String
    values: 'Theme colors, RGB, HEX'
    description: 设置单选框颜色。
    default: primary
    link: null
    usage: '#color'
    code: null

  - name: disabled
    type: Boolean
    values: 'true,false'
    description: 禁用单选框交互，保留当前选中状态。
    default: false
    link: null
    usage: '#disabled'
    code: null

  - name: loading
    type: Boolean
    values: 'true,false'
    description: 是否显示加载动画并禁用组件。
    default: false
    link: null
    usage: '#loading'
    code: null

  - name: icon-animation
    type: String
    values: 'auto, draw, pop, none'
    description: 设置自定义中心图标动画；描边 SVG 自动绘制，填充图标使用弹入动画。
    default: auto
    link: null
    usage: '#icon'
    code: null

  - name: value
    type: String | Number | Boolean
    values: '单选项值'
    description: 当前单选项对应的值。
    default: "''"
    link: null
    usage: '#default'
    code: null

GROUP_PROPS:
  - name: size
    type: ComponentSize
    description: 设置或继承 RadioGroup 及其选项的尺寸。
    default: null
    usage: '#size'
  - name: "v-model"
    type: RadioValue
    description: "组内唯一选中值。"
    default: "''"
    usage: "#default"
  - name: "options"
    type: "RadioOption[]"
    description: "数据驱动选项。每项支持 `label`、`value`、`description`、`disabled`。"
    default: "[]"
    usage: "#default"
  - name: "type"
    type: "default | button"
    description: "基础 Radio 或无边框 RadioButton 形态。"
    default: "default"
    usage: "#default"
  - name: "columns"
    type: "number"
    description: "普通数据分组的列数；小屏自动回落为单列。"
    default: "1"
    usage: "#default"
  - name: "gap"
    type: "number | string"
    description: "选项间距，数字按像素处理。"
    default: "8"
    usage: "#default"
  - name: "disabled-values"
    type: "RadioValue[]"
    description: "按值禁用指定选项。"
    default: "[]"
    usage: "#default"
  - name: "disabled"
    type: "boolean"
    description: "禁用整个组。"
    default: "false"
    usage: "#default"
  - name: "name"
    type: "string"
    description: "原生 Radio 的共享名称，用于键盘方向键切换。"
    default: "自动生成"
    usage: "#default"
GROUP_TABS_PROPS:
  - name: "v-model"
    type: RadioGroupTabsModelValue
    description: "按页签值保存每个面板的单选结果。"
    default: "{}"
    usage: "#default"
  - name: "tabs"
    type: "RadioGroupTab[]"
    description: "页签及其 `options`；页签支持 `disabled`、`columns`、禁用值配置。"
    default: "[]"
    usage: "#default"
  - name: "active-key"
    type: "string | number"
    description: "当前面板；支持 `v-model:active-key`。"
    default: "首个可用页签"
    usage: "#default"
  - name: "v-model:active-key"
    type: RadioGroupTabValue
    description: 当前页签键的双向绑定。
    default: null
    usage: '#default'
  - name: "columns"
    type: "number"
    description: "页签未单独指定时的面板列数。"
    default: "2"
    usage: "#default"
  - name: "gap"
    type: "number | string"
    description: "面板选项间距。"
    default: "12"
    usage: "#default"
  - name: "disabled"
    type: "boolean"
    description: "禁用整个页签分组。"
    default: "false"
    usage: "#default"
BUTTON_PROPS:
  - name: v-model
    type: RadioButtonValue
    description: 直接使用 RadioButton 时双向绑定的选中值。
    default: null
    usage: '#default'
  - name: model-value
    type: RadioButtonValue
    description: 不使用 v-model 语法时设置选中值。
    default: null
    usage: '#default'
  - name: value
    type: RadioButtonValue
    description: 当前按钮代表的选项值。
    default: "''"
    usage: '#default'
  - name: label
    type: 'String | Number | Boolean'
    description: 可见的选项标签。
    default: "''"
    usage: '#default'
  - name: description
    type: String
    description: 标签下方的辅助说明。
    default: "''"
    usage: '#default'
  - name: disabled
    type: Boolean
    description: 禁用当前按钮但保留选中状态。
    default: false
    usage: '#default'
  - name: name
    type: String
    description: 直接组合按钮时共用的原生 radio 名称。
    default: "''"
    usage: '#default'
EVENTS:
  - name: update:modelValue
    type: RadioValue
    description: Radio、RadioGroup 或 RadioButton 的值变化时触发。
  - name: change
    type: RadioValue
    description: Radio、RadioGroup 或 RadioButton 的值变化时触发。
  - name: update:activeKey
    type: String | Number
    description: RadioGroupTabs 激活其他页签时触发。
  - name: tabChange
    type: String | Number
    description: RadioGroupTabs 激活其他页签时触发。
  - name: RadioGroupTabs change
    type: '(value: RadioGroupTabsModelValue, activeKey: String | Number)'
    description: 页签分组选项变化后，携带完整分组值与当前页签触发。
SLOTS:
  - name: RadioGroup.default
    type: slot
    description: 未提供 options 时手动组合 Radio 或 RadioButton 子组件。
    default: null
    usage: '#default'
  - name: RadioGroup.option
    type: Slot
    scope: "{ option: RadioOption; checked: boolean }"
    description: 自定义数据驱动的单选项内容。
    default: null
    usage: '#default'
  - name: RadioGroup.empty
    type: slot
    description: 无选项且未手动提供子控件时显示的内容。
    default: null
    usage: '#default'
  - name: RadioGroupTabs.tab
    type: Slot
    scope: "{ tab: RadioGroupTab; active: boolean; selected: boolean; selectedOption?: RadioOption }"
    description: 根据激活和选中状态自定义页签触发器。
    default: null
    usage: '#default'
  - name: RadioGroupTabs.option
    type: Slot
    scope: "{ option: RadioOption; checked: boolean }"
    description: 自定义当前页签的选项内容。
    default: null
    usage: '#default'
  - name: RadioGroupTabs.empty
    type: slot
    description: 没有活动页签时显示的内容。
    default: null
    usage: '#default'
  - name: default
    type: slot
    values: 'null'
    description: 为组件添加标签。
    default: null
    link: null
    usage: '#label'
    code: null

  - name: icon
    type: Slot
    scope: "{ checked: boolean }"
    description: 替换选中态中心 SVG，并获取当前选中状态。
    default: null
    link: null
    usage: '#icon'
    code: null
---

# Radio 单选框

<card>

## 默认

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

## 尺寸

对比组件继承后的 `small`、`default`、`large` 三档尺寸。

<template #example><radio-zh-size /></template>

<template #template>

@[code{7-13}](../../.vuepress/components/radio-zh/size.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/radio-zh/size.vue)

</template>

<template #style>

@[code{15-22}](../../.vuepress/components/radio-zh/size.vue)

</template>

</card>

<card>

## 禁用

设置 `disabled` 可禁用交互，并保留当前选中状态。正常状态使用浅色表面和柔和投影，悬停时只让圆形控件轻微上浮；禁用状态使用灰色填充和内凹阴影，圆点仍清晰可辨，标签和整行不会移动。

<template #example>
<radio-zh-disabled />
</template>

<template #template>

@[code{7-20}](../../.vuepress/components/radio-zh/disabled.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/radio-zh/disabled.vue)

</template>

<template #style>

@[code{22-29}](../../.vuepress/components/radio-zh/disabled.vue)

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

## 标签

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

## 加载

加载时使用共用的 Sax 标志加载器替换单选控件，标签位置保持不变；此时交互行为等同于 `disabled`。

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

## 图标

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
