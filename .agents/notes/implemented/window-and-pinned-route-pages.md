---
status: implemented
completed_at: 2026-10-19
kind: project-specification
updated_at: 2026-10-19
modules:
  - packages/components
  - packages/theme-chalk/src
  - docs
  - ../sax-admin/src/layouts
  - ../sax-admin/src/stores/workspace.ts
supersedes: []
---

# 可移动窗口与 Admin 路由页面固定

## 项目目标

支持把 Admin 已打开的多个路由页面固定成可移动、可调整大小的窗口，保留页面内容和输入状态，并可恢复到普通路由页面。组件库与 Admin 的职责需要明确分层。

## 用户原始需求

> 我还想做一个功能，比如admin中的tabs下面是具体的路由中的页面，我想pin起来其中的n个页面作为可以随意拖动改变位置和大小（有最小阈值）的窗口，并且保持原内容和输入状态，还可以重命名窗口，并且有按键可以让它恢复成普通的路由页面。
> 你觉得这个需求哪些部分放在组件中做合适，哪些部分放在admin中合适呢

## 需求解释与验收标准

以下是对上述原文的结构化解释，原文保持不变：

- 可以同时固定多个页面，各窗口能够分别移动和调整尺寸。
- 调整窗口尺寸时必须执行最小宽高阈值。
- 固定、移动、调整尺寸、重命名和恢复普通路由页面的过程中，原有页面内容与输入状态不丢失。
- 可以重命名窗口。
- 有明确的操作按钮把窗口恢复成普通路由页面。
- 一个窗口的操作不能误改另一个窗口的页面内容、输入或身份。
- 验证应覆盖有本地输入的页面、带参数的路由和多个窗口同时存在的情况；状态保持不能只以一个静态展示页面为依据。

## 适用的既有契约

- 继续遵守根 AGENTS.md 的组件命名、属性归属、语义枚举、颜色 token、无边框焦点及双语文档规则。
- Tabs 的既有首次指示线对齐与渲染生命周期契约见 [tabs-indicator-initial-alignment.md](../implemented/tabs-indicator-initial-alignment.md)。
- 窗口内的下拉、选择器、提示等浮层继续遵守共享 SPopper 契约。
- 公共组件文档不得包含本次讨论、迁移过程或工作记录，见 [conversation-history-in-public-docs.md](../prohibited/conversation-history-in-public-docs.md)。
- Admin 侧的页面生命周期要求见相邻 Admin 仓库 `.agents/notes/implemented/pinned-route-page-windows.md`。

## 架构建议的状态

先前讨论的通用窗口与业务页面承载层方案，单独记录在 [window-component-and-admin-boundary.md](../proposed/window-component-and-admin-boundary.md)。该文件属于设计建议；其中的组件命名、API、Tab 保留方式和重命名后的恢复行为尚未逐项确认为用户要求。

## 已完成的项目目标

- 明确组件库与 Admin 的职责边界，并完成可复用的窗口交互能力与 Admin 页面固定、恢复流程。
- 完成多窗口、最小尺寸、重命名和原页面状态保持的可操作验收。
- 为最终新增的组件 API 提供类型、必要回归、英文与中文示例，以及一致的 Code/Playground 源码。

## 本轮实现选择与验证

- 通用 SWindow 仅负责受控 rect/title、拖动、八方向缩放、最小宽高、定位父容器边界、键盘交互、标题编辑和插槽；不接管路由、关闭业务或缓存。
- Admin 采用 WorkspacePages、稳定 WorkspacePageHost 和布局作用域内的页面窗口管理器。保留固定 Tab，点击固定 Tab 聚焦已有窗口；别名不改写 route.meta.title，恢复后继续使用。
- 页面内容由同一 Teleport 子树移动，页面自己的 SScrollbar 一起移动；移前记录、移后恢复滚动与原生输入焦点/选择。超过新视口滚动上限时按原生边界夹取。
- 使用 vue-smart-router 5.4.1 的独立路由上下文及 detached 生命周期。固定/恢复不调用 remove、retain 或 refresh，不改变 fullPath::revision。
- 组件库交付版本为 2.4.2，Admin 使用公开 npm 依赖；不包含浏览器刷新后的输入或布局持久化。
- Window 5 项回归、文档示例 21 项、235 页文档构建、web/test 类型检查通过。212 个 ESM/CJS 样式入口、472 个引用及压缩后图标消费检查通过。
- 2.4.2 发布压缩包逐项核对 7837 个文件、ESM/CJS/类型入口及无链接记录；发布脚本现执行同样检查。Window Sass 颜色函数残留会阻止发布。
- IAB 验证双语示例、Code、Playground、真实拖动、最小尺寸、重命名、浅/深色不透明表面与无边框阴影。
- Admin 34 项回归、类型和生产构建通过；生产预览验证同一输入控件 ID、两份草稿及 params/query 隔离、三个窗口、恢复、别名、刷新/关闭和最后普通页面进入 launchpad。
- Table 最小窗口保留非零数据视图；十万条虚拟列表仅渲染 8–9 行并响应容器宽度；WebGPU 就绪且 Canvas 显示宽度随窗口从 657px 变为 397px。