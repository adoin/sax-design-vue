---
status: implemented
completed_at: 2026-10-14
kind: project-specification
modules:
  - packages/components/input-number
  - packages/theme-chalk/src/input-number.scss
  - docs/components/input-number.md
  - docs/zh/components/input-number.md
---

# Input Number 悬停对比度与公开文档

- 保留 SInputNumber 为独立数字输入组件。color 与 background 在悬停、聚焦时保持配对，不单独改成背景主题色；复用柔和内凹阴影反馈，无焦点 outline 或 ring。
- 内部 SInput 不覆盖配置的外壳配色；步进控件使用原生 button，正确禁用边界状态，并支持 Enter/Space。
- modelValue 与更新/提交事件公开类型允许 null，与清空行为一致。
- 文档新增中英文独立页面、共享分类导航与搜索入口，提供默认、范围/步长、状态/控制按钮、配色和形状五组双语示例。每组提供完整 Code 和 Playground 源码。
- 验证：实际悬停/聚焦浅色为蓝底浅字，深色为浅蓝底深字；键盘增量和范围、小数精度已检查。三项组件回归通过；文档源与元数据检查通过；web 类型与完整 233 页文档构建通过。全部十个本地化示例的 Code 与 Playground 实际渲染已逐项验证。
