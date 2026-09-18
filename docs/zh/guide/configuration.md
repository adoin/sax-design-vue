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

颜色令牌分为两层。`--sax-primary` 这类通道令牌保存 HSL 值；`--sax-css-primary` 这类完整颜色令牌包装为 `hsl(var(--sax-primary))`。组件读取完整颜色令牌（`var(--sax-css-primary)` 或 `color-mix(in srgb, var(--sax-css-primary) 12%, transparent)`），因此主题仍可编辑 H/S/L，应用也可以把 `--sax-css-primary` 覆盖成任意 CSS 颜色。

<command>

```css
:root {
  --sax-theme-primary-h: 222.8deg;
  --sax-theme-primary-s: 100%;
  --sax-theme-primary-l: 54.9%;
  --sax-theme-primary-dark-h: var(--sax-theme-primary-h);
  --sax-theme-primary-dark-s: 92%;
  --sax-theme-primary-dark-l: 70%;
}

.hero {
  --sax-css-primary: oklch(0.62 0.18 264);
}
```

</command>

`SConfigProvider` 的 `theme` 属性或 `applyThemeConfig()` 可直接接收 HEX、RGB、HSL，并生成主色、暗色主色与 hover / active / subtle 状态变量。完整示例见[颜色主题](/zh/theme/)。`--sax-primary` 等组合令牌仍可读取，但自定义主题应优先修改 `--sax-theme-primary-*` 主键。需要完整 CSS 颜色时覆盖 `--sax-css-*`。

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

## 全局日期与时间配置

通过 `SConfigProvider` 的 `timezone` 为 Date Picker、Date Range Picker 与 Time Picker 设置默认 IANA 时区。`auto-apply-now` 决定点击“此刻”后是否立即提交并关闭。组件上的同名属性优先级更高。

<command>

```vue
<template>
  <s-config-provider timezone="Asia/Shanghai" :auto-apply-now="true">
    <app />
  </s-config-provider>
</template>
```

</command>

时区不会改变用户输入的年月日时分秒文本，但会改变它对应的 `Date`、`value-format="x"` 或 `value-format="timestamp"` 绝对时间。`timestamp` 输出毫秒数字，`x` 输出毫秒字符串。

SSR / SSG 可以直接渲染日期组件。服务端与客户端应配置相同的 `timezone`，避免绝对时间因系统时区不同产生 hydration 不一致；只有刻意依赖浏览器系统时区时才需要考虑 `client-only`。

</card>

<card>

## 全局组件外形

在 `SConfigProvider` 上设置 `shape="square"`，支持外形配置的控件及其弹出层会默认使用直角。组件自身的 `shape` 优先级更高，因此仍可按需局部覆盖为 `rounded`，或使用组件支持的 `circle`、`pill`。

<command>

```vue
<template>
  <s-config-provider shape="square">
    <s-input placeholder="继承全局直角" />
    <s-select placeholder="继承全局直角" />
    <s-button>继承全局直角</s-button>

    <s-input shape="rounded" placeholder="局部恢复圆角" />
  </s-config-provider>
</template>
```

</command>

未配置全局值时仍默认为 `rounded`。嵌套的 Provider 会继承上层 `shape`，只有显式传入时才会覆盖。

完整安装组件库时也可以一次性配置：`app.use(SaxDesignVue, { shape: 'square' })`。

</card>

<card>

## 全局尺寸

`size` 为使用共享 `small` / `default` / `large` 尺寸体系的组件设置默认密度。目前 Button、Input、Date Picker、Time Picker、Rate、Steps、Tabs 和 Tag 会继承该值。组件显式传入的 `size` 始终优先。

<command>

```vue
<template>
  <s-config-provider size="large">
    <s-input placeholder="继承 large" />
    <s-button>继承 large</s-button>
    <s-button size="small">局部覆盖为 small</s-button>
  </s-config-provider>
</template>
```

</command>

Calendar、Navbar 等组件使用自己的尺寸语义（例如 `medium`、`compact`），不会错误套用这组全局值。

</card>

<card>

## 常用交互默认值

对全应用重复出现的交互策略，可分别通过 `button`、`dialog`、`drawer`、`notification`、`pagination` 和 `popper` 设置默认值。它们只接收适合复用的入参；内容、受控值、回调和业务数据仍保留在组件实例上。

<command>

```vue
<script setup lang="ts">
const buttonDefaults = { debounce: false }
const dialogDefaults = { maskClosable: false, lockScroll: true }
const notificationDefaults = {
  duration: 6000,
  position: 'top-right' as const,
  showClose: true,
}
const paginationDefaults = {
  pageSizes: [20, 50, 100],
  pagerCount: 9,
}
</script>

<template>
  <s-config-provider
    :button="buttonDefaults"
    :dialog="dialogDefaults"
    :notification="notificationDefaults"
    :pagination="paginationDefaults"
  >
    <app />
  </s-config-provider>
</template>
```

</command>

Drawer 可统一 `placement`、`size`、关闭按钮、遮罩关闭和 Teleport；直接使用 `SPopper` 时可统一显示/隐藏延迟、Teleport、定位策略、翻转、偏移、箭头和持久挂载。Tooltip、Select、Date Picker 等基于 Popper 的复合组件保留自己的语义默认，不会被底层 `popper` 配置意外改变。

</card>

<card>

## Table 全局默认值

`table` 用于统一多个 Table 实例的功能策略和显示默认值。它支持编辑、校验、历史、变更追踪、拖拽、键盘、区域、剪贴板、查找、图表、上下文菜单、列宽调整、虚拟滚动、多列排序、选择、分页、溢出显示、父级提示、表头、斑马纹、单复选模式和 `rowKey` 等可复用配置。

<command>

```vue
<script setup lang="ts">
import type { TableGlobalConfig } from 'sax-design-vue'

const tableDefaults: TableGlobalConfig = {
  striped: true,
  showOverflow: 'tooltip',
  editConfig: {
    mode: 'cell',
    onSwitch: 'commit',
    onContextChange: 'cancel',
    onScroll: 'keep',
  },
  selectionConfig: { trigger: 'row', reserve: true },
  virtualConfig: { estimateSize: 48, overscan: 6 },
}
const rows = [{ id: 1, name: '示例' }]
const columns = [{ field: 'name', title: '名称' }]
</script>

<template>
  <s-config-provider :table="tableDefaults">
    <s-table :data="rows" :columns="columns" />

    <!-- 标量和 false 直接覆盖；对象字段与全局对象合并。 -->
    <s-table
      :data="rows"
      :columns="columns"
      :striped="false"
      :edit-config="false"
      :selection-config="{ trigger: 'cell' }"
    />
  </s-config-provider>
</template>
```

</command>

优先级为“组件显式值 > 最近一层 Provider > 外层 Provider > 组件内置默认值”。对象配置按字段浅合并；显式 `false` 可以关闭全局启用的功能。数据、受控状态、列定义、渲染器、校验规则、业务请求与回调仍必须放在具体 Table 上，避免不同数据模型之间产生隐式耦合。

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

SSR 相关说明见 [Nuxt 集成](/zh/guide/nuxt.html)。

</card>
