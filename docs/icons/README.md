# Icons

<card>

## Installation

Sax Design Vue provides a set of common icons, including the upstream Vuesax Alpha set plus additional everyday icons (share, calendar, mail, filter, and more).

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

For published npm installs, use `@vuesax-alpha/icons-vue` until `@sax-design-vue/icons-vue` is published. This repository ships the extended set from `packages/icons-vue`.

</card>

<card>

## Register All Icons

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

## Example

<template #example>

<icons-example />

</template>

<template #template>

@[code{1-7}](../.vuepress/components/icons/example.vue)

</template>

</card>

<card>

## Icon Collection

<template #example>
<icons-collection />
</template>

</card>
