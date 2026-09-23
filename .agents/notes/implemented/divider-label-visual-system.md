---
status: implemented
kind: project-specification
updated_at: 2026-09-23
completed_at: 2026-09-23
modules:
  - packages/components/divider
  - packages/theme-chalk/src/divider.scss
  - docs/.vuepress/components/divider
  - docs/.vuepress/components/divider-zh
  - docs/components/divider.md
  - docs/zh/components/divider.md
supersedes: []
---

# Divider 标签与线条的视觉体系

## 用户原始需求

> 分割线文字的白色背景太丑了加背景之后依然很丑，而且和整个项目的设计风格完全脱节，帮我全面设计一下包括可配置维度和最终展示

> 文字颜色算法有问题 看不清

## 已实现契约

- 默认 `variant="plain"` 使用透明标签；线段在标签两侧留出真实间距，不靠白色块遮挡线条。无标签时只渲染一段完整线条。
- `variant` 是视觉层次：`plain`、`soft`、`solid`。方向、五档位置、强调色、线型、粗细、内容间距、文本或图标彼此独立；竖线只呈现线段。
- `color` 调整强调色，彩色线条经中性色弱化，标签文字保持可读。`background` 保留为可选的标签表面颜色；`labelColor` 可覆盖自动文字色。
- 已知语义背景使用稳定的黑、白或深色前景；不透明 HEX/RGB/HSL 背景按 WCAG 相对亮度选择对比度更高的黑字或白字。任意 CSS 颜色和主题覆写仍可显式设置 `label-color`。
- `solid` 危险色的底色适度加深，使用白字时保持可读；成功、警告与浅色实色标签使用稳定深色字，不受深色主题文字 token 的反转影响。
- 线条和文字使用项目现有的完整 CSS 颜色 token 与圆角语言；图标分割线保留原生 `role="separator"`，图标示例提供可访问名称。
- 英文与中文文档的示例、Code 和 Playground 使用各自本地化的完整 Vue SFC；最终配置器可组合并预览各个维度。

## 验证

- Divider 组件测试：8 项通过，覆盖方向、标签结构、间距、样式、语义色与自定义背景自动前景色。
- `pnpm run test:docs-examples`：4 个文件、18 项通过；源码规范化脚本 dry-run 显示 0 个待修改示例。
- `pnpm run typecheck:web`、`pnpm run typecheck:renderer-docs`、定向 ESLint 与 Prettier 通过。
- `pnpm run build:theme` 通过；`pnpm run docs:build` 渲染 203 页。
- 浏览器实测中英文 Divider 页面、亮色与深色主题、五种标签位置、三种 `variant`、自定义背景和配置器。深色表面白字约 16.67:1，实色主色白字约 5.27:1；配置器切换成功、警告、危险及浅色自定义背景时得到可读前景色。
- 中文配置器的 Code 与 Playground 均包含完整模板、脚本与样式，且默认可见文案未混入英文。375px 移动视口下配置器无横向溢出，测试后已恢复浏览器视口。
