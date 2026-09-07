---
status: implemented
kind: project-specification
updated_at: 2026-09-07
completed_at: 2026-09-07
modules:
  - docs/components/table.md
  - docs/zh/components/table.md
  - play/__tests__/doc-example-source.test.ts
supersedes: []
---

# Table documentation information architecture

## Audience and writing contract

The Table documentation is a public reference for developers and AI using Sax Design Vue. It explains the current API, behavior, usage choices, operational scope, and performance limits. Conversation history and correction notes are prohibited by [conversation-history-in-public-docs.md](../prohibited/conversation-history-in-public-docs.md).

Every rendered example remains paired with complete localized source for the Code dialog and Playground. Examples use `STable` with either configuration-object columns or nested `STableColumn` declarations; they do not reconstruct table rows or cells by hand.

## Navigation hierarchy

The English and Chinese pages use the same ordered second-level groups, with individual examples as third-level children:

1. Data and column definitions / 数据与列定义
2. Selection, sorting, and filtering / 选择、排序与筛选
3. Trees and groups / 树形与分组
4. Header structures / 表头结构
5. Footers and summaries / 表尾与汇总
6. Row expansion / 行展开
7. Editing, validation, and changes / 编辑、校验与变更
8. Spreadsheet interactions / 表格式交互
9. Column layout and management / 列布局与管理
10. Merged cells / 单元格合并
11. Large data and visualization / 大数据与可视化
12. Query forms and request proxy / 查询表单与请求代理

Tree and row-group examples share a hierarchy section. Grouped headers, footer summaries, and detail rows remain separate because they describe column structure, aggregate output, and row expansion respectively. Base behavior precedes its asynchronous, remote, generated-source, or virtualized variant within each group.

The right-side `SAnchor` navigation is generated from this heading hierarchy. Each second-level group can be collapsed independently and reveals the third-level example anchors when expanded.

## Verification

- `pnpm run normalize:doc-examples`: no source-range changes remained after reorganization.
- `pnpm run test:docs-examples`: 64 examples per locale, 12 matching section boundaries, and 9 tests passed.
- `pnpm run docs:build`: 173 pages rendered.
- Browser verification confirmed all 12 groups and the expected children for trees and groups, header structures, footers and summaries, and row expansion in both locales.
