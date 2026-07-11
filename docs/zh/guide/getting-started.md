# 快速开始

<card>

## 环境要求

Sax Design Vue 面向 **Vue 3.3+**，推荐使用现代打包工具（Vite）。请先安装 Vue，再添加组件库。

</card>

<card>

## 安装

<command>

<template #pnpm>

```bash
pnpm add vue vuesax-alpha
```

</template>

<template #npm>

```bash
npm install vue vuesax-alpha
```

</template>

<template #yarn>

```bash
yarn add vue vuesax-alpha
```

</template>

</command>

</card>

<card>

## 全局注册

<command>

```ts
import { createApp } from 'vue'
import Vuesax from 'vuesax-alpha'
import App from './App.vue'

import 'vuesax-alpha/theme-chalk/index.css'
import 'vuesax-alpha/theme-chalk/dark/css-vars.css'

createApp(App).use(Vuesax).mount('#app')
```

</command>

即使从浅色模式开始，也建议引入暗色 CSS 变量文件，以支持运行时主题切换。

</card>

<card>

## 深色 / 浅色主题

切换 `html` 元素的 `dark` 类（本站通过导航栏开关使用相同方式）：

<command>

```ts
document.documentElement.classList.toggle('dark')
```

</command>

或使用 `@vueuse/core`：

<command>

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

</command>

</card>

<card>

## 按需引入

<command>

```ts
import { createApp } from 'vue'
import { VsAlert, VsButton } from 'vuesax-alpha'
import App from './App.vue'

import 'vuesax-alpha/theme-chalk/index.css'
import 'vuesax-alpha/theme-chalk/dark/css-vars.css'

createApp(App).use(VsAlert).use(VsButton).mount('#app')
```

</command>

自动导入配置见[使用组件](/zh/guide/using-components)。

</card>

<card>

## 在线试用

在集成到项目前，可先打开 [Playground](/zh/guide/playground) 预览组件。

</card>
