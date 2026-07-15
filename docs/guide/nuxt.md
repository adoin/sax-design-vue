# Sax Design Vue + Nuxt

<card>

## Manual setup (recommended)

There is no dedicated Nuxt module for **sax-design-vue** yet. Register the library in a client plugin:

<command>

```ts
// plugins/sax-design-vue.client.ts
import SaxDesignVue from 'sax-design-vue'
import 'sax-design-vue/theme-chalk/index.css'
import 'sax-design-vue/theme-chalk/dark/css-vars.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SaxDesignVue)
})
```

</command>

Add the plugin in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: [],
})
```

</card>

<card>

## Legacy upstream module

The upstream `@vuesax-alpha/nuxt` module targets the **vuesax-alpha** package name. If you use it, alias `vuesax-alpha` to `sax-design-vue` in your Nuxt/Vite config until a first-party module is published.

</card>

<card>

## Test a component

Add a page under `pages/` and try a component:

```html
<template>
  <div class="app">
    <s-button active> Hello Sax Design Vue + Nuxt </s-button>
  </div>
</template>

<style>
  .app {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

</card>
