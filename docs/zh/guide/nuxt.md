# Sax Design Vue + Nuxt

<card>

## 手动接入（推荐）

**sax-design-vue** 暂无专用 Nuxt 模块。在客户端插件中注册：

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

</card>

<card>

## 上游 Nuxt 模块

上游 `@vuesax-alpha/nuxt` 面向 **vuesax-alpha** 包名。若仍使用该模块，请在 Nuxt/Vite 配置中将 `vuesax-alpha` 别名指向 `sax-design-vue`，直至发布本项目专用模块。

</card>

<card>

## 测试组件

在 `pages/` 下新建页面，例如：

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
