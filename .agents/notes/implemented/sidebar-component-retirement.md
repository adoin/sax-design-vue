---
status: implemented
kind: project-specification
updated_at: 2026-09-23
completed_at: 2026-09-23
modules:
  - packages/components/layout
  - packages/components/menu
  - packages/components
  - packages/theme-chalk/src
  - docs/components
supersedes: []
---

# 独立 Sidebar 组件退役

## 用户原始需求

> sidebar组件删掉，我应该在layout里面已经做了。

## 项目契约

- 不再公开 `SSidebar`、`SSidebarGroup`、`SSidebarItem` 及其专属属性、样式、token、示例和文档页面。
- 应用侧栏的外壳与 aside 区域由 `SLayout` 提供；需要层级导航、折叠图标栏与子菜单时组合 `SMenu`。不恢复一套并行的 Sidebar 组件。
- 文档站自身的侧栏组件与路由配置不是被退役的公共组件，继续保留。Date Picker 内部的 sidebar 区域也不受影响。
- 历史差距分析仍记录原版 Sidebar，但将其标为有意退役，不报告为待实现缺口。

## 验证

- `SLayout`/`SMenu` 测试 2 个文件、19 项通过；`pnpm run typecheck:web`、`pnpm run typecheck:renderer-docs`、`pnpm run build:theme` 通过。
- `pnpm run test:docs-examples`：4 个文件、18 项通过；`pnpm run docs:build` 成功生成 201 页。
- 构建产物不再包含英文或中文 Sidebar 页面，Layout 与 Menu 页面仍存在；源码无独立 Sidebar 公共 API 的残留引用。
