---
status: implemented
kind: project-specification
updated_at: 2026-09-22
completed_at: 2026-09-22
modules:
  - docs/.vuepress/theme/node/apiTypeDetails.ts
  - docs/.vuepress/theme/components
  - docs/.vuepress/components
  - docs/components
  - docs/zh/components
  - packages/constants
  - play/__tests__/doc-api-metadata.test.ts
  - play/__tests__/doc-example-source.test.ts
supersedes: []
---

# 公共 API 类型交互与尺寸示例完整性

## 项目目标

保持生成式 API 文档的公共具名类型都可通过既有递归类型详情交互逐层查看，并确保每个公开 `size` 属性的组件都有可运行、可复制、可进入 Playground 的双语尺寸示例。

## 用户原始需求

> Size类型怎么变纯文字了，我要的是逐层点击这个交互，难道项目规格里面没声明吗？ 修复完补一下声明以免后续再犯

> 然后Cascader有这个属性却没有例子，所有有size的组件都要做一个尺寸的例子！

## 已确认契约

- `ComponentSize` 等公共具名类型不得退化成无交互纯文字；组件本地类型和共享包类型必须进入同一注册表，继续使用逐 token 点击、语法高亮和递归叠层交互。
- 共享类型通过显式公共类型根进入索引器，不得在页面或渲染组件中为单个类型建立特例映射。
- 每个公开 `size` 属性的组件必须在英文与中文组件页各有独立的 Size / 尺寸卡片。
- 尺寸示例必须展示该组件支持的全部尺寸，并同步提供完整、有效、已本地化的渲染示例、Code 和 Playground 源码。
- 尺寸卡片位于默认或首个基础示例之后，不得作为普通组件页的第一张示例卡；Table 将尺寸放在数据与列定义之后的独立 Appearance / 外观章节。
- 可编辑控件的每档尺寸必须绑定独立响应式状态，不得用固定 `model-value` 伪装为可运行示例；多列尺寸布局必须在窄容器中自动换行。
- 中英文页面保持相同示例顺序与规范化英文锚点；中文示例不得默认泄露英文可见文案。

## 架构与稳定来源

- `docs/.vuepress/theme/node/apiTypeDetails.ts` 统一扫描组件类型和显式共享类型根，并生成声明、来源与引用关系。
- `docs/.vuepress/theme/components/ApiTypeDetails.vue` 与 `ApiTypeTokens.vue` 继续负责既有点击、递归层级和可访问交互，不承担类型来源特判。
- 各组件的 `docs/.vuepress/components/<component>/size.vue` 与本地化对应文件是渲染、Code、Playground 的唯一示例来源。
- `play/__tests__/doc-api-metadata.test.ts` 覆盖共享公共类型解析，`play/__tests__/doc-example-source.test.ts` 覆盖全部 size 组件的双语尺寸示例和完整 SFC 重建。

## 验收条件与项目级待办

- [x] 公共类型注册表纳入 `packages/constants`，`ComponentSize` 可打开真实声明和来源。
- [x] 当前所有公开 size 组件具备双语尺寸卡片与完整示例源。
- [x] Web、Play、Node 类型检查、ESLint、201 页文档构建和 Cascader 浏览器实测通过。
- [x] 文档 API 元数据、示例源码重建以及相关自动化套件全部通过。
- [x] 自动化验证通过后，将本规格移入 `implemented/` 并记录验证证据。

## 验证

- `pnpm run test:docs-examples`：4 个测试文件、17 项测试全部通过。
- `pnpm run typecheck:web` 通过。
- `pnpm run docs:build`：成功渲染 203 页。
- 浏览器验证 Checkbox、Switch、Slider 的尺寸示例可独立更新响应式状态；Table 外观章节按“数据与列定义 → 外观 → 行选择”排列，并只包含三档 Size 示例。

## 禁止方案

- [公共 API 类型别名退化为纯文字](../prohibited/plain-text-public-api-type-alias.md)：类型根遗漏必须修复索引来源，不能靠改写元数据或普通文字掩盖。
- [整段类型表达式的扁平弹层](../prohibited/flat-api-type-details-popover.md)：不得破坏现有逐引用递归查看能力。
- [公共文档写入对话过程](../prohibited/conversation-history-in-public-docs.md)：公开页面只描述最终能力，验证和纠错过程留在内部规格。
