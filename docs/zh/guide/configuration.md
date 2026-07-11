# 配置

<card>

## 全局注册

在应用启动时注册完整库：

<command>

```ts
import Vuesax from 'vuesax-alpha'

app.use(Vuesax)
```

</command>

若需 tree-shaking，仅注册需要的组件 — 见[使用组件](/zh/guide/using-components)。

</card>

<card>

## 主题变量

Vuesax 组件读取 `--vs-primary` 等 CSS 变量。可在 `:root` 或 `html.dark` 上覆盖：

<command>

```css
:root {
  --vs-primary: 37, 99, 255;
}

html.dark {
  --vs-primary: 96, 165, 250;
}
```

</command>

本站使用相同变量系统 — 可用导航栏主题开关预览暗色模式。

</card>

<card>

## 单组件配置

每个组件页文档包含：

- **Props** — 类型化配置（颜色、尺寸、变体）
- **Events** — `v-model` 与交互回调
- **Slots** — 组合与自定义内容
- **示例 + 代码** — 实时预览与可复制片段

从默认示例开始，再跳转到页面底部的 API 表。

</card>

<card>

## 自动导入 (Vite)

使用 `unplugin-vue-components` 与官方 resolver：

<command>

```ts
import Components from 'unplugin-vue-components/vite'
import { VuesaxAlphaResolver } from '@vuesax-alpha/auto-import-resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [VuesaxAlphaResolver({ importStyle: 'sass' })],
    }),
  ],
})
```

</command>

</card>

<card>

## Nuxt

SSR 相关说明见 [Nuxt 集成](/zh/guide/nuxt/)。

</card>
