---
status: implemented
kind: project-specification
updated_at: 2026-09-11
completed_at: 2026-09-07
modules:
  - docs/.vuepress/app/component-categories.ts
  - docs/.vuepress/client.ts
  - docs/.vuepress/theme/components/SidebarRight.vue
  - docs/.vuepress/theme/shared/tableDocumentation.ts
  - docs/components/table.md
  - docs/zh/components/table.md
  - play/__tests__/doc-example-source.test.ts
  - play/__tests__/table-documentation-entry.test.ts
supersedes: []
---

# Table documentation information architecture

## Audience and writing contract

The Table documentation is a public reference for developers and AI using Sax Design Vue. It explains the current API, behavior, usage choices, operational scope, and performance limits. Conversation history and correction notes are prohibited by [conversation-history-in-public-docs.md](../prohibited/conversation-history-in-public-docs.md).

Every rendered example remains paired with complete localized source for the Code dialog and Playground. Examples use `STable` with either configuration-object columns or nested `STableColumn` declarations; they do not reconstruct table rows or cells by hand.

Examples that demonstrate render functions may provide a validated `script-tsx` source alongside the standard Vue script. The Code dialog exposes its Vue/TSX switch only for those examples, and the selected form is also used by copy and Playground.

## Navigation hierarchy

The English and Chinese Table overview pages keep the generated API as a compatibility endpoint. The component sidebar, the outline's Examples group, and an overview URL without a hash all enter the first route-level feature guide directly. An overview URL with `#api` remains on the API page. Each guide page owns one second-level group with its individual examples as third-level children:

1. Data and column definitions / 数据与列定义
2. Row selection / 行选择
3. Sorting and filtering / 排序与筛选
4. Trees and groups / 树形与分组
5. Header structures / 表头结构
6. Footers and summaries / 表尾与汇总
7. Row expansion / 行展开
8. Editing, validation, and changes / 编辑、校验与变更
9. Spreadsheet interactions / 表格式交互
10. Column layout and management / 列布局与管理
11. Merged cells / 单元格合并
12. Large data and visualization / 大数据与可视化
13. Query forms and request proxy / 查询表单与请求代理

Tree and row-group examples share a hierarchy section. Grouped headers, footer summaries, and detail rows remain separate because they describe column structure, aggregate output, and row expansion respectively. Base behavior precedes its asynchronous, remote, generated-source, or virtualized variant within each group.

The first footer example teaches `footerConfig` with precise built-in decimal aggregation and explains its `data`, `filtered`, and `page` scopes. The same section keeps `footerData` as the explicit application- or server-owned result path, including for `virtualSource` data that cannot be enumerated locally.

The right-side `SAnchor` navigation combines all 13 feature routes into one hierarchy. Its Examples group uses the overview compatibility URL, which resolves to the first feature guide without rendering an intermediate index. The documentation theme delegates ordinary same-origin route clicks to Vue Router, preserving the shared page shell while each chapter remains directly addressable as an HTML URL. The current route expands to reveal its page-local example anchors; API navigation returns to the overview with `#api`. Row selection contains single selection, multiple selection, and highlight selection as separate children; sorting and filtering use their own route. Both locales retain localized labels while sharing route filenames and canonical English anchor values defined by [localized-documentation-anchors.md](localized-documentation-anchors.md).

The overview contains no feature-guide card and is skipped during ordinary navigation. Route-level splitting still bounds mount cost and keeps document height stable; documentation Cards do not destroy or recreate example content in response to viewport movement.

The Table outline enables `SAnchor` router mode and passes the documentation router locally. Anchor finds the active Table section in the existing ordered `items` tree, derives adjacent sibling routes, and generates both floating boundaries internally. `Page.vue` contains no Table-specific boundary wrapper or neighbor calculation. Each edge ignores the gesture that first reaches it and lets a deliberate continued-scroll gesture move through the same router integration as the outline. Wheel ownership follows [anchor-route-boundary-scroll-ownership.md](anchor-route-boundary-scroll-ownership.md): any nested overflowing element resets pending route intent, independent of component type. A cross-route cooldown prevents one residual gesture from skipping chapters. Direct link activation remains available; the first route has no previous item and the final request-proxy route has no next item.

Route and heading state are separate within this mixed outline. The current guide remains marked as the page while its mounted hash descendants update as the guide scrolls. When a local heading is active, only that heading receives the visible active icon; the guide retains its page semantics and highlighted path without a duplicate icon. Backward wheel navigation enters the previous guide at its final scroll position, including content-height settlement, whereas ordinary route clicks keep their normal top-entry behavior.

Direct documentation URLs with a `#hash` defer Vue Router's initial scroll until the target heading mounts and the page content height settles. The site guards missing headings instead of returning a selector that is not yet in the DOM, and cancels a pending scroll when the user navigates to another route or hash. This is a documentation-router integration detail; `SAnchor` still owns explicit outline-click scrolling.

The documentation outline opts into Anchor's `visible-section` active strategy across ordinary component pages and routed Table guides. On Table pages, the page-local highlight follows the heading interval occupying most of the readable viewport while retaining the route-level page marker and ordinary router-mode boundaries. The library keeps the `heading` default for consumers unless locally or globally configured otherwise.

## Verification

- `pnpm run normalize:doc-examples` recursively normalized all routed source slots with no skipped examples.
- `pnpm run test:docs-examples`: 65 examples per locale, 13 paired feature routes, and 9 tests passed.
- `pnpm run docs:build`: 201 pages rendered.
- Browser verification confirmed cross-route navigation, current-route `aria-current="page"`, the four local column-layout anchors, a stable 3628px document height, and canonical English hash values in the Chinese locale.
