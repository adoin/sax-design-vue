---
description: '通过校验和状态反馈采集单行文本。'
PROPS:
  - name: align / block / disabled / editable / readonly / shape / text-white
    type: String / Boolean
    values: 对齐、交互状态和外观选项
    description: 控制输入框对齐、宽度、禁用、编辑状态和视觉样式。
    default: '-'
  - name: allow-clear / clearable
    type: Boolean
    values: true | false
    description: 输入框悬停或聚焦时在尾部显示清空按钮；clearable 作为兼容别名保留。
    default: false
    usage: '#清空'
  - name: count-method / max-length / show-word-count
    type: Function / Number / Boolean
    values: '({ value }) => number / Number / true | false'
    description: 开启后在 suffix 区显示计数；自定义统计方法会同时用于计数显示和长度限制，可实现 UTF-8 字节或其他编码统计。
    default: '- / - / false'
    usage: '#字符计数'
  - name: wrap-classes / wrap-styles
    type: String | Object | Array
    values: 容器类名或样式
    description: 配置输入框外层容器的类名和样式。
    default: '-'
  - name: v-model
    type: String, Number
    values: String, Number
    description: 绑定值。
    default: null
    link: null
    usage: '#default'

  - name: placeholder
    type: String
    values: String
    description: 输入框占位文本。
    default: null
    link: null
    usage: '#default'

  - name: label
    type: String
    values: String
    description: 组件上方标签文本。
    default: null
    link: null
    usage: '#label'
    code: >
      <template>
        <s-input
          label="Name"
          placeholder="Evan You"
        />
      </template>
  - name: label-float
    type: String
    values: String
    description: 将占位文本在聚焦或有值时转换为标签。
    default: null
    link: null
    usage: '#label-float'
    code: >
      <template>
        <s-input
          label="Country"
          label-float
          v-model="value"
        />
      </template>
  - name: color
    type: String
    values: theme colors, RGB, HEX
    description: 设置组件颜色。
    default: null
    link: null
    usage: '#color'
    code: >
      <template>
        <s-input
          color="primary"
          placeholder="Primary"
        />

        <s-input
          color="success"
          placeholder="Success"
        />

        <s-input
          color="danger"
          placeholder="Danger"
        />

        <s-input
          color="warn"
          placeholder="Warn"
        />

        <s-input
          color="dark"
          placeholder="Dark"
        />

        <s-input
          color="#7d33ff"
          placeholder="HEX"
        />

        <s-input
          color="rgb(59,222,200)"
          placeholder="HEX"
        />
      </template>

  - name: state
    type: String
    values: theme colors, RGB, HEX
    description: 通过状态改变组件背景颜色。
    default: null
    link: null
    usage: '#state'

  - name: progress
    type: Number
    values: 0 - 100
    description: 进度条值，颜色从红色渐变至绿色。
    default: null
    link: null
    usage: '#progress'
    code: null
  - name: loading
    type: Boolean
    values: Boolean
    description: 为输入框添加加载动画。
    default: null
    link: null
    usage: '#loading'
    code: >
      <template>
        <div class="center content-inputs">
          <s-input loading v-model="value" placeholder="Name" />
        </div>
      </template>

  - name: type
    type: InputType
    values: text | password | search | number | email | tel | url
    description: 设置文本类输入类型；日期与时间分别使用 DatePicker、TimePicker。
    default: text
    link: null
    usage: '#input-types'
    code: null

  - name: border
    type: Boolean
    values: Boolean
    description: 设置组件样式。
    default: false
    link: null
    usage: '#border'

  - name: shadow
    type: Boolean
    values: Boolean
    description: 设置组件样式。
    default: false
    link: null
    usage: '#shadow'

  - name: icon-after
    type: Boolean
    values: Boolean
    description: 后缀图标组件。
    default: false
    link: null
    usage: '#icon'

  - name: show-password
    type: boolean
    values: boolean
    description: 密码类型输入框是否提供密码显示切换。
    default: false
    link: null
    usage: '#progress'

  - name: size
    type: String
    values: small | default | large
    description: 设置输入框尺寸。
    default: default
    usage: '#尺寸'

  - name: immediate
    type: Boolean
    values: true | false
    description: 控制输入时立即更新，或在 change、blur 时提交。
    default: true
    usage: '#延迟提交'

  - name: controls
    type: Boolean
    values: true | false
    description: 显示内置搜索或密码操作按钮。
    default: false
    usage: '#搜索'

  - name: prefix-icon / suffix-icon / prefix-config / suffix-config
    type: String / Object
    values: 图标名称 / '{ icon, content, status }'
    description: 配置轻量前后缀图标或文字；同名插槽优先级最高。
    default: '-'
    usage: '#前后缀'

  - name: min-length / min / max / step / input-mode / pattern / required / multiple
    type: Number | String / Boolean
    values: 原生 input 约束
    description: 透传常用原生约束，并将数字输入限制在配置的 min–max 范围内。
    default: '-'
    usage: '#原生约束'

EVENTS:
  - name: update:modelValue / input
    type: String | Number
    description: 输入值变化时触发。
  - name: change / lazy-change
    type: String
    description: 原生变更提交或配置的延迟更新提交时触发。
  - name: focus / blur
    type: FocusEvent
    description: 输入框获得或失去焦点时触发。
  - name: clear
    description: 点击清空操作并重置值后触发。
  - name: click / clickIcon / prefix-click / suffix-click
    type: MouseEvent | Event
    description: 点击输入区域或前后缀图标操作时触发。
  - name: keydown / keyup / wheel
    type: KeyboardEvent | WheelEvent
    description: 透传键盘和滚轮交互事件。
  - name: mouseenter / mouseleave
    type: MouseEvent
    description: 指针进入或离开输入框容器时触发。
  - name: search-click
    type: '(value: String, event: KeyboardEvent | MouseEvent)'
    description: 通过搜索图标或键盘提交搜索时触发。
  - name: toggle-visible
    type: Boolean
    description: 密码可见状态变化时触发。
SLOTS:
  - name: icon
    type: Slot
    values: null
    description: 为输入框添加图标。
    default: null
    link: null
    usage: '#icon'

  - name: message
    type: Slot
    values: message-success, message-danger, message-warn
    description: 在输入框下方添加提示文本。
    default: null
    link: null
    usage: '#message'
  - name: prefix / suffix
    type: Slot
    values: 'suffix: { count, limit }'
    description: 自定义输入框前后缀；suffix 插槽会替换默认计数器，并提供当前计数和限制值。
    default: null
    usage: '#前后缀'
---

# Input 输入框

<card>

## 默认

<docs-warn />

使用 `s-input` 快速创建单行文本输入框。

<template #example>
<input-default />
</template>

<template #template>

@[code{1-5} html{3}](../../.vuepress/components/input/default.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/input/default.vue)

</template>

</card>

<card>

## 清空

设置 `allow-clear` 后，输入框悬停或聚焦时会在尾部显示清空按钮；按 Escape 也可以清空当前值。

<template #example>
<input-clearable />
</template>

<template #template>

@[code{7-16} html{10}](../../.vuepress/components/input/clearable.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/input/clearable.vue)

</template>

</card>

<card>

## 标签

通过 `label` 属性为输入框添加标签。

<template #example>
<input-label />
</template>

<template #template>

@[code{1-5} html{3}](../../.vuepress/components/input/label.vue)

</template>

<template #script>

@[code{6-10}](../../.vuepress/components/input/label.vue)

</template>

</card>

<card>

## 浮动标签

通过 `label-float` 可让占位文本在聚焦或有值时以动画变为输入框上方标签。

<template #example>
<input-label-float />
</template>

<template #template>

@[code{1-5} html{3}](../../.vuepress/components/input/label-float.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/input/label-float.vue)

</template>

</card>

<card>

## 颜色

通过 `color` 设置组件颜色并添加底部边框，支持主题色、**RGB** 与 **HEX**。

<template #example>
<input-color />
</template>

<template #template>

@[code{1-39} html{3,5,13,24,36}](../../.vuepress/components/input/color.vue)

</template>

<template #script>

@[code{40-50}](../../.vuepress/components/input/color.vue)

</template>

</card>

<card>

## 图标

通过 `icon` 插槽可为输入框添加图标；使用 `icon-before` 可将图标放到输入框前侧。

<utils-icon />

<template #example>
<input-icon />
</template>

<template #template>

@[code{1-20} html{4,15}](../../.vuepress/components/input/icon.vue)

</template>

<template #script>

@[code{21-26}](../../.vuepress/components/input/icon.vue)

</template>

</card>

<card>

## 提示信息

通过 `#message-{color}` 插槽可在输入框下方提示必填、格式错误等信息。

<template #example>
<input-message />
</template>

<template #template>

@[code{1-26} html{4,8,12,20-21}](../../.vuepress/components/input/message.vue)

</template>

<template #script>

@[code{28-39}](../../.vuepress/components/input/message.vue)

</template>

</card>

<card>

## 状态

可根据状态改变输入框颜色，支持 `primary`、`success`、`danger`、`warn`、`dark`。

<template #example>
<input-state />
</template>

<template #template>

@[code{1-31} html{12}](../../.vuepress/components/input/state.vue)

</template>

<template #script>

@[code{33-41}](../../.vuepress/components/input/state.vue)

</template>

</card>

<card>

## 进度

添加校验进度条，常用于校验密码强度和输入数据；值范围为 0 至 100。

:::tip
此示例校验密码至少包含：

- 一个特殊字符
- 超过 6 个字符
- 一个小写字母
- 一个大写字母
- 一个数字
  :::

<template #example>
<input-progress />
</template>

<template #template>

@[code{1-22} html{7}](../../.vuepress/components/input/progress.vue)

</template>

<template #script>

@[code{23-57}](../../.vuepress/components/input/progress.vue)

</template>

</card>

<card>

## 加载

通过 `loading` 添加输入框加载动画；该属性为 Boolean，可直接添加。

<template #example>
<input-loading />
</template>

<template #template>

@[code{1-5} html{3}](../../.vuepress/components/input/loading.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/input/loading.vue)

</template>

</card>

<card>

## 输入类型

`type` 只负责文本类输入，可选 `text`、`password`、`search`、`number`、
`email`、`tel` 和 `url`。日期与时间请使用 `SDatePicker`、`STimePicker`，
以保持格式化、主题色和弹出层交互一致。

<template #example>
<input-types />
</template>

<template #template>

@[code{1-19} html{4-10,14-16}](../../.vuepress/components/input/types.vue)

</template>

<template #script>

@[code{20-35}](../../.vuepress/components/input/types.vue)

</template>

</card>

<card>

## 边框与阴影

通过 `input-style` 设置组件整体样式；可选值为 `border`、`shadow`、`transparent`。

<template #example>
<input-style />
</template>

<template #template>

@[code{1-31} html{3,8,22}](../../.vuepress/components/input/style.vue)

</template>

<template #script>

@[code{33-50}](../../.vuepress/components/input/style.vue)

</template>

</card>

<card>

## 前后缀

通过 `prefix-icon`、`suffix-icon` 添加输入框前后缀图标。需要完全自定义内容时，可使用同名插槽。

<template #example>
<input-affix />
</template>

<template #template>

@[code{8-21} html{10-19}](../../.vuepress/components/input/affix.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/input/affix.vue)

</template>

</card>

<card>

## 尺寸

通过 `size` 设置小号、默认或大号输入框。

<template #example>
<input-size />
</template>

<template #template>

@[code{1-7} html{3-5}](../../.vuepress/components/input/size.vue)

</template>

</card>

<card>

## 搜索

设置 `type="search"` 和 `controls` 显示搜索操作。按 Enter 或点击搜索按钮都会触发 `search-click`。

<template #example>
<input-search />
</template>

<template #template>

@[code{12-25} html{14-20}](../../.vuepress/components/input/search.vue)

</template>

<template #script>

@[code{1-10}](../../.vuepress/components/input/search.vue)

</template>

</card>

<card>

## 延迟提交

设置 `immediate="false"` 后，输入值会在 change 或 blur 时才同步到 `v-model`。输入后点击外部，可观察已提交值的变化。

<template #example>
<input-deferred />
</template>

<template #template>

@[code{7-19} html{9-17}](../../.vuepress/components/input/deferred.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/input/deferred.vue)

</template>

</card>

<card>

## 字符计数

通过 `max-length` 限制输入并使用 `show-word-count` 显示计数。`count-method` 可同时自定义计数显示和长度限制，第二个输入框按 UTF-8 字节计数。

<template #example>
<input-count />
</template>

<template #template>

@[code{11-27} html{13-25}](../../.vuepress/components/input/count.vue)

</template>

<template #script>

@[code{1-9}](../../.vuepress/components/input/count.vue)

</template>

</card>

<card>

## 原生约束

`min`、`max`、`step`、`input-mode`、`pattern` 和 `required` 等常用原生约束会透传到内部 input。数字输入还会将键入或粘贴的值限制在配置的 `min`–`max` 范围内。

<template #example>
<input-constraints />
</template>

<template #template>

@[code{7-19} html{8-18}](../../.vuepress/components/input/constraints.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/input/constraints.vue)

</template>

</card>
