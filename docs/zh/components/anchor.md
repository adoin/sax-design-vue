---
PROPS:
  - name: model-value
    type: String
    values: 'href'
    description: 当前激活锚点 href。
    default: "''"
  - name: v-model
    type: String
    values: 'href'
    description: 当前激活锚点 href。
    default: "''"
  - name: items
    type: Array
    values: '{ href?, title, disabled?, boundary?, collapsible?, defaultCollapsed?, children? }[]'
    description: 递归导航配置；省略 href 时仅作为分组标题，#hash 在当前页滚动，其他同源路径使用已配置的路由器；boundary 可覆盖其是否进入扁平化的前后边界顺序。
    default: '[]'
  - name: router
    type: AnchorRouterAdapter
    values: '{ push, replace?, current?, currentRoute? }'
    description: 当前 Anchor 使用的路由对象；局部配置优先于全局 anchor.router，兼容 Vue Router 及同形路由。
    default: null
  - name: route-boundary
    type: Boolean | AnchorRouteBoundaryOptions
    description: 为扁平化后的可用路由顺序自动生成悬浮前后边界；false 关闭，也可配置 threshold、armDelay 和 routeCooldown。
    default: true
  - name: offset
    type: Number
    values: 'pixels'
    description: 可读视口的顶部留白；未指定专用属性时，也作为旧版标题激活线和点击落点的默认偏移。
    default: '88'
  - name: active-strategy
    type: String
    values: 'heading / visible-section'
    description: 选择标题过线或可读视口中占比最大的内容区间；组件局部值优先于全局 anchor.activeStrategy。
    default: heading
  - name: active-offset
    type: Number
    values: '像素'
    description: 标题过线算法的激活线距离滚动视口顶部的像素数；局部值优先于全局 anchor.activeOffset，省略时回退到 offset。
    default: 'offset'
  - name: target-offset
    type: Number
    values: 'pixels'
    description: 选择哈希链接后滚动到的顶部留白；默认沿用 offset。
    default: 'offset'
  - name: bounds
    type: Number
    values: 'pixels'
    description: 标题激活线与页底判定附近的容差。
    default: '5'
  - name: affix
    type: Boolean
    values: 'true / false'
    description: 让锚点导航吸附在视口中。
    default: false
  - name: get-container
    type: Function
    values: '() => HTMLElement | Window'
    description: 返回滚动容器；默认监听页面 window。
    default: window
  - name: get-current-anchor
    type: Function
    values: '(activeHref) => href'
    description: 自定义高亮的 href。
    default: undefined
  - name: replace
    type: Boolean
    values: 'true / false'
    description: 使用替换而非追加方式更新浏览器历史 hash。
    default: false
  - name: direction
    type: String
    values: 'vertical / horizontal'
    description: 锚点布局方向；分级链接仅在垂直模式展示。
    default: vertical
  - name: scroll-behavior
    type: String
    values: 'auto / smooth'
    description: 选择锚点后的滚动行为。
    default: smooth
EVENTS:
  - name: change
    description: 激活锚点变化时触发。
  - name: click
    description: 导航前触发，参数为当前项和 MouseEvent；普通的同源路由点击随后交给已配置的适配器。
  - name: collapse-change
    description: 可折叠锚点项展开或收起时触发，参数为当前项与收起状态。
SLOTS:
  - name: active-icon
    type: 'Slot<{ item: AnchorItem, href: string }>'
    description: 替换激活标记，优先级高于 Anchor 全局图标配置。
    default: null
  - name: route-previous
    type: 'Slot<{ item: AnchorRouteBoundaryItem, direction: previous, visible: boolean, navigating: boolean, progress: number }>'
    description: 替换自动生成的上一条路由提示文字，保留链接、图标和进度指示。
    default: null
  - name: route-next
    type: 'Slot<{ item: AnchorRouteBoundaryItem, direction: next, visible: boolean, navigating: boolean, progress: number }>'
    description: 替换自动生成的下一条路由提示文字，保留链接、图标和进度指示。
    default: null
description: '用于在当前页面的内容区块或相关路由之间快速导航。'
---

# Anchor 锚点

<card>

<docs-warn />

<anchor-default />

<h2 id="anchor-default">默认用法</h2>

使用哈希 `href` 定位当前页面的标题，也可以传入相对路径、根路径或完整 URL 跳转到其他路由。Anchor 使用语义化链接渲染，因此路由项保留在新标签页打开、复制链接地址等浏览器标准行为。

Anchor 本身不依赖路由库。当配置中包含同源页面路径时，在组件或 Anchor 全局配置中提供兼容路由即可；Anchor 会逐项自动判断导航方式。普通点击交给路由器，带 Ctrl、Command 或 Shift 的点击仍保留原生链接行为，可正常在新标签页打开。

<template #example>

<anchor-basic />

</template>

<template #template>

@[code{1-5}](../../.vuepress/components/anchor/basic.vue)

</template>

<template #script>

@[code{7-13}](../../.vuepress/components/anchor/basic.vue)

</template>

<template #style>

@[code{15-20}](../../.vuepress/components/anchor/basic.vue)

</template>

</card>

<card>

<h2 id="anchor-hierarchy">分级锚点</h2>

通过 `children` 递归组织任意层级。带 `href` 的父级仍是正常跳转目标；仅作为分组标题时可以省略 `href`。设置 `collapsible: true` 后可单独收起其子级，`defaultCollapsed` 控制初始状态。当前锚点位于已收起分支时，组件会展开祖先以保持定位可见。

激活标记默认直接渲染内联定位 SVG，因此不依赖任何图标集合。在 `SConfigProvider` 或组件库安装配置中传入 `anchor: { activeIcon: 'collection:name' }` 可统一替换图标；`active-icon` 插槽优先级最高，并接收当前激活项的 `item` 与 `href`。

<template #example>

<anchor-hierarchy />

</template>

<template #template>

@[code{1-5}](../../.vuepress/components/anchor/hierarchy.vue)

</template>

<template #script>

@[code{7-38}](../../.vuepress/components/anchor/hierarchy.vue)

</template>

<template #style>

@[code{40-45}](../../.vuepress/components/anchor/hierarchy.vue)

</template>

</card>

<card>

<h3 id="anchor-secondary">二级链接</h3>

每个项目使用稳定的 `href` 指向真实页面 ID。默认的 `heading` 算法在标题越过 `active-offset + bounds` 后激活它；未传 `active-offset` 时沿用 `offset`。`target-offset` 独立控制点击后的滚动落点。`visible-section` 则比较各标题至下一标题的内容区间，在扣除 `offset` 顶部留白后的视口中各占多少高度。

<h2 id="anchor-horizontal">横向模式</h2>

<template #example>

<anchor-horizontal />

</template>

<template #template>

@[code{1-5}](../../.vuepress/components/anchor/horizontal.vue)

</template>

<template #script>

@[code{7-13}](../../.vuepress/components/anchor/horizontal.vue)

</template>

<template #style>

@[code{15-20}](../../.vuepress/components/anchor/horizontal.vue)

</template>

</card>

<card>

<h2 id="anchor-route-boundary">路由与页内锚点混合导航</h2>

当一份目录同时包含跨路由章节和章节内标题时，只需提供 `router`，不再设置模式。Anchor 会逐项判断：裸 `#hash` 在当前文档滚动，其他同源 pathname 使用路由器，pathname 加 hash 则只在目标文档不同时走路由。前后边界会跨分组扁平化，默认纳入不带 hash 的完整路由；可用 `boundary: true` 纳入 API 这类跨文档 hash，也可用 `false` 排除普通路由。向下越过页底会从下一项开头继续，向上越过页首会从上一项末尾继续。

跨路由的页面落点由路由器和页面滚动容器管理，应瞬时进入新页面，而不要依赖全局平滑滚动样式把旧页面的滚动位置动画带到新页面。页内哈希点击仍使用 Anchor 的 `scroll-behavior` 设置，默认值为 `smooth`。

文档右侧目录采用 `active-strategy="visible-section"`，让哈希高亮跟随可读视口内占比最大的内容区间。组件库对现有应用的默认值仍为 `heading`。可在单个 Anchor 上传 `active-strategy`，或通过 `SConfigProvider`、安装配置中的 `anchor: { activeStrategy: 'visible-section', activeOffset: 160 }` 统一设置；组件局部值优先。`activeOffset` 只影响 `heading` 算法。

通过边界进入下一路由时，目录会先等待新页面的滚动位置稳定在页首，再选中页内哈希。章节开头保持第一个标题激活；继续向下阅读、后续标题进入阅读区域后再切换。

通过 `router` 局部传入兼容 Vue Router 的对象。比如：[vue-smart-router](https://www.npmjs.com/package/vue-smart-router) **等**来实现对路由的操作。

```vue
<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { type AnchorItem, SAnchor } from 'sax-design-vue'

const router = useRouter()
const items: AnchorItem[] = [
  {
    title: 'Table 指南',
    children: [
      { title: '数据定义', href: '/zh/table/data' },
      { title: '行选择', href: '/zh/table/selection' },
      { title: '排序与筛选', href: '/zh/table/sorting' },
    ],
  },
]
</script>

<template>
  <aside>
    <SAnchor :items="items" :router="router" />
  </aside>
  <RouterView />
</template>
```

多个 Anchor 共用路由时，可以在安装 Sax Design Vue 时全局提供一次；组件上的 `router` 始终优先：

```ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import SaxDesignVue from 'sax-design-vue'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/zh/table/data', component: () => import('./DataGuide.vue') },
    {
      path: '/zh/table/selection',
      component: () => import('./SelectionGuide.vue'),
    },
    {
      path: '/zh/table/sorting',
      component: () => import('./SortingGuide.vue'),
    },
  ],
})
const app = createApp(App)

app.use(router)
app.use(SaxDesignVue, {
  anchor: {
    router,
    activeStrategy: 'visible-section',
    activeOffset: 160,
    routeBoundary: {
      threshold: 160,
      armDelay: 320,
      routeCooldown: 1500,
    },
  },
})
```

单个 Anchor 可用 `:route-boundary="false"` 关闭边界滚动，或传入对象覆盖本地阈值。接口不同的路由只需统一适配成 `{ current, push, replace }`。

```ts
import type { AnchorRouterAdapter } from 'sax-design-vue'

const routerAdapter: AnchorRouterAdapter = {
  current: () => customRouter.location.value,
  push: (href) => customRouter.go(href),
  replace: (href) => customRouter.replaceWith(href),
}
```

`current()` 应读取响应式路由状态；路由没有响应式位置时，可改为通过 Anchor 的 `v-model` 同步当前地址。

::: tip 实际体验
[前往 Table 分章节文档体验混合导航 →](/zh/components/table/large-data-and-visualization.html)
:::

<h3 id="anchor-container">滚动容器</h3>

页内锚点和包含路由项的目录默认都监听页面 window。用于面板或虚拟页面时，可通过 `get-container` 返回实际滚动元素；锚点导航、高亮计算和路由边界会使用同一个容器。

<template #example>

<anchor-zh-container />

</template>

<template #template>

@[code{1-16}](../../.vuepress/components/anchor-zh/container.vue)

</template>

<template #script>

@[code{18-29}](../../.vuepress/components/anchor-zh/container.vue)

</template>

<template #style>

@[code{31-71}](../../.vuepress/components/anchor-zh/container.vue)

</template>

</card>

<card>

<h2 id="api">API</h2>

</card>
