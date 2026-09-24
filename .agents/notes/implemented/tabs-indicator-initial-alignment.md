---
status: implemented
kind: project-specification
updated_at: 2026-09-24
modules:
  - packages/components/tabs
  - packages/theme-chalk/src/tabs.scss
supersedes: []
---

# Tabs 激活横线的首次布局对齐

## 项目目标

Tabs 的激活横线在页面首次呈现时就与当前标签正确对齐；切换标签再切回不应成为纠正初始位置的必要步骤。

## 用户原始要求

> 你看第一个Tab下面的横线，我页面刚刷新是图1，切到其他tab再切回来是图2，明显不一样了啊
> 最开始是不居中的

截图：`C:/Users/ADMINI~1/AppData/Local/Temp/codex-clipboard-bbe34da5-f518-482c-b33a-f4146251214c.png`、`C:/Users/ADMINI~1/AppData/Local/Temp/codex-clipboard-f7e55369-d359-4556-b4d3-f9120858f9a0.png`。

## 已确认的契约与验收标准

- 初次加载、切换到其他标签、再切回同一标签时，在布局尺寸相同的条件下，激活横线应保持与标签一致的对齐关系。
- 异步影响标签尺寸或位置的布局变化发生后，横线应跟随最终位置；不得依赖用户手动切换标签来重新校准。
- 此要求适用于 Tabs 组件本身，包括当前的延迟挂载示例，而不是仅修正文档示例的固定尺寸。

## 架构与决定

- 激活横线由 `packages/components/tabs/src/tabs.vue` 根据标签及导航容器的布局坐标定位；`offsetLeft` / `offsetTop` 与 `offsetWidth` / `offsetHeight` 不受 `TransitionGroup` 入场位移和缩放影响。外观定义在 `packages/theme-chalk/src/tabs.scss`。
- 观察导航外框、标签列表和当前激活项的尺寸，布局变化后重新测量；不需要切换标签来校准。
- Tabs 的面板渲染策略 `render-mode="all|lazy|active-only"` 已存在；横线定位修复应与这些模式兼容，不改变它们的生命周期语义。

## 验证

- `packages/components/tabs/__tests__/tabs.test.ts` 覆盖动画中的首次定位、切换和切回；21 个 Tabs 测试通过。
- 浏览器实测：刷新后首个标签的最终布局左边界为 333px，横线为 333px；切换并切回后均为 333px。前一个标签与当前标签异步变宽后，横线跟随布局位置及宽度。
- `vue-tsc -p tsconfig.web.json --composite false --noEmit`、Tabs 文件 ESLint 与 Prettier 检查通过。

## 禁止方案

- 公共文档不得写入本次反馈或修复过程；遵守 `.agents/notes/prohibited/conversation-history-in-public-docs.md`。
