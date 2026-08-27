---
description: '在同一弹层中逐级选择关联数据。'
PROPS:
  - name: v-model / model-value
    type: CascaderPathValue | CascaderPathValue[]
    values: 单选值路径或多选值路径数组
    description: 绑定当前选择。单选为一条路径，多选为路径数组。
    default: '[]'
  - name: options / field-names
    type: CascaderOption[] / Object
    values: value | label | children | disabled | isLeaf
    description: 配置层级数据，并可映射自定义字段名。
    default: '[] / {}'
  - name: multiple / show-checked-strategy
    type: Boolean / SHOW_PARENT | SHOW_CHILD
    values: true | false / SHOW_PARENT | SHOW_CHILD
    description: 开启父子关联多选，并控制全选子节点后回填父节点还是叶子节点。
    default: false / SHOW_PARENT
    usage: '#多选与回填策略'
  - name: max-tag-count / max-tag-placeholder
    type: Number | responsive / Function
    values: number | responsive
    description: 控制多选标签数量；默认根据可用宽度自动折叠为 +N。
    default: responsive / -
    usage: '#多选与回填策略'
  - name: show-search / search-value
    type: Boolean | Object / String
    values: filter | sort | limit | matchInputWidth
    description: 开启路径搜索和高亮，并可自定义匹配、排序、数量限制及受控搜索值。
    default: false / -
    usage: '#搜索与字段映射'
  - name: change-on-select / check-strictly
    type: Boolean
    values: true | false
    description: 单选时允许选择中间层级；check-strictly 是兼容旧属性。
    default: false
    usage: '#基础选择'
  - name: expand-trigger / load-data
    type: click | hover / Function
    values: click | hover
    description: 配置层级展开方式，或根据 selectedOptions 异步加载子节点。load-data 与 show-search 不同时启用。
    default: click / -
    usage: '#悬停展开与懒加载'
  - name: allow-clear / clearable / disabled / loading / block
    type: Boolean
    values: true | false
    description: 控制清空、禁用、加载状态和整行宽度。clearable 保留为兼容别名。
    default: true / false / false / false / false
  - name: placeholder / separator / display-render / not-found-content
    type: String / String / Function / String
    values: 展示内容
    description: 配置占位文案、路径分隔符、回填格式和空状态文案。
    default: locale / ' / ' / - / locale
  - name: open / default-open / placement / teleported
    type: Boolean / Boolean / Placement / Boolean
    values: Popper placement
    description: 控制弹层显隐、默认显隐、位置和是否传送到全局容器。
    default: '- / false / bottom-start / true'
  - name: popup-config / popup-class-name / dropdown-style
    type: Object / String / CSSProperties
    values: full | width | minWidth | maxWidth | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style
    description: 配置弹层宽度、限制、挂载目标、偏移、层级和自定义样式。
    default: '{} / - / {}'
    usage: '#弹层与内容定制'
EVENTS:
  - name: change
    description: 选择变化时触发，参数为 value 与 selectedOptions。
  - name: search
    description: 搜索值变化时触发。
  - name: dropdown-visible-change
    description: 弹层显隐变化时触发。
  - name: clear / remove-tag / load
    description: 清空、多选标签移除、懒加载完成时触发。
  - name: focus / blur
    description: 组件获得或失去焦点时触发。
SLOTS:
  - name: option / searchResult
    type: scoped slot
    values: option | path | selected | active
    description: 自定义普通选项或搜索结果内容。
  - name: tag-render / max-tag-placeholder / display-render
    type: scoped slot
    values: label | option | path | omittedValues | labels | selectedOptions
    description: 自定义多选标签、折叠数量和单选回填内容。
  - name: suffix-icon / clear-icon / expand-icon / empty
    type: slot
    values: '-'
    description: 自定义后缀、清空、层级展开图标和空状态。
  - name: header / footer
    type: slot
    values: '-'
    description: 在选项区域上方或下方追加内容。
---

# Cascader 级联选择器

<card>

## 基础选择

默认只在选中叶子节点后提交；`change-on-select` 允许在任意层级提交。组件默认支持清空，原有 `clearable` 和 `check-strictly` 继续兼容。

<template #example><cascader-default /></template>

<template #template>

@[code](../../.vuepress/components/cascader/default.vue)

</template>

</card>

<card>

## 搜索与字段映射

`show-search` 会搜索完整路径并高亮命中文字；对象形式可配置 `filter`、`sort` 与 `limit`。`field-names` 用于接入非标准数据字段。

<template #example><cascader-search /></template>

<template #template>

@[code](../../.vuepress/components/cascader/search.vue)

</template>

</card>

<card>

## 多选与回填策略

`multiple` 启用父子关联选择。默认 `SHOW_PARENT` 会在子节点全部选中时收纳为父节点；`SHOW_CHILD` 保留叶子路径。多选标签默认根据输入框剩余宽度自动折叠为 `+N`。

<template #example><cascader-multiple /></template>

<template #template>

@[code](../../.vuepress/components/cascader/multiple.vue)

</template>

</card>

<card>

## 悬停展开与懒加载

`expand-trigger="hover"` 可悬停展开。对于尚未加载的节点，将 `isLeaf` 设为 `false` 并通过 `load-data` 写入 `children`；懒加载与本地路径搜索不能同时启用。

<template #example><cascader-lazy /></template>

<template #template>

@[code](../../.vuepress/components/cascader/lazy.vue)

</template>

</card>

<card>

## 弹层与内容定制

`popup-config` 与 Select 保持一致，支持跟随触发器宽度、宽高限制、挂载目标、偏移和样式。`header`、`footer`、`option` 等插槽可定制弹层内容。

<template #example><cascader-popup /></template>

<template #template>

@[code](../../.vuepress/components/cascader/popup.vue)

</template>

</card>
