---
status: proposed
kind: project-specification
updated_at: 2026-10-19
modules:
  - packages/components
  - ../sax-admin/src/layouts
  - ../sax-admin/src/stores/workspace.ts
supersedes: []
---

# 通用窗口组件与 Admin 页面承载层的分工建议

## 状态与来源

这些内容是针对 [已明确的窗口化需求](../active/window-and-pinned-route-pages.md) 给出的架构与交互建议。下述命名或交互选择尚未逐项确认，不应直接解释成新的硬性契约。

## 组件库建议

- 第一版可以新增通用 `SWindow`，负责窗口外观、标题栏、操作区插槽、拖动、尺寸调整、最小尺寸约束、工作区边界、激活层级、焦点和键盘操作。
- 标题编辑可以由组件提供交互，标题值和保存归应用控制。
- 页面恢复按钮可由 Admin 通过操作区插槽提供，通用组件不依赖路由、Admin store 或业务页类型。
- 暂不必同时抽象通用的路由窗口管理器；有额外复用需求后再考虑 `SWindowWorkspace`。

## Admin 建议

- 可增加 `WorkspacePageHost` 之类的稳定承载层，管理页面实例、缓存标识、路由上下文以及主区域和窗口区域之间的呈现位置。
- 优先验证稳定页面实例与挂载位置移动的方案；Teleport 是候选机制，不能仅凭使用 Teleport 就认定状态保持已经完成。
- 固定与恢复不应触发普通关闭标签的缓存释放，也不应像刷新操作那样增加 revision。
- 被固定页面应读到自己的路由参数和查询；主区域切换其他页面不能使固定窗口错误地跟随全局当前路由。
- 页面内导航、权限、多标签去重、窗口与 Tab 对应关系、关闭策略属于 Admin 的业务策略。
- 建议保留原 Tab 并标记已固定，点击 Tab 聚焦现有窗口，避免重复创建页面；这项交互仍需在设计时明确。
- 建议窗口名称作为页面实例别名保存，恢复到 Tab 时沿用，不修改全局 route.meta.title；这项交互仍需在设计时明确。
- 最小尺寸可由 Admin 按页面配置，组件执行约束。
- Table、虚拟列表和图表应响应窗口实际容器尺寸变化，不能仅依赖浏览器窗口 resize。

## 稳定源码地图

- Admin `src/layouts/AdminLayout.vue`：RouterView、KeepAlive、页面滚动容器。
- Admin `src/stores/workspace.ts`：Tab 身份、cacheName、revision、关闭与刷新。
- Admin `src/components/common/WorkspaceTabs.vue`：Tab 的交互入口。
- 组件库 `packages/components/tabs`：现有 Tabs 能力与插槽，不宜承担 Admin 路由实例管理。
