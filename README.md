<h1 align="center">Sax Design Vue — Vue 3 UI library</h1>

<p align="center">
  <a href="https://www.npmjs.org/package/sax-design-vue">
    <img src="https://img.shields.io/npm/v/sax-design-vue.svg" alt="npm version">
  </a>
  <a href="https://sax-design.emssion.com/">
    <img src="https://img.shields.io/badge/docs-Website-blue" alt="documentation">
  </a>
  <br>
</p>

- Vue 3 Composition API
- Written in TypeScript
- Components aligned with [Vuesax 3.x](https://vuesax.com/) design language

<div align="center">

English | [简体中文](./README.zh-CN.md)

[Website](https://sax-design.emssion.com/) · [GitHub Pages mirror](https://adoin.github.io/sax-design-vue/)

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

See the full guide on the [documentation website](https://sax-design.emssion.com/).

## Programmatic dialogs

```ts
import { SDialogBox } from 'sax-design-vue'

await SDialogBox.alert('Saved successfully')
try {
  await SDialogBox.confirm('Delete this item?')
} catch {
  // The user cancelled or closed the dialog
}
```

## Development

```bash
pnpm install
pnpm dev          # full documentation site (also pnpm docs:dev)
pnpm dev --component textarea          # one component, both languages
pnpm dev --component textarea --locale zh # Chinese only
pnpm play:dev     # isolated component playground
pnpm build        # library build
```

Focused development includes the selected component's nested pages and referenced
examples, with matching navigation and search. Restart with a different component
to change the scope. Git timestamps are collected only for production builds.
Generated icon, API type, syntax highlighting and Sass caches survive restarts;
source edits invalidate the corresponding cached data. Sass changes still hot update.

## License

[MIT](./LICENSE)
