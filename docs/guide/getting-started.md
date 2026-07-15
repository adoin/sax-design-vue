# Getting Started

<card>

## Prerequisites

Sax Design Vue targets **Vue 3.3+** with a modern bundler (Vite recommended). Install Vue first, then add the component library.

</card>

<card>

## Installation

<command>

<template #pnpm>

```bash
pnpm add vue sax-design-vue
```

</template>

<template #npm>

```bash
npm install vue sax-design-vue
```

</template>

<template #yarn>

```bash
yarn add vue sax-design-vue
```

</template>

</command>

</card>

<card>

## Register globally

<command>

```ts
import { createApp } from 'vue'
import SaxDesignVue from 'sax-design-vue'
import App from './App.vue'

import 'sax-design-vue/theme-chalk/index.css'
import 'sax-design-vue/theme-chalk/dark/css-vars.css'

createApp(App).use(SaxDesignVue).mount('#app')
```

</command>

Import the dark CSS variables file even if you start in light mode — it enables runtime theme switching.

</card>

<card>

## Dark / light theme

Toggle the `html` element class `dark` (the docs site uses the same approach via the navbar switch):

<command>

```ts
document.documentElement.classList.toggle('dark')
```

</command>

Or use `@vueuse/core`:

<command>

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

</command>

</card>

<card>

## On-demand components

<command>

```ts
import { createApp } from 'vue'
import { SAlert, SButton } from 'sax-design-vue'
import App from './App.vue'

import 'sax-design-vue/theme-chalk/index.css'
import 'sax-design-vue/theme-chalk/dark/css-vars.css'

createApp(App).use(SAlert).use(SButton).mount('#app')
```

</command>

See [Using Components](/guide/using-components) for resolver / auto-import setup.

</card>

<card>

## Try online first

Open the [Playground](/guide/playground) to preview components before wiring them into your app.

</card>
