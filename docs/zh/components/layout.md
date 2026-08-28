---
PROPS:
  - name: aside-position
    type: String
    values: start | end
    description: 将侧栏放在主内容之前或之后。
    default: start
  - name: aside-width
    type: String | Number
    values: CSS 尺寸
    description: 侧栏插槽宽度。
    default: 240
  - name: header-height
    type: String | Number
    values: CSS 尺寸
    description: 页头插槽的可选固定高度。
    default: null
  - name: footer-height
    type: String | Number
    values: CSS 尺寸
    description: 页脚插槽的可选固定高度。
    default: null
  - name: gap
    type: String | Number
    values: CSS 尺寸
    description: 各布局表面之间的间距。
    default: 16
  - name: padding
    type: String | Number
    values: CSS 尺寸
    description: 应用外壳的内边距。
    default: 16
  - name: min-height
    type: String | Number
    values: CSS 尺寸
    description: 应用外壳的最小高度。
    default: 100%
  - name: responsive
    type: Boolean
    values: true | false
    description: 小于 768px 时将侧栏与主内容纵向排列。
    default: true
  - name: sticky-header
    type: Boolean
    values: true | false
    description: 滚动时保持页头表面可见。
    default: false
  - name: sticky-header-offset
    type: String | Number
    values: CSS 尺寸
    description: SLayout 页头吸顶时与视口顶部的距离；未设置时沿用布局 padding。
    default: null
  - name: sticky-header-z-index
    type: Number
    values: number
    description: SLayout 吸顶页头的层级。
    default: 10
  - name: aside-outside-collapsible
    type: Boolean
    values: true | false
    description: 为 aside-outside 工具面显示内置收起控件。
    default: true
  - name: aside-outside-collapsed
    type: Boolean
    values: true | false
    description: 控制 SLayout 外挂工具的收起状态。
    default: false
  - name: sticky
    type: Boolean
    values: true | false
    description: 为独立的 SLayoutHeader 开启吸顶。
    default: false
  - name: sticky-offset
    type: String | Number
    values: CSS 尺寸
    description: 独立 SLayoutHeader 吸顶时与视口顶部的距离。
    default: 0
  - name: z-index
    type: Number
    values: number
    description: 独立 SLayoutHeader 吸顶时的层级。
    default: 10
  - name: direction
    type: String
    values: horizontal | vertical
    description: SLayoutContainer 的 Flex 方向。
    default: horizontal
  - name: wrap
    type: Boolean
    values: true | false
    description: 允许 SLayoutContainer 的子项换行。
    default: false
  - name: align
    type: String
    values: start | center | end | stretch
    description: SLayoutContainer 的交叉轴对齐方式。
    default: stretch
  - name: justify
    type: String
    values: start | center | end | space-around | space-between | space-evenly
    description: SLayoutContainer 的主轴分布方式。
    default: start
  - name: size
    type: String | Number
    values: CSS size
    description: Header/Footer 高度或 Aside 宽度。
    default: null
  - name: outside-position
    type: String
    values: start | end
    description: SLayoutAside 外挂插槽相对侧栏的位置。
    default: end
  - name: outside-collapsible
    type: Boolean
    values: true | false
    description: 为 outside 插槽显示内置收起和展开控件。
    default: true
  - name: outside-collapsed
    type: Boolean
    values: true | false
    description: 控制 SLayoutAside outside 插槽的收起状态。
    default: false
description: '响应式应用外壳与可自由拼接的语义布局表面。'
EVENTS:
  - name: update:asideOutsideCollapsed / aside-outside-collapse
    type: Boolean
    description: 外侧边栏区域折叠或展开时触发。
---

# Layout 布局

<card>

`SLayout` 负责标准应用页面骨架，通过命名插槽组织区域。未传入的区域不会产生空包装层，因此同一套 API 可以覆盖后台、内容页和设置页。所有区域都通过间距与阴影建立层级，不依赖分隔边框。

## 标准页面骨架

使用 `header`、`aside`、默认和 `footer` 插槽拼出完整页面。设置 `aside-position="end"` 可将侧栏切换到右侧；小屏幕下会自动纵向排列，避免横向滚动。

<template #example><layout-default /></template>

<template #template>

@[code{1-83}](../../.vuepress/components/layout/default.vue)

</template>

<template #style>

@[code{85-308}](../../.vuepress/components/layout/default.vue)

</template>

</card>

<card>

## 侧栏外挂工具

通过 `aside-outside` 插槽把配置、语言、主题等操作吸附在侧栏外侧。`SLayout` 会将内容转发给内部 `SLayoutAside` 的 `outside` 插槽；连接曲面、方向、阴影、小屏回退以及最外侧的收起/展开控件都由 Aside 统一处理。收起后仍保留方向箭头，并提供悬停和键盘反馈。直接使用 `SLayoutAside` 时改用 `#outside` 即可。

<template #example><layout-aside-outside /></template>

<template #template>

@[code{11-78}](../../.vuepress/components/layout/aside-outside.vue)

</template>

<template #script>

@[code{1-9}](../../.vuepress/components/layout/aside-outside.vue)

</template>

<template #style>

@[code{80-216}](../../.vuepress/components/layout/aside-outside.vue)

</template>

</card>

<card>

## 自由拼接

非标准结构可直接组合 `SLayoutContainer`、`SLayoutHeader`、`SLayoutAside`、`SLayoutBody` 与 `SLayoutFooter`。容器支持 `direction`、`gap`、`wrap`、`align`、`justify`，也可以任意嵌套。`SLayoutHeader` 可通过 `sticky` 独立吸顶，并用 `sticky-offset` 避开页面已有的顶部导航。`SLayoutAside` 的 `outside` 插槽用于放置配置、语言和主题等工具；侧栏会负责将工具表面连续地吸附在外侧。

<template #example><layout-composition /></template>

<template #template>

@[code{1-18}](../../.vuepress/components/layout/composition.vue)

</template>

<template #style>

@[code{20-50}](../../.vuepress/components/layout/composition.vue)

</template>

</card>

<card>

## 插槽

| 插槽            | 用途                                                                |
| --------------- | ------------------------------------------------------------------- |
| `header`        | 应用页头或顶部导航。                                                |
| `aside`         | 主导航或上下文侧栏。                                                |
| `aside-outside` | 吸附在侧栏外侧的工具区，会转发给 `SLayoutAside` 的 `outside` 插槽。 |
| `default`       | 语义化主内容区域。                                                  |
| `footer`        | 页面级页脚内容。                                                    |

直接使用 `SLayoutAside` 时，使用 `outside` 插槽；只有插槽存在时才会渲染外挂工具表面。两个外挂插槽都会暴露 `collapsed` 和 `toggle`。在 `SLayout` 上设置 `aside-outside-collapsible="false"`，或在 `SLayoutAside` 上设置 `outside-collapsible="false"`，可以关闭内置控件。状态变化时，`SLayout` 会触发 `update:asideOutsideCollapsed` / `aside-outside-collapse`，`SLayoutAside` 会触发 `update:outsideCollapsed` / `outside-collapse`。

</card>
