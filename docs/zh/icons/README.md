# Icons（图标）

`SIcon` 渲染 Iconify SVG 数据，不需要图标字体、全局图标 CSS，也不会在运行时请求 Iconify API。Vite 插件只提取应用真正使用的图标。

Sax 组件会为自身默认控件携带一小组 Carbon 回退数据，因此分页箭头、关闭按钮、选择器提示、表格操作等内部图标在未配置 Carbon 时仍能显示。显式 `iconData` 和应用注册的图标优先于回退数据；IconPicker 仅在使用该组件时加载更完整的内置默认列表。应用自行选择的图标名仍需按下文配置对应集合或 `safelist`。

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

| 属性      | 类型                             | 默认值         | 说明                                          |
| --------- | -------------------------------- | -------------- | --------------------------------------------- |
| `name`    | `string`                         | —              | 已注册的 Iconify 名称，格式为 `prefix:name`。 |
| `size`    | `number \| string`               | `1em`          | 宽高；数字按像素处理。                        |
| `color`   | `string`                         | `currentColor` | CSS 颜色或 Sax 主题色。                       |
| `rotate`  | `number \| string`               | `0`            | 旋转角度；数字按度处理。                      |
| `flip`    | `horizontal \| vertical \| both` | —              | 水平、垂直或双向镜像。                        |
| `rolling` | `boolean \| number`              | `false`        | 持续旋转；数字表示每圈秒数。                  |
| `label`   | `string`                         | —              | 无障碍名称；未设置时视为装饰图标。            |

<card>

<h2 id="morphing">图标变形</h2>

给 `SIcon` 添加 `morph`，改变 `name` 时，当前图标会平滑变为新图标。下面以展开、收起箭头为例，`expanded` 是页面中的展开状态。

原生描边新增、消失的轮廓会沿原路径画出或收回；填充图标继续使用几何插值并保留复合孔洞。动画中途改选图标时，从当前几何与绘制结果衔接到新目标。

<command>

```vue
<s-icon :name="expanded ? 'cb:chevron-up' : 'cb:chevron-down'" morph />
```

</command>

选择一个示例，然后点击“切换图标”查看效果。“动画时长”决定切换需要多久，“动画效果”决定图标是平滑停下还是带有回弹。多色和渐变示例通过 `iconData` 提供 SVG，使用相同的 `morph` 配置。

<template #example><icons-zh-morph /></template>

<template #template>

@[code{83-129}](../../.vuepress/components/icons-zh/morph.vue)

</template>

<template #script>

@[code{1-81}](../../.vuepress/components/icons-zh/morph.vue)

</template>

<template #style>

@[code{131-161}](../../.vuepress/components/icons-zh/morph.vue)

</template>

</card>

<card>

<h2 id="global-morphing">全局变形配置</h2>

在安装组件库时，或通过 `SConfigProvider` 设置 `icon.morph`，可以让作用范围内的图标默认开启变形。使用 `SIcon` 的组件图标也会继承，例如 `Button`、`Tab` 的 `icon` 属性。局部 `morph` 配置可以覆盖默认值；传入 `:morph="false"` 可关闭某个图标的动画。

<command>

```ts
app.use(SaxDesignVue, {
  icon: { morph: { duration: 360, spring: 'snappy' } },
})
```

```vue
<s-config-provider :icon="{ morph: { duration: 400 } }">
  <s-button
    :icon="expanded ? 'cb:chevron-up' : 'cb:chevron-down'"
    @click="expanded = !expanded"
  >展开 / 收起</s-button>
  <s-icon name="cb:pin" :morph="false" />
</s-config-provider>
```

</command>

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| morph | boolean &#124; IconMorphOptions | false | 开启或关闭图标变形；传入对象可调整动画。 |
| morph.duration | number | 360 | 动画时长，单位毫秒；设为 0 时立即切换。 |
| morph.spring | 'smooth' &#124; 'snappy' &#124; 'bouncy' | snappy | smooth 平滑停下；snappy 轻微回弹；bouncy 明显回弹。 |

首次显示图标时不会播放变形。系统开启“减少动态效果”时直接切换。连续改变图标会从当前画面继续；带有蒙版、滤镜或图案等不支持的 SVG 会直接显示新图标。

`morph-start` 在动画开始时触发，`morph-end` 在完成时触发，参数为 `{ elapsed }`，其中 `elapsed` 是已经经过的毫秒数。被新图标打断的动画不会触发完成事件。

</card>
