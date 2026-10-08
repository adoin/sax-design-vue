<h1 align="center">Sax Design Vue — Vue 3 组件库</h1>

<p align="center">
  <a href="https://www.npmjs.org/package/sax-design-vue">
    <img src="https://img.shields.io/npm/v/sax-design-vue.svg" alt="npm 版本">
  </a>
  <a href="https://sax-design.emssion.com/">
    <img src="https://img.shields.io/badge/文档-官网-blue" alt="文档">
  </a>
  <br>
</p>

- Vue 3 Composition API
- TypeScript 编写
- 组件视觉与交互对齐 [Vuesax 3.x](https://vuesax.com/)

<div align="center">

[English](./README.md) | 简体中文

[官网](https://sax-design.emssion.com/) · [GitHub Pages 镜像](https://adoin.github.io/sax-design-vue/zh/)

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

完整文档：[Sax Design Vue 官网](https://sax-design.emssion.com/zh/)

## 命令式弹窗

```ts
import { SDialogBox } from 'sax-design-vue'

await SDialogBox.alert('保存成功')
try {
  await SDialogBox.confirm('确定删除？')
} catch {
  // 用户取消或关闭
}
```

## 本地开发

```bash
pnpm install
pnpm dev          # 完整文档站点（也可用 pnpm docs:dev）
pnpm dev --component textarea             # 仅开发一个组件，保留双语
pnpm dev --component textarea --locale zh # 仅中文
pnpm play:dev     # 独立组件调试
pnpm build        # 构建组件库
```

单组件模式包含该组件的子页面和引用的示例，并同步缩小导航及搜索范围。
切换开发组件时重新启动命令。Git 更新时间仅在生产构建时采集。
图标、API 类型、源码高亮和 Sass 的生成缓存可跨重启复用，修改源文件后会重新生成；
Sass 样式修改仍支持热更新。

## 许可证

[MIT](./LICENSE)
