# 使用组件

<card>

## 文档结构

每个组件页遵循相同结构：

1. **实时示例** — 与应用中相同的 API 渲染
2. **代码标签** — 可复制的 template / script / style 片段
3. **API 表** — 由 frontmatter 生成的属性、事件、插槽与暴露项

新迁移的组件在侧栏带有绿色 **New** 标记。

</card>

<card>

## 基本用法

<command>

```vue
<template>
  <s-button color="primary" type="flat">Save</s-button>
</template>
```

</command>

在入口文件中引入样式一次（见[快速开始](/zh/guide/getting-started/)）。

</card>

<card>

## 通过属性配置

多数视觉变化通过属性驱动，无需额外 CSS：

<command>

```vue
<s-alert color="success" closable v-model="open">
  Saved successfully.
</s-alert>
```

</command>

打开组件文档，在 API 区找到对应属性，并使用链接示例锚点（如 `#color`）。

</card>

<card>

## 在 Playground 预览

集成到仓库前，打开 [Playground](/zh/guide/playground) 选择组件示例。Playground 与本站使用相同的工作区构建。

</card>

<card>

## 设计说明

视觉语言继承自 [Vuesax](https://github.com/lusaxweb/vuesax)。Sax Design Vue 在面向 Vue 3 工具链与现代文档工作流的同时，保留富有表现力的外观。

</card>
