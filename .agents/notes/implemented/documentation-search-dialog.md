---
status: implemented
kind: project-specification
completed_at: 2026-10-12
modules:
  - docs/.vuepress/theme/components/SearchBox.vue
  - docs/.vuepress/theme/components/DocumentationSearchDialog.vue
  - docs/.vuepress/theme/node/documentationSearch.ts
  - packages/components/input
---

# Documentation search dialog

## 用户要求

> 文档最顶上的这个为什么垂直不居中 这是组件的问题还是文档的问题
>
> 不支持ctrl + k来搜索组件和文档内容 先建立一下功能再发吧
>
> ctrl 弹出一整个完整的弹窗 最好能搜索文档文字和组件库，右上角的搜索也不要做输入框，直接点击弹出和这个弹窗一样的就行
>
> input 不是自带clear吗

## Contract

- The documentation header uses a vertically centered search button, not an inline native input. Clicking it and Ctrl+K / Cmd+K open the same complete modal; existing plain S and slash shortcuts remain limited to non-editable targets.
- Reuse SDialog and SFocusTrap for teleportation, backdrop, scroll locking, focus containment/restoration, and Escape dismissal. Use SInput with clearable; do not add a redundant external clear-query button. Only the separate modal close action remains.
- Build a lazy client search index from prepared public VuePress pages. Include component names/aliases, headings, prose, and API descriptions. Return locale-specific ranked excerpts and canonical section links; exclude code/source template blocks. Deduplicate paths and cap same-page hits to keep results diverse.
- Group results into components, documentation, and guides. Highlight matched text with escaped Vue text, never raw HTML. Arrow keys move selection and Enter opens the selected result. IME composition does not trigger result navigation.
- Input preserves consumer combobox ARIA when built-in autocomplete is disabled, while built-in autocomplete retains ownership when enabled. Native Input clear labels now use locale translations.
- Search UI labels follow the page locale, including the native clear control through a local ConfigProvider. Search index loading is deferred until the modal opens and requires no external search service or credentials.

## Verification

- 30 Input/autocomplete/search tests and 21 documentation tests pass; web, play, node, and Vitest type checks pass.
- Complete documentation build renders 231 pages. Library build and refreshed module/full-bundle builds succeed; compiled Input ARIA, public exports, and 2.1.0 version verified through SSR.
- Browser verifies top search is a button with no input; pointer and Ctrl+K open the same modal; grouped component and body matches, keyword highlighting, arrow selection, focus looping, Escape restoration, and native clear behavior work.
- “保留阅读位置” finds Message Scroller prose and Enter navigates to /zh/components/message-scroller.html#dynamic-virtual-scrolling.
- Body scroll is locked while open. A 375px viewport contains the modal without horizontal overflow (355px content/scroll width); temporary emulation is cleared.
- Final screenshot: .codex/previews/docs-search-dialog.png.
