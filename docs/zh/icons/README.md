# Icons

<card>

## 安装

Sax Design Vue 提供常用图标，包含上游 Vuesax Alpha 图标集，并补充 share、calendar、mail、filter 等日常图标。

<command>

<template #npm>

```bash
npm install @sax-design-vue/icons-vue
```

</template>

<template #yarn>

```bash
yarn add @sax-design-vue/icons-vue
```

</template>

<template #pnpm>

```bash
pnpm install @sax-design-vue/icons-vue
```

</template>

</command>

npm 发布前可继续使用 `@vuesax-alpha/icons-vue`；本仓库扩展图标位于 `packages/icons-vue`。

</card>

<card>

## 注册全部图标

::: tip
You can change icon name
:::

```ts
// main.ts
import * as SaxIconsVue from '@sax-design-vue/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(SaxIconsVue)) {
  app.component(`SIcon${key}`, component)
}
```

</card>

<card>

## 示例

<template #example>

<icons-example />

</template>

<template #template>

@[code{1-7}](../../.vuepress/components/icons/example.vue)

</template>

</card>

<card>

## Icon Collection

<template #example>
<icons-collection />
</template>

</card>
