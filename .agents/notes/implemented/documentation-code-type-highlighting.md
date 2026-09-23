---
status: implemented
kind: project-specification
updated_at: 2026-09-23
completed_at: 2026-09-23
modules:
  - docs/.vuepress/theme/util/highlightVueSource.ts
  - docs/.vuepress/theme/util/restoreTypeScriptFenceHighlight.ts
  - docs/.vuepress/theme/index.ts
  - docs/.vuepress/theme/components/Page.vue
  - docs/components/renderer.md
  - docs/zh/components/renderer.md
  - play/__tests__/highlight-vue-source.test.ts
supersedes: []
---

# 文档示例源码中的类型高亮

## 项目目标

让文档展示的 TypeScript/TSX 示例源码能够清晰区分类型引用与普通标识符，特别是 Renderer 页中的泛型和组合类型，使示例可读且不改变实际代码含义。

## 用户原始需求

> 这里的类型都没有高亮 漏了好多 好弄的话弄一下 这里明明是引用了类型

## 已确认契约与验收条件

- 文档中的 TypeScript/TSX 源码展示应正确高亮已识别的类型引用，包括 `RendererOptions<Model>`、`RendererParams<Model>` 和 `Pick<…>` 一类泛型用法；不能仅为截图中的单个名称写特例。
- 高亮属于展示层，不得修改示例源码的类型、运行行为、复制结果或 Playground 内容。
- 用户的“好弄的话弄一下”保留了可行性判断：若现有高亮器难以安全支持，应先说明技术边界和取舍，不能用破坏其他语法高亮的规则强行覆盖。
- 英文与中文 Renderer 页面应保持一致；若修改共享展示管线，也应检查其他使用该管线的示例。

## 已有项目约束

- Renderer 的类型与双语 TSX 示例契约见 [全局渲染器注册表](../implemented/global-renderer-registry.md)。
- 文档示例、Code 与 Playground 的一致性要求继续以仓库根目录 `AGENTS.md` 的文档示例规则为准。
- 不把本次纠错过程写入公开文档；参见 [禁止在公开文档中写入对话过程](../prohibited/conversation-history-in-public-docs.md)。

## 项目级待办

- [x] 确认 Renderer 页源码展示所用语言模式和高亮器，修复可安全修复的类型引用高亮缺口。
- [x] 验证双语 Renderer 页面和相关共享源码展示，确保复制与 Playground 源码不变。

## 已实现方案

- 扩展共享 Prism grammar，在 TypeScript 与 TSX 的类型注解、泛型参数、类型导入、断言、约束和函数类型返回值中，为 PascalCase 类型引用生成统一的 `type-reference class-name` token。
- 在 TSX 中先识别泛型箭头函数的 `<Model extends object>`，避免 Prism 把它误判为 JSX 标签并让后续参数类型退化为纯文本。
- VuePress 的独立 `ts`、`typescript`、`tsx` 代码块与 Vue SFC / Playground 编辑器复用同一套 grammar；没有改动示例源码、复制文本或 Playground 的输入值。
- VuePress 生产首屏水合会把静态代码块的语法节点压成纯文本；`Page.vue` 挂载时只对丢失 token 的 TypeScript/TSX 代码块按同一 grammar 重建展示节点，保留源码文字、换行和行号布局。站内导航已带有 token 的代码块保持原样。
- 规则以类型语法上下文为边界，没有为 `RendererOptions`、`Pick` 或某个页面建立名称特例；现有 JSX、字符串、操作符和其他 Prism token 继续由原 grammar 处理。

## 验证

- `pnpm exec vitest run play/__tests__/highlight-vue-source.test.ts --maxWorkers=1`：1 个文件、7 项测试通过，覆盖 TypeScript、TSX 泛型箭头函数、可编辑 Vue TSX 源码、生产首屏恢复以及 JSX 标签和对象属性不被误识别。
- `pnpm run test:docs-examples`：4 个文件、18 项测试通过。
- 相关 TypeScript/VuePress 文件 ESLint 与 Prettier 通过；`pnpm run typecheck:node` 和 `pnpm run typecheck:web` 通过。
- `pnpm run docs:build`：完整渲染 203 页；仅有既有插件耗时和大块体积提示。
- 浏览器实测英文与中文 Renderer：直接刷新生产构建页面时，两种语言都保留 82 个类型引用 token；TSX 与 `h()` 版本中的 `RendererOptions`、`Pick`、`FormRendererParams`、`Model`、`VNodeChild` 等类型引用使用既有金色类型 token，普通代码文字保持原色。
- 浏览器实测 Table 的 Code 与 Playground：`SaxGridSetting`、`UserRow` 类型高亮一致；编辑器源码仍完整包含 `computed<SaxGridSetting<UserRow>>`。
- `pnpm run typecheck:vitest` 被工作区既有 Table 测试改动中的 6 项无关错误阻断，包括 `findLast` 目标库、已移除的 `rowHeight` 和现有测试类型不兼容；本次修改文件没有新增类型错误。
