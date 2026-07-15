<h1 align="center">Sax Design Vue — Vue 3 组件库</h1>

<p align="center">
  <a href="https://www.npmjs.org/package/sax-design-vue">
    <img src="https://img.shields.io/npm/v/sax-design-vue.svg" alt="npm 版本">
  </a>
  <a href="https://adoin.github.io/sax-design-vue/">
    <img src="https://img.shields.io/badge/文档-GitHub%20Pages-blue" alt="文档">
  </a>
  <br>
</p>

- Vue 3 Composition API
- TypeScript 编写
- 组件视觉与交互对齐 [Vuesax 3.x](https://vuesax.com/)

<div align="center">

[English](./README.md) | 简体中文

</div>

## 快速开始

安装 Vue 与 **sax-design-vue**：

```bash
pnpm add vue sax-design-vue
```

在入口文件中全局注册：

```ts
import { createApp } from 'vue'
import SaxDesignVue from 'sax-design-vue'
import 'sax-design-vue/theme-chalk/index.css'
import 'sax-design-vue/theme-chalk/dark/css-vars.css'

import App from './App.vue'

createApp(App).use(SaxDesignVue).mount('#app')
```

完整文档：[https://adoin.github.io/sax-design-vue/](https://adoin.github.io/sax-design-vue/)

## 命令式弹窗

```ts
import { SPromptBox } from 'sax-design-vue'

await SPromptBox.alert('保存成功')
await SPromptBox.confirm('确定删除？')
```

## 本地开发

```bash
pnpm install
pnpm dev          # Play 调试
pnpm docs:dev     # 文档站点
pnpm build        # 构建组件库
```

## 许可证

[MIT](./LICENSE)
