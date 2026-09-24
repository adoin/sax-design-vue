---
status: implemented
kind: project-specification
updated_at: 2026-09-22
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

Every rendered example remains paired with complete localized source for the Code dialog and Playground. Examples prefer configuration-object columns; nested `STableColumn` declarations are reserved for examples that specifically teach declaration nesting or slot composition. Neither form reconstructs table rows or cells by hand.

Examples that demonstrate render functions may provide a validated `script-tsx` source alongside the standard Vue script. The Code dialog exposes its Vue/TSX switch only for those examples, and the selected form is also used by copy and Playground.

Generated API rows keep the More column action-specific. The single bug action opens a prefilled GitHub Issue and exposes the localized “Create an issue” explanation on both hover and keyboard focus. Do not render a generic source action that only opens the repository home page without locating the documented API entry.

The Example column title supplies the visible context for usage navigation, so a row-level usage link renders only the code icon rather than repeating the “Usage” label. The icon keeps a row-specific accessible name and uses the shared localized `STooltip` on hover and keyboard focus. Rows with embedded code may still show their distinct code-dialog action.

Generated API sections omit the Values column when none of their rows carries a nonempty `values` entry. Table metadata records Boolean domains directly through `Boolean` and named restrictions through resolvable types such as `TableColumnType`, `TableAlign`, `TableColumnFixed`, and `TableSortMethod`, so its API sections do not reserve an all-placeholder column. Other component sections may retain Values while their legacy primitive type metadata still depends on that field for units, ranges, or enumerations.

## Navigation hierarchy

The English and Chinese Table overview pages keep the generated API as a compatibility endpoint. The component sidebar, the outline's Examples group, and an overview URL without a hash all enter the first route-level feature guide directly. An overview URL with `#api` remains on the API page. Each guide page owns one second-level group with its individual examples as third-level children:

1. Data and column definitions / 数据与列定义
2. Appearance / 外观
3. Row selection / 行选择
4. Sorting and filtering / 排序与筛选
5. Trees and groups / 树形与分组
6. Header structures / 表头结构
7. Footers and summaries / 表尾与汇总
8. Row expansion / 行展开
9. Editing, validation, and changes / 编辑、校验与变更
10. Spreadsheet interactions / 表格式交互
11. Column layout and management / 列布局与管理
12. Merged cells / 单元格合并
13. Large data and visualization / 大数据与可视化
14. Query forms and request proxy / 查询表单与请求代理

Appearance follows the foundational data-and-column chapter and initially owns the standalone Size example. The Table overview remains an API-only compatibility endpoint and does not duplicate the example card.

Tree and row-group examples share a hierarchy section. Grouped headers, footer summaries, and detail rows remain separate because they describe column structure, aggregate output, and row expansion respectively. Base behavior precedes its asynchronous, remote, generated-source, or virtualized variant within each group.

The first footer example teaches `footerConfig` with precise built-in decimal aggregation and explains its `data`, `filtered`, and `page` scopes. The same section keeps `footerData` as the explicit application- or server-owned result path, including for `virtualSource` data that cannot be enumerated locally.

The first row-expansion example teaches a nested change table: the outer `STable` summarizes one changed field per row, and its `#detail` slot renders a second `STable` with the complete before/after items and result states. The child table remains in the document flow rather than opening a popover, and both locales keep the rendered example, Code, and Playground sources synchronized.

The right-side `SAnchor` navigation combines all 14 feature routes into one hierarchy. Its Examples entry is a non-link grouping label. The documentation theme delegates ordinary same-origin route clicks to Vue Router, preserving the shared page shell while each chapter remains directly addressable as an HTML URL. The current route expands to reveal its page-local example anchors; API is a distinct full-path hash route on the overview and explicitly follows the final query-and-proxy chapter in the flattened route-boundary sequence. The active-header plugin's automatic same-path hash clearing is rejected for this route. Row selection contains single selection, multiple selection, and highlight selection as separate children; sorting and filtering use their own route. Both locales retain localized labels while sharing route filenames and canonical English anchor values defined by [localized-documentation-anchors.md](localized-documentation-anchors.md).

The overview contains no feature-guide card and is skipped during ordinary navigation. Route-level splitting still bounds mount cost and keeps document height stable; documentation Cards do not destroy or recreate example content in response to viewport movement.

The Table outline passes the documentation router locally; no Anchor mode flag is used. Its Examples root omits `href` and acts only as a group, second-level chapter items are full routes, third-level hashes remain local, and the full-path API hash opts into the flattened boundary sequence with `boundary: true`. `Page.vue` contains no Table-specific boundary wrapper or neighbor calculation. Each edge ignores the gesture that first reaches it and lets a deliberate continued-scroll gesture move through the same router integration as the outline. Wheel ownership follows [anchor-route-boundary-scroll-ownership.md](anchor-route-boundary-scroll-ownership.md): any nested overflowing element resets pending route intent, independent of component type. A cross-route cooldown prevents one residual gesture from skipping chapters. Direct link activation remains available; the first route has no previous item, the final request-proxy route continues to API, and API has no next item.

Route and heading state are separate within this mixed outline. The current guide remains marked as the page while its mounted hash descendants update as the guide scrolls. When a local heading is active, only that heading receives the visible active icon; the guide retains its page semantics and highlighted path without a duplicate icon. Backward wheel navigation enters the previous guide at its final scroll position, including content-height settlement, whereas ordinary route clicks keep their normal top-entry behavior.

Direct documentation URLs with a `#hash` defer Vue Router's initial scroll until the target heading mounts and the page content height settles. The site guards missing headings instead of returning a selector that is not yet in the DOM, and cancels a pending scroll when the user navigates to another route or hash. This is a documentation-router integration detail; `SAnchor` still owns explicit outline-click scrolling.

The documentation outline opts into Anchor's `visible-section` active strategy across ordinary component pages and routed Table guides. On Table pages, the page-local highlight follows the heading interval occupying most of the readable viewport while retaining the route-level page marker and ordinary router-mode boundaries. The library keeps the `heading` default for consumers unless locally or globally configured otherwise.

## Verification

- `pnpm run normalize:doc-examples` recursively normalized all routed source slots with no skipped examples.
- The documentation source contract now covers 66 examples per locale and 14 paired feature routes; its current automated execution is tracked by [public-api-type-and-size-documentation.md](../active/public-api-type-and-size-documentation.md).
- `pnpm run docs:build`: 203 pages rendered after adding the paired Appearance routes.
- Browser verification confirmed Data and column definitions / 数据与列定义, Appearance / 外观, and Row selection / 行选择 remain adjacent in that order; the Appearance route renders only the localized Size example with three Table sizes.
- Browser verification confirmed cross-route navigation, current-route `aria-current="page"`, the four local column-layout anchors, a stable 3628px document height, and canonical English hash values in the Chinese locale.
- Browser verification confirmed every generated API More cell contains only one prefilled GitHub Issue link in a 56px action track; the shared `STooltip` exposes “前往 GitHub 创建 Issue” on focus as well as hover, and no generic repository-home action remains.
- Browser verification confirmed all five Table API sections omit the Values header and value cells after their metadata was normalized to named types, while a legacy component such as Alert still retains the Values column and its 21 rendered values. `pnpm run test:docs-examples` passed 4 files and 14 tests, and the complete documentation build rendered 201 pages.
- Browser verification confirmed the localized nested change-table example opens the default Region groups summary into a five-row child `STable`, collapses by removing the child table, and recreates it on the next expansion. `pnpm run test:docs-examples` passed 4 files and 14 tests, and the complete documentation build rendered 201 pages after the example and source ranges were normalized.
