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

## Register globally

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
import { VsAlert, VsButton } from 'vuesax-alpha'
import App from './App.vue'

import 'vuesax-alpha/theme-chalk/index.css'
import 'vuesax-alpha/theme-chalk/dark/css-vars.css'

createApp(App).use(VsAlert).use(VsButton).mount('#app')
```

</command>

See [Using Components](/guide/using-components) for resolver / auto-import setup.

</card>

<card>

## Try online first

Open the [Playground](/guide/playground) to preview components before wiring them into your app.

</card>
