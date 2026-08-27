---
description: '从可搜索选项列表中选择一个或多个值。'
PROPS:
  - name: v-model / model-value / not-value / label-float
    type: String | Number | Array / Boolean
    values: 选项值、空值和标签浮动状态
    description: 绑定选中值、配置空值并控制标签浮动。
    default: '-'
  - name: block / clearable / fit / hide-scrollbar / native-scrollbar / shape / strategy
    type: Boolean / String
    values: 字段尺寸、外观和弹层定位选项
    description: 控制字段宽度、清空操作、下拉滚动条和弹层策略。
    default: '-'
  - name: filter-config / filter-method / remote / remote-config / remote-method
    type: Object / Function / Boolean
    values: 本地筛选和远程数据配置
    description: 配置本地筛选或异步远程选项。
    default: '-'
  - name: popup-config / show-after / hide-after / loading-text / no-data-text / no-match-text
    type: Object / Number / String
    values: width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style
    description: 配置弹层宽高、跟随触发器、位置、挂载目标、类名和行内样式，以及加载、空数据和无匹配状态。
    default: '-'
  - name: color
    type: Color
    values: Theme colors, RGB, HEX
    description: 设置组件颜色。
    default: primary
    link: null
    usage: '#color'
    code: null
  - name: loading
    type: Boolean
    values: true, false
    description: 是否处于加载状态，并显示加载动画。
    default: false
    link: null
    usage: '#loading'
    code: null
  - name: flip
    state:
      text: New
    type: Boolean
    values: true, false
    description: 自动调整选项面板位置以保持可见。
    default: true
    link: null
    usage: '#default'
    code: null
  - name: teleported
    state:
      text: New
    type: Boolean
    values: true, false
    description: 是否将下拉面板传送至 body。
    default: false
    link: null
    usage: null
    code: null
  - name: placeholder
    type: String
    values: String
    description: 设置组件占位文本。
    default: null
    link: null
    usage: '#default'
    code: null
  - name: label
    type: String
    values: String
    description: 为选择框添加标签。
    default: null
    link: null
    usage: '#label'
    code: null
  - name: label-placeholder
    type: String
    values: String
    description: 设置在聚焦或有值时变为标签的占位文本。
    default: null
    link: null
    usage: '#label'
    code: null
  - name: filter
    type: Boolean
    values: true, false
    description: 启用选项筛选。
    default: false
    link: null
    usage: '#filter'
    code: null
  - name: default-first-option
    state:
      text: New
    type: Boolean
    values: true, false
    description: 按 Enter 选择首个匹配项，需配合 `filter` 使用。
    default: false
    link: null
    usage: '#filter'
    code: null
  - name: allow-create
    state:
      text: New
    type: Boolean
    values: true, false
    description: 是否允许创建新选项；使用时 `filter` 必须为 true。
    default: false
    link: null
    usage: '#filter'
    code: null
  - name: multiple
    type: Boolean
    values: true, false
    description: 启用多选。
    default: false
    link: null
    usage: '#multiple'
    code: null
  - name: multiple-limit
    state:
      text: New
    type: Number
    values: number
    description: '`multiple` 为 true 时可选的最大数量；设为 0 时不限数量。'
    default: 0
    link: null
    usage: '#multiple'
    code: null
  - name: state
    type: String
    values: Theme colors
    description: 使用指定颜色设置组件状态。
    default: false
    link: null
    usage: '#state'
    code: null
  - name: disabled
    type: Boolean
    values: true, false
    description: 是否禁用组件。
    default: false
    link: null
    usage: null
    code: null
  - name: collapse-chips
    type: Boolean
    values: true, false
    description: 多选时根据剩余宽度自适应折叠放不下的标签，并以 `+N` 显示剩余数量。
    default: true
    link: null
    usage: '#multiple'
    code: null
  - name: max-collapse-chips
    state:
      text: New
    type: Number
    values: number
    description: collapse-chips 为 true 时可见标签的可选上限；设为 0 时仅根据可用宽度计算。
    default: 0
    link: null
    usage: '#multiple'
    code: null
  - name: virtual / virtual-config
    state:
      text: New
    type: Boolean / Object
    values: threshold | estimateSize | overscan | dynamic
    description: 对平铺的 options 数据开启 TanStack Virtual，并支持动态行高测量。分组和手写 Option 保持普通渲染。
    default: false / '{}'
    link: null
    usage: '#virtual-options'
    code: null
  - name: pin-key / get-pin-options / pin-method / unpin-method / auto-use-option
    state:
      text: New
    type: String / Function / Function / Function / Boolean
    values: 本地或远程选项置顶配置
    description: 将常用平铺选项置顶，可在本地或远程持久化，并可自动使用第一个可用选项。
    default: '- / - / - / - / false'
    link: null
    usage: '#置顶选项'
    code: null
  - name: cached-options / highlight-search / filter-option / option-visible-method
    type: Array / Boolean / Function / Function
    values: 缓存选项、搜索高亮和可见性规则
    description: 保留远程选中项标签，并自定义搜索匹配与最终可见性。
    default: '[] / false / - / -'
    usage: '#cached-option-labels'
  - name: multiple-display-mode / get-tag-label / get-display-value
    type: tags | text / Function / Function
    values: 多选展示方式与格式化函数
    description: 控制多选以标签或单行文本展示，并格式化标签或完整展示值。
    default: tags / - / -
    usage: '#multiple-selection-tools'
  - name: selection-tools / selection-tool-labels / show-selected-mark / search-placeholder
    type: Array / Object / Boolean / String
    values: all | invert | clear
    description: 配置多选批量工具、工具文案、选中标记和搜索占位文本。
    default: "[] / {} / false / ''"
    usage: '#multiple-selection-tools'

  - name: option-group:label
    state:
      text: New
    type: String
    values: String
    description: 设置选择组标签（必填）。
    default: null
    link: null
    usage: '#group'
    code: null
EVENTS:
  - name: update:modelValue / change
    type: SelectValue
    description: 选中值变化时触发。
  - name: visible-change
    type: Boolean
    description: 下拉层打开或关闭时触发。
  - name: focus / blur
    type: FocusEvent | Event
    description: 控件获得或失去焦点时触发。
  - name: clear
    description: 清空当前选择后触发。
  - name: remove-tag
    type: SelectOptionValue
    description: 移除多选标签时触发。
  - name: pin-change
    type: '{ value, pinned, values }'
    description: 选项固定或取消固定后触发。
  - name: pin-fetch
    type: '(values: SelectOptionValue[], loaded: Boolean)'
    description: 持久化固定项加载完成时触发。
SLOTS:
  - name: header / tools / footer
    type: slot
    values: scoped slot
    description: 自定义下拉框头部、批量工具和底部内容；footer 仅提供状态与操作，不内置刷新。
    default: null
    usage: '#multiple-selection-tools'
  - name: message-{color}
    type: slot
    values: warn, danger, success
    description: 在选择框下方添加提示信息。
    default: null
    link: null
    usage: '#message'
    code: >
      <s-select
        placeholder="Success"
        v-model="value"
      >
        <template #message-success>
          Option Valid
        </template>
        <s-option label="Sax Design" value="1">
          Sax Design
        </s-option>
        <s-option label="Vue" value="2">
          Vue
        </s-option>
        <s-option label="Javascript" value="3">
          Javascript
        </s-option>
        <s-option label="Sass" value="4">
          Sass
        </s-option>
        <s-option label="Typescript" value="5">
          Typescript
        </s-option>
        <s-option label="Webpack" value="6">
          Webpack
        </s-option>
        <s-option label="Nodejs" value="7">
          Nodejs
        </s-option>
      </s-select>
---

# Select 选择器

<card>

## 默认

<docs-warn />

使用 `s-select` 与 `s-option` 子组件创建选择器。

<template #example>
<select-default />
</template>

<template #template>

@[code{1-13} html{3}](../../.vuepress/components/select/default.vue)

</template>

<template #script>

@[code{15-19}](../../.vuepress/components/select/default.vue)

</template>

<template #style>

@[code{21-36}](../../.vuepress/components/select/default.vue)

</template>

</card>

<card>

## 颜色

通过 `color` 设置组件颜色，支持主题色、**RGB**、**HEX**。

<template #example>
<select-color />
</template>

<template #template>

@[code{1-23} html{3}](../../.vuepress/components/select/color.vue)

</template>

<template #script>

@[code{25-29}](../../.vuepress/components/select/color.vue)

</template>

</card>

<card>

## 标签

通过 `label` 可为选择器添加标签；`label-placeholder` 用于聚焦或有值时浮动为标签，`placeholder` 用于常规占位文本。

<template #example>
<select-label />
</template>

<template #template>

@[code{1-33} html{3,13,23}](../../.vuepress/components/select/label.vue)

</template>

<template #script>

@[code{34-40}](../../.vuepress/components/select/label.vue)

</template>

</card>

<card>

## 分组

通过 `s-option-group` 子组件对选项分组；使用必填的 `title` 为分组添加标题。

<template #example>
<select-group />
</template>

<template #template>

@[code{1-57} html{4,9}](../../.vuepress/components/select/group.vue)

</template>

<template #script>

@[code{59-65}](../../.vuepress/components/select/group.vue)

</template>

<template #style>

@[code{67-82}](../../.vuepress/components/select/group.vue)

</template>

</card>

<card>

## 筛选

添加布尔属性 `filter`，即可启用选项筛选。

<template #example>
<select-filter />
</template>

<template #template>

@[code{1-41} html{6}](../../.vuepress/components/select/filter.vue)

</template>

<template #script>

@[code{43-66}](../../.vuepress/components/select/filter.vue)

</template>

</card>

<card>

## 多选

添加布尔属性 `multiple`，即可启用多选。

多选 Select 默认测量当前可用宽度，将放不下的标签自动收纳为 `+N`。需要允许标签换行时可将 `collapse-chips` 设为 `false`；`max-collapse-chips` 仅用于设置可选的显示数量上限。

::: tip
选择器绑定值必须为数组。
:::

<template #example>
<select-multiple />
</template>

<template #template>

@[code{1-54} html{7,24,41-42}](../../.vuepress/components/select/multiple.vue)

</template>

<template #script>

@[code{56-72}](../../.vuepress/components/select/multiple.vue)

</template>

</card>

<card>

## 加载

添加布尔属性 `loading`，即可为选择器显示加载动画。

<template #example>
<select-loading />
</template>

<template #template>

@[code{1-23} html{3}](../../.vuepress/components/select/loading.vue)

</template>

<template #script>

@[code{25-30}](../../.vuepress/components/select/loading.vue)

</template>

</card>

<card>

## 状态

通过 `state` 设置组件状态颜色，支持主题色。

::: tip
该属性可用于提示字段缺失、校验通过等状态。
:::

<template #example>
<select-state />
</template>

<template #template>

@[code{1-20} html{7}](../../.vuepress/components/select/state.vue)

</template>

<template #script>

@[code{22-47}](../../.vuepress/components/select/state.vue)

</template>

<template #style>

@[code{49-55}](../../.vuepress/components/select/state.vue)

</template>

</card>

<card>

## 提示信息

在选择器下方添加提示信息。

<template #example>
<select-message />
</template>

<template #template>

@[code{1-38} html{4,15,26-28}](../../.vuepress/components/select/message.vue)

</template>

<template #script>

@[code{39-45}](../../.vuepress/components/select/message.vue)

</template>

<template #style>

@[code{47-54}](../../.vuepress/components/select/message.vue)

</template>

</card>

<card>

## 数据源

服务端数据可直接传入 `options`、`option-groups`。通过 `option-props`、`option-group-props` 映射字段；`filterable` 是 `filter` 的别名。

<template #example>
<select-data />
</template>

<template #template>

@[code{1-16} html{4-9}](../../.vuepress/components/select/data.vue)

</template>

<template #script>

@[code{18-37}](../../.vuepress/components/select/data.vue)

</template>

</card>

<card>

## 弹层配置

通过 `popup-config` 控制弹层宽高、与选择框等宽、偏移量、挂载容器和自定义样式。第一个示例使用 `full` 跟随选择框宽度；第二个示例组合使用宽高限制、`offset`、`appendTo`、`placement`、`className` 和 `style`。示例将弹层挂载到 `body`，在弹窗等场景中可将 `appendTo` 换成已存在的容器选择器或元素。

<template #example>
<select-popup-config />
</template>

<template #template>

@[code](../../.vuepress/components/select/popup-config.vue)

</template>

</card>

<card>

## 搜索匹配与高亮

使用 `filter-option` 定义匹配规则，`highlight-search` 标记匹配文字，`show-selected-mark` 显示选中标记。

<template #example>
<select-search-highlight />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/select/search-highlight.vue)

</template>

<template #script>

@[code{14-26}](../../.vuepress/components/select/search-highlight.vue)

</template>

</card>

<card>

## 多选工具与底部内容

`selection-tools` 可按当前筛选结果全选、反选或清空。`footer` 插槽提供数量和批量操作上下文，不包含刷新逻辑。

<template #example>
<select-selection-tools />
</template>

<template #template>

@[code{1-18}](../../.vuepress/components/select/selection-tools.vue)

</template>

<template #script>

@[code{20-33}](../../.vuepress/components/select/selection-tools.vue)

</template>

</card>

<card>

## 缓存选项标签

远程分页或搜索替换当前 `options` 时，可通过 `cached-options` 保留已选值的标签。`header`、`footer` 可分别定制弹层上下区域。

<template #example>
<select-cached-options />
</template>

<template #template>

@[code{1-16}](../../.vuepress/components/select/cached-options.vue)

</template>

<template #script>

@[code{18-29}](../../.vuepress/components/select/cached-options.vue)

</template>

</card>

<card>

## 置顶选项

设置 `pin-key` 后，置顶值会保存到本地存储。悬停选项可显示置顶按钮，也可对键盘高亮项按 `Ctrl+P`。需要服务端持久化时，同时传入 `get-pin-options`、`pin-method` 与 `unpin-method`。`auto-use-option` 会优先使用第一个已置顶且可用的选项，没有置顶项时使用第一个可用项。

<template #example>
<select-pinning />
</template>

<template #template>

@[code](../../.vuepress/components/select/pinning.vue)

</template>

</card>

<card>

## 虚拟选项

大数据平铺 `options` 可开启 `virtual`。筛选、键盘导航与已选值缓存保留，同时只挂载可见行。动态测量默认开启，换行标签和自定义选项内容可以使用不同高度；只有行高完全固定时才需要将 `virtual-config.dynamic` 设为 `false`。

<template #example>
<select-virtual />
</template>

<template #template>

@[code](../../.vuepress/components/select/virtual.vue)

</template>

</card>
