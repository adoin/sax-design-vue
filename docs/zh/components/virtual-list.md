---
PROPS:
  - name: max-rendered-items
    type: Number
    values: '正整数'
    description: 同时挂载的最大行数，包含预渲染行。持续触及上限时在开发环境提示；布局或 overscan 恢复后自动解除限制。只有确实需要密集视口时才提高此值。
    default: '500'
    usage: '#dynamic-container-safety'
  - name: overscan
    type: Number
    values: '项数'
    description: 在可见范围前后额外渲染的行数。
    default: '5'
  - name: items
    type: Array
    values: 'unknown[]'
    description: 虚拟列表的数据源。
    default: '[]'
    link: null
    usage: '#dynamic-height'
  - name: height
    type: Number | String
    values: 'CSS height'
    description: 滚动视口高度。百分比或 auto 高度尚未解析时使用 320px 内在尺寸兜底，父容器尺寸明确后自动跟随。
    default: '320'
    link: null
    usage: '#dynamic-height'
  - name: estimate-size
    type: Number
    values: 'pixels'
    description: 行元素真实测量前的高度估算。动态行高建议给偏大的合理值。
    default: '48'
    link: null
    usage: '#dynamic-height'
  - name: dynamic
    type: Boolean
    values: 'true | false'
    description: 测量渲染行，支持内容变化后的动态行高。
    default: 'true'
    link: null
    usage: '#dynamic-height'
  - name: retain-max-size
    type: Boolean
    values: 'true | false'
    description: 按稳定 item key 保留已测得的最大高度，适合不同虚拟窗口会展示同行不同内容的场景。
    default: 'false'
    link: null
    usage: '#dynamic-height'
  - name: item-key
    type: Function
    values: '(item, index) => string | number'
    description: 稳定唯一行 key。数据重排或追加时必须设置。
    default: index
    link: null
    usage: '#dynamic-height'
EVENTS:
  - name: range-change
    description: 已渲染虚拟行区间变化时触发。
  - name: scroll
    description: 滚动视口的原生 scroll 事件。
EXPOSES:
  - name: scrollToIndex
    description: 编程滚动，或重置动态行高测量缓存。
  - name: scrollToOffset
    description: 编程滚动，或重置动态行高测量缓存。
  - name: scrollBy
    type: '(delta: number) => void'
    description: 按逻辑像素相对滚动；正数向下、负数向上。生成式巨量列表使用压缩轨道时仍保持相同的内容移动距离。
  - name: measure
    description: 重新测量已渲染行；开启 retain-max-size 时继续保留历史最大高度。
  - name: resetMeasurements
    type: '() => Promise<void>'
    description: 清空历史高度并重新测量当前布局，保留可见行锚点。列宽或内容变化可能使行变矮时调用。
NEWS:
  - dynamic-height
  - dynamic-container-safety
description: '基于共享高度差索引的窗口化列表，支持真实测量动态行高。'
---

# Virtual List 虚拟列表

<card>

## 动态行高

`s-virtual-list` 只挂载视口附近的行。每个已渲染行会被真实测量，因此文本换行、展开收起、追加内容都会更新偏移量并保持滚动锚点。当不同虚拟窗口可能让同一个稳定 item key 出现更高内容时，可开启 `retain-max-size` 保留其历史最大高度。

超大生成数据的总行高超过浏览器布局限制时，组件会压缩原生滚动轨道。`scrollToIndex` 仍使用原始行索引，`scrollToOffset` 使用逻辑内容像素；滚轮保持正常像素步长，拖动原生滑块可遍历完整范围。

<template #example>
<virtual-list-default />
</template>

<template #template>

@[code{1-27}](../../.vuepress/components/virtual-list/default.vue)

</template>

<template #script>

@[code{29-51}](../../.vuepress/components/virtual-list/default.vue)

</template>

<template #style>

@[code{53-79}](../../.vuepress/components/virtual-list/default.vue)

</template>

</card>

<card>

## 动态容器与安全兜底

百分比、Flex 和 Grid 容器可能动态改变尺寸，也可能短暂失去确定高度。视口使用尺寸隔离和 320px 内在尺寸兜底，避免列表占位内容反过来撑大视口；父容器高度明确后自动跟随，不会永久锁定在兜底高度。暂时隐藏为 0px 的容器仍保持隐藏，重新显示后再次测量。

`max-rendered-items` 会立即限制同时挂载的行数，包含过大的 overscan，并保证当前滚动位置仍在渲染窗口内。只有可见容器连续 200ms 触及上限时，开发环境才会针对本次异常提示一次，并给出布局和配置建议；瞬时波动、隐藏及组件卸载都不会触发这条提示。生产环境同样保留挂载上限保护。

下面可在未限高、两个明确高度与隐藏状态之间切换，数据按索引生成，不创建十万条数组。确实需要密集视口时可提高挂载预算，但它不替代正确的父容器尺寸；Flex/Grid 布局还应允许滚动子项收缩，例如设置 `min-height: 0`。

<template #example>
<virtual-list-zh-container-safety />
</template>

<template #template>

@[code{26-73}](../../.vuepress/components/virtual-list-zh/container-safety.vue)

</template>

<template #script>

@[code{1-24}](../../.vuepress/components/virtual-list-zh/container-safety.vue)

</template>

</card>
