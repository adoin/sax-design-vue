---
description: '选择一个或多个布尔选项。'
API_TITLES:
  GROUP_PROPS: "CheckboxGroup 属性"
  GROUP_TABS_PROPS: "CheckboxGroupTabs 属性"
PROPS:
  - name: size
    type: ComponentSize
    values: 'small | default | large'
    description: 设置或继承复选框及标签尺寸。
    default: null
  - name: disabled
    type: Boolean
    values: "true | false"
    description: 禁用复选框交互，保留当前选中或半选状态。
    default: 'false'
    usage: '#disabled'
  - name: max
    type: Number
    values: "最大选中数"
    description: 禁用选择、限制组内选中数或自定义未选中值。
    default: null
  - name: not-value
    type: String | Number | Boolean
    values: "未选中值"
    description: 禁用选择、限制组内选中数或自定义未选中值。
    default: 'false'
  - name: v-model
    type: Boolean, String, Array
    values: "boolean, string, array"
    description: 复选框绑定值与数据标识。
    default: false
    link: null
    usage: '#default'

  - name: color
    type: String
    values: "theme colors, RGB, HEX"
    description: 设置组件颜色。
    default: false
    link: null
    usage: '#color'

  - name: value
    type: String, Object
    values: "String, Object"
    description: 选中时输入框返回的值。
    default: true
    link: null
    usage: '#string-value'

  - name: loading
    type: Boolean
    values: "true, false"
    description: 添加加载动画并禁用输入框。
    default: false
    link: null
    usage: '#loading'
    code: >
      <template>
        <s-checkbox loading v-model="option">
          Loading checked
        </s-checkbox>
        <s-checkbox loading v-model="option2">
          Loading unchecked
        </s-checkbox>
      </template>

  - name: line-through
    type: Boolean
    values: "true, false"
    description: 选中时为标签添加中划线。
    default: false
    link: null
    usage: '#line-through'
    code: >
      <template>
        <s-checkbox line-through v-model="option">
          Option
        </s-checkbox>
      </template>

  - name: icon-animation
    type: String
    values: "auto, draw, pop, none"
    description: 设置自定义图标动画。auto 会绘制描边 SVG，填充图标则使用弹入揭示。
    default: auto
    link: null
    usage: '#icon'

  - name: indeterminate
    type: Boolean
    values: "true, false"
    description: 将默认图标改为表示不确定状态的横线。
    default: false
    link: null
    usage: '#indeterminate'
    code: >
      <template>
        <s-checkbox indeterminate v-model="option">
          Option
        </s-checkbox>
      </template>

  - name: label-before
    type: Boolean
    values: "true, false"
    description: 调整标签位置。
    default: false
    link: null
    usage: '#label'
    code: >
      <template>
        <s-checkbox label-before v-model="option2">
          Label Before
        </s-checkbox>
      </template>

  - name: checked
    type: Boolean
    values: "true, false"
    description: 是否初始选中；会使 v-model 的计算值为 true。
    default: false
    link: null
    usage: null
    code: >
      <template>
        <s-checkbox label-before v-model="option2">
          Checked state
        </s-checkbox>
      </template>

  - name: checked-force
    type: Boolean
    values: "true, false"
    description: 强制复选框为选中状态。
    default: false
    link: null
    usage: null
    code: >
      <template>
        <s-checkbox checkbox-force v-model="value">
          Force checked state
        </s-checkbox>
      </template>

  - name: checkbox-group
    type: Array<String | Number | Object>
    values: "null"
    description: 用于将多个复选框绑定为一组。
    default: null
    link: null
    usage: '#checkbox-group'

  - name: id
    type: string
    values: "null"
    description: 复选框 id。
    default: undefined
    link: null
    usage: null
    code: >
      <template>
        <s-checkbox v-model="value" id="framework">
          Sax Design
        </s-checkbox>
      </template>

  - name: name
    type: string
    values: "null"
    description: 复选框 name。
    default: null
    link: null
    usage: null
    code: >
      <template>
        <s-checkbox v-model="value" name="checkbox-name">
          Sax Design
        </s-checkbox>
      </template>

GROUP_PROPS:
  - name: size
    type: ComponentSize
    description: 设置或继承 CheckboxGroup 及其选项的尺寸。
    default: null
    usage: '#size'
  - name: "v-model"
    type: CheckboxGroupValueType
    description: "所有已选子项组成的扁平数组。"
    default: "[]"
    usage: "#checkbox-group"
  - name: "options"
    type: "(CheckboxGroupOption | CheckboxGroupSection)[]"
    description: "数据驱动选项；带 `options` 的项会作为可全选的分组，同一组合或页签中的子项 value 应保持唯一。"
    default: "[]"
    usage: "#checkbox-group"
  - name: "columns"
    type: "number"
    description: "默认列数，分组可通过自身 `columns` 覆盖。"
    default: "1"
    usage: "#checkbox-group"
  - name: "gap"
    type: "number | string"
    description: "行列间距。数字按像素处理。"
    default: "12"
    usage: "#checkbox-group"
  - name: "disabled-values"
    type: CheckboxGroupValueType
    description: "禁用指定子项，并在分组全选/清空时保留其值。"
    default: "[]"
    usage: "#checkbox-group"
  - name: "disabled-group-values"
    type: CheckboxGroupValueType
    description: "禁用指定分组标题的全选控制。"
    default: "[]"
    usage: "#checkbox-group"
  - name: "disabled"
    type: "boolean"
    description: "禁用整个组。"
    default: "false"
    usage: "#checkbox-group"
  - name: "min"
    type: "number"
    description: "Minimum selected value count."
    default: null
    usage: "#checkbox-group"
  - name: "max"
    type: "number"
    description: "Maximum selected value count."
    default: null
    usage: "#checkbox-group"
GROUP_TABS_PROPS:
  - name: "v-model"
    type: CheckboxGroupTabsModelValue
    description: "按页签值保存各自的选中数组。"
    default: "{}"
    usage: "#checkbox-group-tabs"
  - name: "tabs"
    type: "CheckboxGroupTab[]"
    description: "页签数据，每项包含 `label`、`value` 与 `options`。"
    default: "[]"
    usage: "#checkbox-group-tabs"
  - name: "active-key"
    type: "string | number"
    description: "当前页签。"
    default: "首个可用页签"
    usage: "#checkbox-group-tabs"
  - name: "v-model:active-key"
    type: "string | number"
    description: "当前页签。"
    default: "首个可用页签"
    usage: "#checkbox-group-tabs"
  - name: "columns"
    type: "number"
    description: "内容区默认列数。"
    default: "2"
    usage: "#checkbox-group-tabs"
  - name: "gap"
    type: "number | string"
    description: "内容区行列间距。"
    default: "12"
    usage: "#checkbox-group-tabs"
  - name: "disabled"
    type: "boolean"
    description: "禁用所有页签及选项。"
    default: "false"
    usage: "#checkbox-group-tabs"
EVENTS:
  - name: update:modelValue
    type: CheckboxModelType | CheckboxGroupValueType
    description: Checkbox 或 CheckboxGroup 的值变化时触发。
  - name: change
    type: CheckboxModelType | CheckboxGroupValueType
    description: Checkbox 或 CheckboxGroup 的值变化时触发。
  - name: update:activeKey
    type: String | Number
    description: CheckboxGroupTabs 激活其他页签时触发。
  - name: tabChange
    type: String | Number
    description: CheckboxGroupTabs 激活其他页签时触发。
  - name: CheckboxGroupTabs change
    type: '(value: CheckboxGroupTabsModelValue, activeKey: String | Number)'
    description: 页签分组选项变化后，携带完整分组值与当前页签触发。
SLOTS:
  - name: CheckboxGroup.default
    type: slot
    description: 未提供 options 时手动组合 Checkbox 子组件。
    default: null
    usage: '#checkbox-group'
  - name: CheckboxGroup.option
    type: Slot
    scope: "{ option: CheckboxGroupOption; checked: boolean }"
    description: 自定义数据驱动的选项内容。
    default: null
    usage: '#data-driven-groups'
  - name: CheckboxGroup.group-label
    type: Slot
    scope: "{ group: CheckboxGroupSection; checked: boolean; indeterminate: boolean }"
    description: 自定义分组选中控制项的标签。
    default: null
    usage: '#data-driven-groups'
  - name: CheckboxGroup.empty
    type: slot
    description: 无选项且未手动提供子控件时显示的内容。
    default: null
    usage: '#data-driven-groups'
  - name: CheckboxGroupTabs.tab
    type: Slot
    scope: "{ tab: CheckboxGroupTab; active: boolean; checked: boolean; indeterminate: boolean; selectedCount: number }"
    description: 自定义页签触发器，同时保留当前选择状态。
    default: null
    usage: '#checkbox-group-tabs'
  - name: CheckboxGroupTabs.option
    type: Slot
    scope: "{ option: CheckboxGroupOption; checked: boolean }"
    description: 自定义当前页签的选项内容。
    default: null
    usage: '#checkbox-group-tabs'
  - name: CheckboxGroupTabs.group-label
    type: Slot
    scope: "{ group: CheckboxGroupSection; checked: boolean; indeterminate: boolean }"
    description: 自定义当前页签内的分组标签。
    default: null
    usage: '#checkbox-group-tabs'
  - name: CheckboxGroupTabs.empty
    type: slot
    description: 没有活动页签时显示的内容。
    default: null
    usage: '#checkbox-group-tabs'
  - name: icon
    type: Slot
    scope: "{ checked: boolean; indeterminate: boolean }"
    description: 自定义组件图标，并获取当前选中与不确定状态。
    default: null
    link: null
    usage: '#icon'
    code: >
      <template>
        <s-checkbox v-model="option1">
          <template #icon>
            <s-icon   name="bx:check" />
          </template>
        </s-checkbox>
        <s-checkbox success v-model="option2">
          <template #icon>
            <s-icon   name="bx:check-double" />
          </template>
        </s-checkbox>
        <s-checkbox danger v-model="option3">
          <template #icon>
            <s-icon   name="bx:x" />
          </template>
        </s-checkbox>
        <s-checkbox warn v-model="option4">
          <template #icon>
            <s-icon   name="bxs:shield" />
          </template>
        </s-checkbox>
        <s-checkbox dark v-model="option5">
          <template #icon>
            <s-icon   name="bxs:heart" />
          </template>
        </s-checkbox>
        <s-checkbox color="#7d33ff" v-model="option6">
          <template #icon>
            <s-icon   name="bx:brightness" />
          </template>
        </s-checkbox>
        <s-checkbox color="rgb(59,222,200)" v-model="option7">
          <template #icon>
            <s-icon   name="bxs:paint" />
          </template>
        </s-checkbox>
      </template>

  - name: default
    type: slot
    values: "null"
    description: 为组件添加标签。
    default: null
    link: null
    usage: '#default'
    code: >
      <template>
        <s-checkbox v-model="option">
          Option
        </s-checkbox>
      </template>
---

# Checkbox 复选框

<card>

## 默认

<docs-warn />

使用 `s-checkbox` 可快速创建带动画的复选框输入。

<template #example>
<checkbox-default />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/checkbox/default.vue)

</template>

<template #script>

@[code{6-10}](../../.vuepress/components/checkbox/default.vue)

</template>

</card>

<card>

## 尺寸

对比组件继承后的 `small`、`default`、`large` 三档尺寸。

<template #example><checkbox-zh-size /></template>

<template #template>

@[code{7-13}](../../.vuepress/components/checkbox-zh/size.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/checkbox-zh/size.vue)

</template>

<template #style>

@[code{15-22}](../../.vuepress/components/checkbox-zh/size.vue)

</template>

</card>

<card>

## 禁用

设置 `disabled` 可禁用交互。禁用态使用灰色填充和内凹阴影，并保留已选中或半选标记；悬停时不会上浮。与正常状态并排对照：

<template #example>
<checkbox-zh-disabled />
</template>

<template #template>

@[code{8-18}](../../.vuepress/components/checkbox-zh/disabled.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/checkbox-zh/disabled.vue)

</template>

<template #style>

@[code{20-27}](../../.vuepress/components/checkbox-zh/disabled.vue)

</template>

</card>

<card>

## 颜色

通过 `color` 设置组件颜色，支持主题色、RGB、HEX。

<template #example>
<checkbox-color />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/checkbox/color.vue)

</template>

<template #script>

@[code{12-22}](../../.vuepress/components/checkbox/color.vue)

</template>

</card>

<card>

## 布尔值

默认使用布尔值：选中时返回 `true`，未选中时返回 `false`。

<template #example>
<checkbox-boolean />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/checkbox/boolean.vue)

</template>

<template #script>

@[code{11-16}](../../.vuepress/components/checkbox/boolean.vue)

</template>

<template #style>

@[code{18-24}](../../.vuepress/components/checkbox/boolean.vue)

</template>

</card>

<card>

## 字符串值

需要在选中时返回字符串，可通过 `value` 设置返回值。

<template #example>
<checkbox-string />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/checkbox/string.vue)

</template>

<template #script>

@[code{13-17}](../../.vuepress/components/checkbox/string.vue)

</template>

<template #style>

@[code{19-31}](../../.vuepress/components/checkbox/string.vue)

</template>

</card>

<card>

## 复选框组

复选框组用于绑定多个复选框，并根据选中状态标识对应选项。

通过绑定数组类型的 v-model 管理组内多个复选框。每个选项的 `label` 对应数组中的值；数组包含该值时选中，否则未选中。未提供插槽内容时，`label` 也会作为按钮后的描述展示。

<template #example>
<checkbox-array />
</template>

<template #template>

@[code{1-15}](../../.vuepress/components/checkbox/array.vue)

</template>

<template #script>

@[code{17-21}](../../.vuepress/components/checkbox/array.vue)

</template>

<template #style>

@[code{23-37}](../../.vuepress/components/checkbox/array.vue)

</template>

</card>

<card>

## 数据驱动分组

传入 `options` 后，`CheckboxGroup` 会直接渲染选项和分组。分组标题可控制组内全选，部分选中时自动展示半选状态；禁用项不会被分组全选覆盖。`columns` 控制每组的列数，小屏会自动回落为单列。

<template #example>
<checkbox-advanced-group />
</template>

<template #template>

@[code{31-36}](../../.vuepress/components/checkbox/advanced-group.vue)

</template>

<template #script>

@[code{1-29}](../../.vuepress/components/checkbox/advanced-group.vue)

</template>

<template #style>

@[code{38-47}](../../.vuepress/components/checkbox/advanced-group.vue)

</template>

</card>

<card>

## 分组页签

`CheckboxGroupTabs` 适合“平台 + 平台内分组选项”这样的连续选择。页签前的复选框控制整个平台的全选或清空，点击页签文字只切换内容，不会改变选中值。当前页签使用背景、颜色与阴影区分，全程不使用边框。

<template #example>
<checkbox-platform-tabs />
</template>

<template #template>

@[code{95-99}](../../.vuepress/components/checkbox/platform-tabs.vue)

</template>

<template #script>

@[code{1-93}](../../.vuepress/components/checkbox/platform-tabs.vue)

</template>

<template #style>

@[code{101-105}](../../.vuepress/components/checkbox/platform-tabs.vue)

</template>

</card>

<card>

## 对象值

CheckboxGroup 可将对象作为选项值；下方会显示当前选中的对象数组。

<template #example>
<checkbox-object />
</template>

<template #template>

@[code{1-34}](../../.vuepress/components/checkbox/object.vue)

</template>

<template #script>

@[code{35-44}](../../.vuepress/components/checkbox/object.vue)

</template>

<template #style>

@[code{45-66}](../../.vuepress/components/checkbox/object.vue)

</template>

</card>

<card>

## 图标

通过 `icon` 插槽自定义复选框内部图标。选中后图标统一使用白色前景；
描边 SVG 会自动播放路径绘制动画，填充图标则使用缩放与裁剪揭示。
可通过 `icon-animation` 指定 `draw`、`pop` 或 `none`，插槽同时提供
`checked` 与 `indeterminate`，便于实现完全自定义的状态动画。

<utils-icon />

<template #example>
<checkbox-icon />
</template>

<template #template>

@[code{1-52}](../../.vuepress/components/checkbox/icon.vue)

</template>

<template #script>

@[code{54-64}](../../.vuepress/components/checkbox/icon.vue)

</template>

<template #style>

@[code{65-76}](../../.vuepress/components/checkbox/icon.vue)

</template>

</card>

<card>

## 标签

通过组件默认插槽为复选框添加标签。

<template #example>
<checkbox-label />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/checkbox/label.vue)

</template>

<template #script>

@[code{7-12}](../../.vuepress/components/checkbox/label.vue)

</template>

<template #style>

@[code{13-18}](../../.vuepress/components/checkbox/label.vue)

</template>

</card>

<card>

## 加载

通过 `loading` 属性为组件添加加载状态。

<template #example>
<checkbox-loading />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/checkbox/loading.vue)

</template>

<template #script>

@[code{8-13}](../../.vuepress/components/checkbox/loading.vue)

</template>

<template #style>

@[code{15-20}](../../.vuepress/components/checkbox/loading.vue)

</template>

</card>

<card>

## 中划线

通过 `line-through` 在复选框选中时为标签添加中划线。

<template #example>
<checkbox-line-through />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/checkbox/line-through.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/checkbox/line-through.vue)

</template>

</card>

<card>

## 不确定

存在多个复选框且需要一个统一管理项时，可使用 `indeterminate` 为该复选框添加不确定状态样式。

<template #example>
<checkbox-indeterminate />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/checkbox/indeterminate.vue)

</template>

<template #script>

@[code{6-10}](../../.vuepress/components/checkbox/indeterminate.vue)

</template>

</card>
