# 配置

<card>

## 全局注册

在应用启动时注册完整库：

<command>

```ts
import SaxDesignVue from 'sax-design-vue'

app.use(SaxDesignVue)
```

</command>

若需 tree-shaking，仅注册需要的组件 — 见[使用组件](/zh/guide/using-components)。

</card>

<card>

## 颜色令牌

Sax Design Vue 不只有 `--sax-primary`，而是一套完整颜色令牌系统。颜色令牌存储的是**以逗号分隔的 RGB 三通道**，不是完整 CSS 颜色值。这样设计是为了让组件基于同一令牌派生透明态，例如 `rgba(var(--sax-primary), 0.12)`。

覆盖下列颜色令牌时使用 `25, 91, 255` 这种格式；不要写 `#195bff`、`rgb(25 91 255)` 或 `hsl(...)`：

<command>

```css
:root {
  --sax-primary: 37, 99, 255;
  --sax-success: 34, 197, 94;
  --sax-danger: 239, 68, 68;
}

html.dark {
  --sax-primary: 96, 165, 250;
}
```

</command>

| 令牌                                                | 默认通道值                                       | 用途                             |
| --------------------------------------------------- | ------------------------------------------------ | -------------------------------- |
| `--sax-primary`                                     | `25, 91, 255`                                    | 品牌色和主操作。                 |
| `--sax-success`                                     | `70, 201, 58`                                    | 成功反馈。                       |
| `--sax-warn`                                        | `255, 186, 0`                                    | 警告反馈。                       |
| `--sax-danger` / `--sax-error`                      | `255, 71, 87`                                    | 危险和错误反馈。                 |
| `--sax-info`                                        | `144, 147, 153`                                  | 中性信息反馈。                   |
| `--sax-dark` / `--sax-light`                        | `30, 30, 30` / `244, 247, 248`                   | 语义化深浅表面。                 |
| `--sax-color` / `--sax-white` / `--sax-black`       | `17, 18, 20` / `255, 255, 255` / `0, 0, 0`       | 基础前景色和绝对中性色。         |
| `--sax-gray-1` … `--sax-gray-4`                     | `249, 252, 253` … `230, 233, 234`                | 中性色阶。                       |
| `--sax-divider` / `--sax-text` / `--sax-background` | `206, 208, 212` / `44, 62, 80` / `255, 255, 255` | 共享分割线、文本和历史背景令牌。 |

表面类令牌同样支持运行时覆盖：`--sax-text-color`、`--sax-text-color-regular`、`--sax-text-color-secondary`、`--sax-text-color-placeholder`、`--sax-text-color-disabled`；`--sax-bg-color`、`--sax-bg-color-page`、`--sax-bg-color-overlay`；`--sax-border-color` 及 `-light`、`-lighter`、`-extra-light`、`-dark`、`-darker`；以及同样层级的 `--sax-fill-color` 和 `-blank`。除 `--sax-fill-color-blank` 保持语义值 `transparent` 外，所有颜色令牌都使用 RGB 三通道。

每个语义色还提供 `--sax-<type>-light-1` 到 `-light-9` 和 `--sax-<type>-dark-2`（`type` 为 `primary`、`success`、`warn`、`danger`、`error`、`info`、`dark` 或 `light`）。这些色阶在主题构建阶段由 Sass 生成；若运行时改了基础色，并希望某个色阶同步变化，需要显式覆盖对应的色阶令牌。

暗色样式会覆盖表面、文本、边框和填充类令牌。本站使用同一套令牌系统 — 可用导航栏主题开关预览暗色模式。

</card>

<card>

## 组件语言

组件自动生成的文字——包括日历月份和星期、日期/时间控件、分页、上传状态、空状态、操作按钮和无障碍标签——都读取 `SConfigProvider` 提供的语言包。默认英文；使用内置中文包即可切换为中文界面：

<command>

```vue
<script setup lang="ts">
import { zhCn } from 'sax-design-vue/locales'
</script>

<template>
  <s-config-provider :locale="zhCn">
    <app />
  </s-config-provider>
</template>
```

</command>

同一入口也提供 `en`，用于显式指定英文。`locale` 传入响应式值时，切换语言会直接更新组件生成的文字，不需要重建组件树。用户传入的 label、slot 和 placeholder 保持由应用自行控制。

</card>

<card>

## 圆角与动效令牌

下面的全局令牌用于统一组件几何和动效。`--sax-radius` 是主圆角：核心输入框、菜单、弹出层、树、按钮、分页等共享控件会通过派生变量继承它。

<command>

```css
:root {
  /* 修改一个值，即可改变共享组件的圆角尺度。 */
  --sax-radius: 10px;

  /* 修改一个值，即可整体加快或放慢共享交互动效。 */
  --sax-motion-duration: 180ms;
  --sax-motion-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

</command>

| 变量                                                                                                                      | 默认值                            | 用途                                                 |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------- |
| `--sax-radius`                                                                                                            | `12px`                            | 标准容器和控件的主圆角。                             |
| `--sax-radius-xs` / `--sax-radius-sm` / `--sax-radius-md`                                                                 | 派生值                            | 紧凑控件圆角，由主圆角推导。                         |
| `--sax-radius-lg` / `--sax-radius-xl` / `--sax-radius-2xl` / `--sax-radius-3xl`                                           | 派生值                            | 大容器、强调表面和富表现力的历史造型圆角。           |
| `--sax-radius-pill` / `--sax-radius-circle`                                                                               | `9999px` / `50%`                  | 胶囊和圆形控件的语义圆角。                           |
| `--sax-radius-loader-orb-a` / `-b` / `-c`                                                                                 | 派生造型预设                      | 三个非对称加载器插画的可选覆盖。                     |
| `--sax-radius-avatar` / `--sax-radius-checkbox`                                                                           | `35%` / `32%`                     | Avatar 和复选框视觉变体的可选造型覆盖。              |
| `--sax-motion-duration`                                                                                                   | `0.25s`                           | 共享过渡时长。                                       |
| `--sax-motion-duration-fast` / `--sax-motion-duration-slow` / `--sax-motion-duration-loop` / `--sax-motion-duration-long` | `0.18s` / `0.43s` / `0.7s` / `1s` | 紧凑状态变化、入场、循环动画和长列表过渡的可选时长。 |
| `--sax-motion-easing`                                                                                                     | `cubic-bezier(.645,.045,.355,1)`  | 默认共享缓动曲线。                                   |
| `--sax-motion-easing-emphasized` / `--sax-motion-easing-standard`                                                         | 内置曲线                          | 入场和状态变化动效的可选覆盖。                       |

胶囊和圆形控件刻意使用语义令牌，以保持胶囊和圆形外观。旧的 `--sax-border-radius-*` 与 `--sax-transition-*` 变量仍可使用；它们现在会通过这些全局令牌取值，因此已有覆盖不会失效。

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

Vite 默认会从 `node_modules` 解析 `sax-design-vue`，不需要再配置别名。安装 `unplugin-vue-components` 后，用一个小型解析器按需注册 **S** 前缀组件；Sax 样式只需在应用入口导入一次。

<command>

```ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'

const SaxDesignVueResolver = (name: string) => {
  if (!name.startsWith('S')) return

  return { name, from: 'sax-design-vue' }
}

export default defineConfig({
  plugins: [
    Components({
      resolvers: [SaxDesignVueResolver],
    }),
  ],
})
```

</command>

```ts
// src/main.ts
import 'sax-design-vue/theme-chalk/index.css'
import 'sax-design-vue/theme-chalk/dark/css-vars.css'
```

该解析器直接从包根导入组件，不依赖硬编码文件路径。也可以直接从 `sax-design-vue` 按需导入组件。

</card>

<card>

## Nuxt

SSR 相关说明见 [Nuxt 集成](/zh/guide/nuxt/)。

</card>
