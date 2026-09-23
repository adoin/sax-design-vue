---
status: implemented
kind: project-specification
updated_at: 2026-09-23
completed_at: 2026-09-23
modules:
  - packages/components/breadcrumb
  - packages/theme-chalk/src/breadcrumb.scss
  - docs/components/breadcrumb.md
  - docs/zh/components/breadcrumb.md
supersedes: []
---

# 面包屑响应式省略与完整路径

## 用户原始需求

> 面包屑组件增加一个功能，如果容器可用宽度不够，而层级很多或者文字很长，那么尽量保证头尾的情况下，适当省略中间的级数为打横的三点，并且hover着3个点可以看到只读的中间内容，如果是树形节点，还可以点击弹出一整个完整的支持换行的面包屑用来实现点击展开和跳转
>
> 这个展示不行吧 没有表达出前后的关系，另外黑色的已省略的层级文字去掉啊。

## 项目契约

- 数据驱动的 `SBreadcrumb` 默认按实际容器和文字宽度折叠，优先保留首末层级，把连续的中间层级替换为横向省略号；`collapse=false` 可关闭，插槽模式仍由使用者自行排布。
- 省略号悬停或键盘聚焦时显示只读完整路径，按原顺序用分隔符连接并允许换行，不显示“已省略的层级”标题，也不暴露预览链接。
- 点击省略号打开通过 `SPopper` 承载的完整、可换行面包屑。路径标题仍可导航，有 `children` 的层级另有独立展开按钮；普通路径链接和树形子级链接跳转后关闭面板。
- 完整路径不依赖额外页面级绝对定位或事件监听。样式遵守项目的 borderless 焦点处理和双层颜色 token。
- 中英文文档的示例、Code 和 Playground 使用各自本地化的完整 Vue SFC 源码，展示窄宽度和树形路径。

## 验证

- 折叠规划单元测试 4 项通过；`pnpm run typecheck:web`、`pnpm run typecheck:renderer-docs`、`pnpm run build:theme` 通过。
- `pnpm run test:docs-examples`：4 个文件、18 项测试通过。
- 浏览器验证窄宽度折叠、只读悬停路径、完整路径换行、树形展开与普通/子级跳转后收起；中英文 Code 三段源码和 Playground 预览均正常。
- `pnpm run docs:build` 完整构建通过。
