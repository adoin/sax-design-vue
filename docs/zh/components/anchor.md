---
PROPS:
  - name: mode
    type: String
    values: 'anchor / router'
    description: anchor 处理页内哈希；router 根据同级路由项自动生成前后边界并使用路由适配器导航。
    default: anchor
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
    values: '{ href, title, disabled?, collapsible?, defaultCollapsed?, children? }[]'
    description: 递归导航配置；href 为哈希时在当前页滚动，为路由或 URL 时渲染普通链接。children 可继续嵌套，collapsible 控制该项是否允许收起子级。
    default: '[]'
  - name: router
    type: AnchorRouterAdapter
    values: '{ push, replace?, current?, currentRoute? }'
    description: 当前 Anchor 使用的路由对象；局部配置优先于全局 anchor.router，兼容 Vue Router 及同形路由。
    default: null
  - name: route-boundary
    type: Boolean | AnchorRouteBoundaryOptions
    description: router 模式下自动生成的悬浮前后边界；false 关闭，也可配置 threshold、armDelay 和 routeCooldown。
    default: true
  - name: offset
    type: Number
    values: 'pixels'
    description: 分别控制激活判定偏移、点击滚动偏移和判定容差。
    default: '88'
  - name: target-offset
    type: Number
    values: 'pixels'
    description: 分别控制激活判定偏移、点击滚动偏移和判定容差。
    default: 'offset'
  - name: bounds
    type: Number
    values: 'pixels'
    description: 分别控制激活判定偏移、点击滚动偏移和判定容差。
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
    description: 导航前触发，参数为当前项和 MouseEvent；router 模式随后将普通路由点击交给已配置的适配器。
  - name: collapse-change
    description: 可折叠锚点项展开或收起时触发，参数为当前项与收起状态。
SLOTS:
  - name: active-icon
    type: 'Slot<{ item: AnchorItem, href: string }>'
    description: 替换激活标记，优先级高于 Anchor 全局图标配置。
    default: null
  - name: route-previous
    type: 'Slot<{ item: AnchorRouteBoundaryItem, direction: previous, visible: boolean, navigating: boolean, progress: number }>'
    description: 替换 router 模式自动生成的上一条路由提示文字，保留链接、图标和进度指示。
    default: null
  - name: route-next
    type: 'Slot<{ item: AnchorRouteBoundaryItem, direction: next, visible: boolean, navigating: boolean, progress: number }>'
    description: 替换 router 模式自动生成的下一条路由提示文字，保留链接、图标和进度指示。
    default: null
description: '用于在当前页面的内容区块或相关路由之间快速导航。'
---

# Anchor 锚点

<card>

<docs-warn />

<anchor-default />

<h2 id="anchor-default">默认用法</h2>

使用哈希 `href` 定位当前页面的标题，也可以传入相对路径、根路径或完整 URL 跳转到其他路由。Anchor 使用语义化链接渲染，因此路由项保留在新标签页打开、复制链接地址等浏览器标准行为。

Anchor 本身不依赖路由库。使用 `router` 模式时，在组件或 Anchor 全局配置中提供兼容路由即可自动接管普通点击；带 Ctrl、Command 或 Shift 的点击仍使用原生链接行为，可正常在新标签页打开。

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

通过 `children` 递归组织任意层级。父级仍是正常的跳转目标；设置 `collapsible: true` 后可单独收起其子级，`defaultCollapsed` 控制初始状态。当前锚点位于已收起分支时，组件会展开祖先以保持定位可见。

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

每个项目使用稳定的 `href` 指向真实页面 ID。`offset` 控制项目何时高亮，`target-offset` 控制点击后的最终滚动位置。

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

<h2 id="anchor-route-boundary">路由模式</h2>

设置 `mode="router"` 后继续使用普通的递归 `items`。Anchor 会找到与路由当前位置匹配的项目，从它的同级路由项中推导前后章节，并在内部自动生成悬浮的上下边界。哈希子项仍是当前页面锚点，不会进入跨路由顺序。

通过 `router` 局部传入兼容 Vue Router 的对象。比如：[vue-smart-router](https://www.npmjs.com/package/vue-smart-router) **等**来实现对路由的操作。

```vue
<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { type AnchorItem, SAnchor } from 'sax-design-vue'

const router = useRouter()
const items: AnchorItem[] = [
  {
    title: 'Table 指南',
    href: '/zh/table',
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
    <SAnchor mode="router" :items="items" :router="router" />
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
[前往 Table 分章节文档体验路由模式 →](/zh/components/table/large-data-and-visualization.html)
:::

<h3 id="anchor-container">滚动容器</h3>

普通锚点和路由模式默认都监听页面 window。用于面板或虚拟页面时，可通过 `get-container` 返回实际滚动元素；锚点导航、高亮计算和路由边界会使用同一个容器。

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
