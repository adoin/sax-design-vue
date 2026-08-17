# Icons（图标）

`SIcon` 渲染 Iconify SVG 数据，不需要图标字体、全局图标 CSS，也不会在运行时请求 Iconify API。Vite 插件只提取应用真正使用的图标。

当前集成仅面向 Vite，支持 Vite 4、5、8，不提供 Webpack 适配层。

## 查找图标

前往 [Iconify 图标集合](https://icon-sets.iconify.design/) 搜索，然后复制页面提供的 `prefix:name`。

- [Carbon](https://icon-sets.iconify.design/carbon/)：Sax 内部组件采用的默认视觉风格，示例简写为 `cb:`。
- [BoxIcons](https://icon-sets.iconify.design/bx/)：Sax 模板中可使用更直观的 `bx:` 别名。
- [BoxIcons Solid](https://icon-sets.iconify.design/bxs/)：使用 `bxs:`。
- [BoxIcons Logos](https://icon-sets.iconify.design/bxl/)：使用 `bxl:`。

```vue
<s-icon name="cb:add" />
<s-icon name="bx:book" />
<s-icon name="bxs:heart" />
```

## 安装

只安装构建插件：

```bash
pnpm add -D sax-design-vue-iconify
```

## 配置图标集合与动态安全清单

在项目根目录创建 `sax-icons.config.ts`。使用 API 模式时，无需安装任何 `@iconify-json/*` 包：

```ts
import { defineSaxIconConfig } from 'sax-design-vue-iconify'

export default defineSaxIconConfig({
  mode: 'api',
  collections: {
    cb: 'carbon',
    bx: 'bx',
  },
  // 仅用于无法静态发现的名称，例如后端接口返回的图标值。
  safelist: ['cb:add', 'bx:book'],
})
```

左侧是项目内使用的短前缀，右侧是 Iconify 集合名。API 模式只请求静态扫描和 `safelist` 实际命中的图标，并把响应缓存到 `node_modules/.cache/sax-design-vue-iconify`。首轮构建需要网络，后续构建读取缓存。

需要离线、固定版本构建时，使用默认本地模式并安装集合包：

```bash
pnpm add -D @iconify-json/carbon @iconify-json/bx
```

删除 `mode: 'api'` 或改为 `mode: 'local'` 即可。可通过 `api.baseUrl`、`api.cacheDir` 和 `api.timeout` 调整 API 地址、缓存目录和超时；`cacheDir: false` 可关闭磁盘缓存。

API 模式内置三个可选端点，默认使用第一个。需要切换时直接从常量三选一；仍可传入私有 Iconify-compatible 地址：

```ts
import {
  DEFAULT_API_ENDPOINTS,
  defineSaxIconConfig,
} from 'sax-design-vue-iconify'

export default defineSaxIconConfig({
  mode: 'api',
  collections: { cb: 'carbon' },
  api: {
    // 0: Iconify，1: SimpleSVG，2: UniSVG
    baseUrl: DEFAULT_API_ENDPOINTS[1],
  },
})
```

在 Vue 插件之前注册 Vite 插件：

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { saxIcons } from 'sax-design-vue-iconify/vite'
import iconConfig from './sax-icons.config'

export default defineConfig({
  plugins: [saxIcons(iconConfig), vue()],
})
```

插件会自动把 `safelist` 注册模块注入 Vite HTML 入口，应用入口无需再写注册代码。

## 树摇规则

静态名称会被自动发现：

```vue
<s-icon name="cb:add" />
```

构建阶段从本地集合或 Iconify API 取得 `add`，最终只输出这一份 SVG 数据。注册 Carbon 不会把完整集合放进浏览器产物，也不会产生浏览器运行时请求。

动态名称无法静态推断：

```vue
<s-icon :name="record.icon" />
```

需要把后端可能返回的每个值加入 `safelist`。最终仍只输出清单内的图标。

## 尺寸、颜色、旋转和滚动

<card>
<template #example>
  <icons-example />
</template>

<template #template>

@[code](../../.vuepress/components/icons/example.vue)

</template>
</card>

`color` 默认为 `currentColor`，会自动继承周围文字和主题颜色。

`rolling` 传 `true` 时使用 CSS 变量 `--sax-icon-rolling-duration` 的默认值 `0.9s`。传正数时表示每圈秒数，并通过行内 CSS 变量覆盖默认速度；数值越小，旋转越快：

```vue
<s-icon name="cb:renew" rolling />
<s-icon name="cb:renew" :rolling="1.8" />
```

## 常用示例

<card>
<template #example>
  <icons-collection />
</template>
</card>

## API

| 属性      | 类型                             | 默认值         | 说明                                          |
| --------- | -------------------------------- | -------------- | --------------------------------------------- |
| `name`    | `string`                         | —              | 已注册的 Iconify 名称，格式为 `prefix:name`。 |
| `size`    | `number \| string`               | `1em`          | 宽高；数字按像素处理。                        |
| `color`   | `string`                         | `currentColor` | CSS 颜色或 Sax 主题色。                       |
| `rotate`  | `number \| string`               | `0`            | 旋转角度；数字按度处理。                      |
| `flip`    | `horizontal \| vertical \| both` | —              | 水平、垂直或双向镜像。                        |
| `rolling` | `boolean \| number`              | `false`        | 持续旋转；数字表示每圈秒数。                  |
| `label`   | `string`                         | —              | 无障碍名称；未设置时视为装饰图标。            |
