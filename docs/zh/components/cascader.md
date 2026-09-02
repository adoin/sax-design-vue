---
description: '在同一弹层中逐级选择关联数据。'
PROPS:
  - name: shape
    type: String
    values: "rounded | square"
    description: 为触发器、标签和弹层统一设置圆角或方形外观。
    default: rounded
    usage: '#外形'
  - name: v-model
    type: CascaderPathValue | CascaderPathValue[]
    values: "单选值路径或多选值路径数组"
    description: 绑定当前选择。单选为一条路径，多选为路径数组。
    default: '[]'
  - name: model-value
    type: CascaderPathValue | CascaderPathValue[]
    values: "单选值路径或多选值路径数组"
    description: 绑定当前选择。单选为一条路径，多选为路径数组。
    default: '[]'
  - name: options
    type: CascaderOption[]
    values: "value | label | children | disabled | isLeaf"
    description: 配置层级数据，并可映射自定义字段名。
    default: '[]'
  - name: field-names
    type: Object
    values: "value | label | children | disabled | isLeaf"
    description: 配置层级数据，并可映射自定义字段名。
    default: '{}'
  - name: multiple
    type: Boolean
    values: "true | false"
    description: 开启父子关联多选，并控制全选子节点后回填父节点还是叶子节点。
    default: false
    usage: '#多选与回填策略'
  - name: show-checked-strategy
    type: SHOW_PARENT | SHOW_CHILD
    values: "SHOW_PARENT | SHOW_CHILD"
    description: 开启父子关联多选，并控制全选子节点后回填父节点还是叶子节点。
    default: SHOW_PARENT
    usage: '#多选与回填策略'
  - name: max-tag-count
    type: Number | responsive
    values: "number | responsive"
    description: 控制多选标签数量；默认根据可用宽度自动折叠为 +N。
    default: responsive
    usage: '#多选与回填策略'
  - name: max-tag-placeholder
    type: Function
    values: "number | responsive"
    description: 控制多选标签数量；默认根据可用宽度自动折叠为 +N。
    default: null
    usage: '#多选与回填策略'
  - name: show-search
    type: Boolean | Object
    values: "filter | sort | limit | matchInputWidth"
    description: 开启路径搜索和高亮，并可自定义匹配、排序、数量限制及受控搜索值。
    default: false
    usage: '#搜索与字段映射'
  - name: search-value
    type: String
    values: "filter | sort | limit | matchInputWidth"
    description: 开启路径搜索和高亮，并可自定义匹配、排序、数量限制及受控搜索值。
    default: null
    usage: '#搜索与字段映射'
  - name: change-on-select
    type: Boolean
    values: "true | false"
    description: 单选时允许选择中间层级；check-strictly 是兼容旧属性。
    default: false
    usage: '#基础选择'
  - name: check-strictly
    type: Boolean
    values: "true | false"
    description: 单选时允许选择中间层级；check-strictly 是兼容旧属性。
    default: false
    usage: '#基础选择'
  - name: expand-trigger
    type: click | hover
    values: "click | hover"
    description: 配置层级展开方式，或根据 selectedOptions 异步加载子节点。load-data 与 show-search 不同时启用。
    default: click
    usage: '#悬停展开与懒加载'
  - name: load-data
    type: Function
    values: "click | hover"
    description: 配置层级展开方式，或根据 selectedOptions 异步加载子节点。load-data 与 show-search 不同时启用。
    default: null
    usage: '#悬停展开与懒加载'
  - name: allow-clear
    type: Boolean
    values: "true | false"
    description: 控制清空、禁用、加载状态和整行宽度。clearable 保留为兼容别名。
    default: true
  - name: clearable
    type: Boolean
    values: "true | false"
    description: 控制清空、禁用、加载状态和整行宽度。clearable 保留为兼容别名。
    default: false
  - name: disabled
    type: Boolean
    values: "true | false"
    description: 控制清空、禁用、加载状态和整行宽度。clearable 保留为兼容别名。
    default: false
  - name: loading
    type: Boolean
    values: "true | false"
    description: 控制清空、禁用、加载状态和整行宽度。clearable 保留为兼容别名。
    default: false
  - name: block
    type: Boolean
    values: "true | false"
    description: 控制清空、禁用、加载状态和整行宽度。clearable 保留为兼容别名。
    default: false
  - name: placeholder
    type: String
    values: "展示内容"
    description: 配置占位文案、路径分隔符、回填格式和空状态文案。
    default: locale
  - name: separator
    type: String
    values: "展示内容"
    description: 配置占位文案、路径分隔符、回填格式和空状态文案。
    default: "' / '"
  - name: display-render
    type: Function
    values: "展示内容"
    description: 配置占位文案、路径分隔符、回填格式和空状态文案。
    default: null
  - name: not-found-content
    type: String
    values: "展示内容"
    description: 配置占位文案、路径分隔符、回填格式和空状态文案。
    default: locale
  - name: open
    type: Boolean
    values: "Popper placement"
    description: 控制弹层显隐、默认显隐、位置和是否传送到全局容器。
    default: null
  - name: default-open
    type: Boolean
    values: "Popper placement"
    description: 控制弹层显隐、默认显隐、位置和是否传送到全局容器。
    default: 'false'
  - name: placement
    type: Placement
    values: "Popper placement"
    description: 控制弹层显隐、默认显隐、位置和是否传送到全局容器。
    default: 'bottom-start'
  - name: teleported
    type: Boolean
    values: "Popper placement"
    description: 控制弹层显隐、默认显隐、位置和是否传送到全局容器。
    default: 'true'
  - name: popup-config
    type: Object
    values: "full | width | minWidth | maxWidth | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: 配置弹层宽度、限制、挂载目标、偏移、层级和自定义样式。
    default: '{}'
    usage: '#弹层与内容定制'
  - name: popup-class-name
    type: String
    values: "full | width | minWidth | maxWidth | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: 配置弹层宽度、限制、挂载目标、偏移、层级和自定义样式。
    default: null
    usage: '#弹层与内容定制'
  - name: dropdown-style
    type: CSSProperties
    values: "full | width | minWidth | maxWidth | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: 配置弹层宽度、限制、挂载目标、偏移、层级和自定义样式。
    default: '{}'
    usage: '#弹层与内容定制'
EVENTS:
  - name: change
    description: 选择变化时触发，参数为 value 与 selectedOptions。
  - name: search
    description: 搜索值变化时触发。
  - name: dropdown-visible-change
    description: 弹层显隐变化时触发。
  - name: clear
    description: 清空、多选标签移除、懒加载完成时触发。
  - name: remove-tag
    description: 清空、多选标签移除、懒加载完成时触发。
  - name: load
    description: 清空、多选标签移除、懒加载完成时触发。
  - name: focus
    description: 组件获得或失去焦点时触发。
  - name: blur
    description: 组件获得或失去焦点时触发。
SLOTS:
  - name: option
    type: scoped slot
    values: "option | path | selected | active"
    description: 自定义普通选项或搜索结果内容。
  - name: searchResult
    type: scoped slot
    values: "option | path | selected | active"
    description: 自定义普通选项或搜索结果内容。
  - name: tag-render
    type: scoped slot
    values: "label | option | path | omittedValues | labels | selectedOptions"
    description: 自定义多选标签、折叠数量和单选回填内容。
  - name: max-tag-placeholder
    type: scoped slot
    values: "label | option | path | omittedValues | labels | selectedOptions"
    description: 自定义多选标签、折叠数量和单选回填内容。
  - name: display-render
    type: scoped slot
    values: "label | option | path | omittedValues | labels | selectedOptions"
    description: 自定义多选标签、折叠数量和单选回填内容。
  - name: suffix-icon
    type: slot
    values: "-"
    description: 自定义后缀、清空、层级展开图标和空状态。
  - name: clear-icon
    type: slot
    values: "-"
    description: 自定义后缀、清空、层级展开图标和空状态。
  - name: expand-icon
    type: slot
    values: "-"
    description: 自定义后缀、清空、层级展开图标和空状态。
  - name: empty
    type: slot
    values: "-"
    description: 自定义后缀、清空、层级展开图标和空状态。
  - name: header
    type: slot
    values: "-"
    description: 在选项区域上方或下方追加内容。
  - name: footer
    type: slot
    values: "-"
    description: 在选项区域上方或下方追加内容。
---

# Cascader 级联选择器

<card>

## 基础选择

默认只在选中叶子节点后提交；`change-on-select` 允许在任意层级提交。组件默认支持清空，原有 `clearable` 和 `check-strictly` 继续兼容。

<template #example><cascader-default /></template>

<template #template>

@[code{1-6}](../../.vuepress/components/cascader/default.vue)

</template>

<template #script>

@[code{8-23}](../../.vuepress/components/cascader/default.vue)

</template>

<template #style>

@[code{25-37}](../../.vuepress/components/cascader/default.vue)

</template>

</card>

<card>

## 外形

设置 `shape="square"` 可让触发器、标签、选项、操作按钮和弹层表面统一使用直角外观。

<template #example><cascader-shape /></template>

<template #template>

@[code{19-39}](../../.vuepress/components/cascader/shape.vue)

</template>

<template #script>

@[code{1-17}](../../.vuepress/components/cascader/shape.vue)

</template>

<template #style>

@[code{41-53}](../../.vuepress/components/cascader/shape.vue)

</template>

</card>

<card>

## 搜索与字段映射

`show-search` 会搜索完整路径并高亮命中文字；对象形式可配置 `filter`、`sort` 与 `limit`。`field-names` 用于接入非标准数据字段。

<template #example><cascader-search /></template>

<template #template>

@[code{35-77}](../../.vuepress/components/cascader/search.vue)

</template>

<template #script>

@[code{1-33}](../../.vuepress/components/cascader/search.vue)

</template>

<template #style>

@[code{79-105}](../../.vuepress/components/cascader/search.vue)

</template>

</card>

<card>

## 多选与回填策略

`multiple` 启用父子关联选择。默认 `SHOW_PARENT` 会在子节点全部选中时收纳为父节点；`SHOW_CHILD` 保留叶子路径。多选标签默认根据输入框剩余宽度自动折叠为 `+N`。

<template #example><cascader-multiple /></template>

<template #template>

@[code{1-20}](../../.vuepress/components/cascader/multiple.vue)

</template>

<template #script>

@[code{22-50}](../../.vuepress/components/cascader/multiple.vue)

</template>

<template #style>

@[code{52-58}](../../.vuepress/components/cascader/multiple.vue)

</template>

</card>

<card>

## 悬停展开与懒加载

`expand-trigger="hover"` 可悬停展开。对于尚未加载的节点，将 `isLeaf` 设为 `false` 并通过 `load-data` 写入 `children`；懒加载与本地路径搜索不能同时启用。

<template #example><cascader-lazy /></template>

<template #template>

@[code{1-16}](../../.vuepress/components/cascader/lazy.vue)

</template>

<template #script>

@[code{18-53}](../../.vuepress/components/cascader/lazy.vue)

</template>

<template #style>

@[code{55-61}](../../.vuepress/components/cascader/lazy.vue)

</template>

</card>

<card>

## 弹层与内容定制

`popup-config` 与 Select 保持一致，支持跟随触发器宽度、宽高限制、挂载目标、偏移和样式。`header`、`footer`、`option` 等插槽可定制弹层内容。

<template #example><cascader-popup /></template>

<template #template>

@[code{1-22}](../../.vuepress/components/cascader/popup.vue)

</template>

<template #script>

@[code{24-39}](../../.vuepress/components/cascader/popup.vue)

</template>

<template #style>

@[code{41-49}](../../.vuepress/components/cascader/popup.vue)

</template>

</card>
