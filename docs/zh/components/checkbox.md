---
description: "选择一个或多个布尔选项。"
PROPS:
  - name: disabled / max / not-value
    type: Boolean / Number / String | Number | Boolean
    values: true | false / 最大选中数 / 未选中值
    description: 禁用选择、限制组内选中数或自定义未选中值。
    default: 'false / - / false'
  - name: v-model
    type: Boolean, String, Array
    values: boolean, string, array
    description: 复选框绑定值与数据标识。
    default: false
    link: null
    usage: '#default'

  - name: color
    type: String
    values: theme colors, RGB, HEX
    description: 设置组件颜色。
    default: false
    link: null
    usage: '#color'

  - name: value
    type: String, Object
    values: String, Object
    description: 选中时输入框返回的值。
    default: true
    link: null
    usage: '#string-value'

  - name: loading
    type: Boolean
    values: true, false
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
    values: true, false
    description: 选中时为标签添加中划线。
    default: false
    link: null
    usage: '#linethrough'
    code: >
      <template>
        <s-checkbox line-through v-model="option">
          Option
        </s-checkbox>
      </template>

  - name: icon-animation
    type: String
    values: auto, draw, pop, none
    description: 设置自定义图标动画。auto 会绘制描边 SVG，填充图标则使用弹入揭示。
    default: auto
    link: null
    usage: '#icon'

  - name: indeterminate
    type: Boolean
    values: true, false
    description: 将默认图标改为表示不确定状态的横线。
    default: false
    link: null
    usage: '#Indeterminate'
    code: >
      <template>
        <s-checkbox indeterminate v-model="option">
          Option
        </s-checkbox>
      </template>

  - name: label-before
    type: Boolean
    values: true, false
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
    values: true, false
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
    values: true, false
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
    values: null
    description: 用于将多个复选框绑定为一组。
    default: null
    link: null
    usage: '#checkbox-group'

  - name: id
    type: string
    values: null
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
    values: null
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

SLOTS:
  - name: icon
    type: slot
    values: checked, indeterminate
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
    values: null
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

@[code{1-5} vue{3}](../../.vuepress/components/checkbox/default.vue)

</template>

<template #script>

@[code{6-10}](../../.vuepress/components/checkbox/default.vue)

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

</card>

<card>

## 数据驱动分组

传入 `options` 后，`CheckboxGroup` 会直接渲染选项和分组。分组标题可控制组内全选，部分选中时自动展示半选状态；禁用项不会被分组全选覆盖。`columns` 控制每组的列数，小屏会自动回落为单列。

<template #example>
<checkbox-advanced-group />
</template>

<template #template>

@[code](../../.vuepress/components/checkbox/advanced-group.vue)

</template>

</card>

<card>

## 分组页签

`CheckboxGroupTabs` 适合“平台 + 平台内分组选项”这样的连续选择。页签前的复选框控制整个平台的全选或清空，点击页签文字只切换内容，不会改变选中值。当前页签使用背景、颜色与阴影区分，全程不使用边框。

<template #example>
<checkbox-platform-tabs />
</template>

<template #template>

@[code](../../.vuepress/components/checkbox/platform-tabs.vue)

</template>

</card>

<card>

<template #example>
<checkbox-object />
</template>

<template #template>

@[code{1-34}](../../.vuepress/components/checkbox/object.vue)

</template>

<template #script>

@[code{35-44}](../../.vuepress/components/checkbox/object.vue)

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

@[code{1-39}](../../.vuepress/components/checkbox/icon.vue)

</template>

<template #script>

@[code{41-51}](../../.vuepress/components/checkbox/icon.vue)

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

</card>

<card>

## 加载 <Badge text="New"/>

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

## 不确定 <Badge text="New"/>

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

<card>

## API

### CheckboxGroup

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `CheckboxValue[]` | `[]` | 所有已选子项组成的扁平数组。 |
| `options` | `(CheckboxGroupOption \| CheckboxGroupSection)[]` | `[]` | 数据驱动选项；带 `options` 的项会作为可全选的分组。 |
| `columns` | `number` | `1` | 默认列数，分组可通过自身 `columns` 覆盖。 |
| `gap` | `number \| string` | `12` | 行列间距。数字按像素处理。 |
| `disabled-values` | `CheckboxValue[]` | `[]` | 禁用指定子项，并在分组全选/清空时保留其值。 |
| `disabled-group-values` | `CheckboxValue[]` | `[]` | 禁用指定分组标题的全选控制。 |
| `disabled` | `boolean` | `false` | 禁用整个组。 |
| `min` / `max` | `number` | `-` | 限制最少或最多选中数量。 |

`CheckboxGroupOption` 支持 `label`、`value`、`disabled`、`description`；`CheckboxGroupSection` 支持 `label`、`value`、`options`、`disabled`、`columns`。
同一个 CheckboxGroup 或页签内的子项 `value` 应保持唯一。

事件：`update:modelValue(value)`、`change(value)`。插槽：`option`、`group-label`、`empty`，不传 `options` 时默认插槽仍兼容原有的手写 Checkbox 用法。

### CheckboxGroupTabs

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `Record<string, CheckboxValue[]>` | `{}` | 按页签值保存各自的选中数组。 |
| `tabs` | `CheckboxGroupTab[]` | `[]` | 页签数据，每项包含 `label`、`value` 与 `options`。 |
| `active-key` / `v-model:active-key` | `string \| number` | 首个可用页签 | 当前页签。 |
| `columns` | `number` | `2` | 内容区默认列数。 |
| `gap` | `number \| string` | `12` | 内容区行列间距。 |
| `disabled` | `boolean` | `false` | 禁用所有页签及选项。 |

事件：`update:modelValue(value)`、`change(value, activeKey)`、`update:activeKey(activeKey)`、`tabChange(activeKey)`。插槽：`tab`、`option`、`group-label`、`empty`。

</card>
