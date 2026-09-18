---
status: implemented
kind: project-specification
updated_at: 2026-09-16
completed_at: 2026-09-16
modules:
  - packages/theme-chalk/src
  - docs/.vuepress/theme
supersedes: []
---

# 组件的无边框焦点与状态反馈

## 用户原始需求

> `.s-table__detail-toggle:focus-visible` 的 outline 去掉，类似的再检查一下，我不觉得我的风格需要 outline，你看看还有哪些地方有。
>
> 项目是 borderless 风格，不要边框。这个 outline 理论上是不能要的，你要保留的哪些地方告诉我原因。

## 项目契约

- 组件与文档壳的键盘焦点态不得绘制正宽度 CSS `outline`。
- 不得使用 `0 0 0 Npx` 或 `inset 0 0 0 Npx` 的 ring shadow 伪装成焦点边框或状态边框。
- 键盘焦点仍需可见，应复用控件已有的语义颜色、轻底色、图标强调、轻微缩放、位移或无硬边界的柔和阴影。
- 错误、选中、今日、复制完成和拖放目标等状态同样不使用环形描边；通过颜色、柔和内外光影、缩放或状态标记表达。
- 只有表达结构或精确操作位置的线条可以保留：树形和分组层级引导线、列宽调整边界、拖拽插入线，以及明确拖放目标范围所需的投放区域边界。它们不能被用作普通焦点反馈。
- 颜色选择拇指需要在任意底色上保持可辨识，允许使用无硬边缘的内部明暗光影；表单校验、Table 校验和固定列遮挡关系允许使用柔和状态光影，但不能恢复 ring。

## 已实现范围

- Table 的详情/分组/树形开关、校验标记与导航、表头操作、排序、列设置、溢出内容、拖拽手柄、编辑单元格、父级指示器和文档 API 操作。
- Anchor、Backtop、Button、Cascader、Card、Checkbox Group、Carousel、Color Picker、Date Picker、Form、Image、Image Preview、Input、Menu、Navbar、Pagination、Radio、Rate、Scrollbar、Select、Slider、Steps、Upload。
- 文档代码复制、命令块、代码变体、Playground 工作区与对话框、API 类型引用。

## 验证

- 静态扫描 `packages/theme-chalk/src` 与 `docs/.vuepress/theme`：正宽度 `outline` 为 0，环形 `box-shadow` 为 0，焦点 ring shadow 为 0。
- 浏览器验证 Table 的详情展开、分组展开、排序按钮与列设置入口：均为 `outline-style: none`、无 ring shadow，并保留 borderless 的底色、文字色或图标反馈。
- `pnpm run build:theme` 通过。
- 完整 Table 测试：62 个文件、654 项测试通过。
- 受影响组件测试：26 个文件、212 项测试通过。
- `pnpm run typecheck:web` 通过。
- `pnpm run test:docs-examples`：4 个文件、14 项测试通过。
- `pnpm run docs:build`：完整渲染 201 页；既有插件耗时和大块体积提示仍为非阻断警告。
