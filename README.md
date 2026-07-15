<h1 align="center">Sax Design Vue — Vue 3 UI library</h1>

<p align="center">
  <a href="https://www.npmjs.org/package/sax-design-vue">
    <img src="https://img.shields.io/npm/v/sax-design-vue.svg" alt="npm version">
  </a>
  <a href="https://adoin.github.io/sax-design-vue/">
    <img src="https://img.shields.io/badge/docs-GitHub%20Pages-blue" alt="documentation">
  </a>
  <br>
</p>

- Vue 3 Composition API
- Written in TypeScript
- Components aligned with [Vuesax 3.x](https://vuesax.com/) design language

<div align="center">

English | [简体中文](./README.zh-CN.md)

</div>

## Getting started

Install Vue and **sax-design-vue**:

```bash
pnpm add vue sax-design-vue
```

Register globally in your app entry:

```ts
import { createApp } from 'vue'
import SaxDesignVue from 'sax-design-vue'
import 'sax-design-vue/theme-chalk/index.css'
import 'sax-design-vue/theme-chalk/dark/css-vars.css'

import App from './App.vue'

createApp(App).use(SaxDesignVue).mount('#app')
```

See the full guide at [https://adoin.github.io/sax-design-vue/](https://adoin.github.io/sax-design-vue/).

## Programmatic dialogs

```ts
import { SPromptBox } from 'sax-design-vue'

await SPromptBox.alert('Saved successfully')
await SPromptBox.confirm('Delete this item?')
```

## Development

```bash
pnpm install
pnpm dev          # play app
pnpm docs:dev     # documentation site
pnpm build        # library build
```

## License

[MIT](./LICENSE)
