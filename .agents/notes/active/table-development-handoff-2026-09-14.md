---
status: active
kind: conversation-handoff
source_task: 01a08f4a-a937-7ae3-9086-1dcfb8e9ac04
created_at: 2026-09-14
modules:
  - packages/components/table
  - packages/components/config-provider
  - packages/components/anchor
  - packages/components/form
  - packages/components/virtual-list
  - packages/theme-chalk
  - docs
supersedes: []
---

# Continue verified Table and documentation development

## Goal

Continue Sax Design Vue component development from the current dirty checkout without losing the verified Table, validation, virtual scrolling, Anchor, global configuration, renderer, documentation, and build-pipeline work completed in the source task.

## Confirmed requirements

- `STable` remains the only public data-table business shell. Consumers use `data` plus `columns` or renderless `STableColumn`; no handwritten row/cell API or separate grid wrapper may be introduced.
- Component defaults resolve as explicit local prop, nearest `SConfigProvider`, outer Provider, then built-in default. Table global defaults exclude instance data, controlled state, renderers, business callbacks, and request configuration.
- Virtual row scrollbar empty-track clicks jump immediately while thumb dragging preserves native measurement locking.
- Anchor route-boundary gestures belong only to the page scroll owner. Nested overflowing elements reset route intent. SVG progress must finish before wheel navigation commits.
- Table validation feedback must not change row height or column layout. Invalid cells use a contained danger shadow and marker; the active error uses the shared teleported `SPopper`; multiple errors use an overlaid previous/next navigator.
- Manual `validate`, `validateRow`, and `validateCell` cancel active editors before scanning committed data. Starting an editor clears its old cell/row error state; a failed commit republishes errors without discarding the draft.
- Error navigation reuses the existing locator pipeline and must support ordinary virtualization, horizontal virtual columns, local pagination, loaded tree/group paths, and indexed `virtualSource` coordinates. It navigates only errors already collected by validation; the default `maxErrors` remains 100 and remote unloaded data is not fetched implicitly.
- English and Chinese documentation, rendered examples, Code, and Playground remain synchronized and public copy must describe the current API rather than the working conversation.

## Current implementation state

- The governing Table contracts are `.agents/notes/implemented/table-component-architecture.md`, `.agents/notes/implemented/table-documentation-information-architecture.md`, and `.agents/notes/implemented/table-single-component-business-shell.md`.
- The latest validation contract is `.agents/notes/implemented/table-validation-overlay.md`.
- Validation session and navigation state live in `packages/components/table/src/composables/use-table-validation.ts`; public/manual validation behavior lives in `use-table-validation-api.ts`; edit invalidation lives in `use-table-edit.ts`.
- `packages/components/table/src/table-validation-overlay.vue` renders the active `SPopper` callout and multi-error navigator. `table-data-row.vue` renders non-flow accessible messages and error markers. Theme styling lives in `packages/theme-chalk/src/table.scss`.
- The generated-data guide at `docs/zh/components/table/editing-validation-and-changes.md#generated-data-validation` demonstrates million-row, 100,000-column targeted validation. Existing integration coverage proves one far generated cell can be validated, mounted, and focused with bounded reads.
- Global component defaults are recorded in `.agents/notes/implemented/global-component-defaults.md`; ConfigProvider uses lightweight independent policy types, including `TableGlobalConfig` in `packages/components/table/src/table-global-config.ts`.
- Anchor routing/progress, global renderers, numeric typography, localized anchors, custom Table editor sizing, and virtual scrollbar navigation have focused implemented specifications under `.agents/notes/implemented/`.
- `design-qa.md` contains the latest Table validation visual comparison and ends with `final result: passed`. Evidence images are `.agents/audits/table-validation-overlay-implementation.png` and `.agents/audits/table-validation-overlay-comparison.png`.

## Decisions and rationale

- Error callouts reuse `SPopper`; a component-specific positioning layer would duplicate shared teleportation, viewport shifting, stacking, and scroll tracking.
- Accessible error text remains in a 1 × 1 px absolutely positioned live description so `aria-describedby` works without adding layout height.
- Error markers and navigator controls use Carbon icons and native buttons. Color is not the only error signal.
- The navigator closes independently of validation errors. Closing hides navigation/callout but preserves invalid-cell state; selecting a marker reopens it.
- The navigator is created only while errors exist so ordinary tables retain exactly one shared overflow tooltip instance.
- The selected design's inline seat-error text was intentionally omitted because the user's stronger requirement is zero validation contribution to document flow.

## Working tree state

- Repository root and current working directory: `D:\workspace\sax-design-vue`.
- Branch: `main`.
- The checkout has extensive unstaged and untracked changes spanning Table, Anchor, ConfigProvider, Form, icons, documentation infrastructure, bilingual docs, tests, specifications, and build tooling. These changes are the user's active development state; preserve them and do not reset, checkout, clean, or create an isolated worktree.
- No changes are staged by this handoff. Use the saved project directly so the new task sees the current checkout.
- The only applicable instruction file is the root `AGENTS.md`. Its `Project specifications` section already directs future work to `.agents/notes/active/`, `.agents/notes/prohibited/`, and implemented Table contracts. Durable repository-wide documentation, renderer, overlay, and component-family rules remain there.

## Verification

### Passed

- Complete Table suite: `pnpm exec vitest run packages/components/table/__tests__ --maxWorkers=1` — 62 files, 636 tests.
- Validation/shared-tooltip focused run — 3 files, 50 tests.
- ConfigProvider and Anchor integration — 2 files, 17 tests; Form integration — 12 tests.
- `pnpm run typecheck` passed across Web, Play, Node, Vite, Vitest, Table generic, and renderer-doc projects.
- Targeted ESLint and `git diff --check` passed.
- `pnpm run build`, `pnpm run build:theme`, and declaration generation passed. The build still prints existing non-fatal Vue Macros warnings about resolving complex `TableColumnOptions` during bundling.
- `pnpm run test:docs-examples` — 4 files, 12 tests.
- `pnpm run docs:build` — 201 pages.
- In-app Browser verification covered three simultaneous errors, stable 44 px rows, previous/next navigation, close without clear, marker reopening, editor cancellation before manual validation, removal on edit, restoration after failed commit, dark mode, and no error-level console messages.

### Known failure outside the latest Table suite

- `packages/components/table-select/__tests__/table-select.test.ts` has an existing named-cell-slot assertion failure. It remained reproducible after reverting an attempted TableSelect/global-Table-default integration, so it was not changed as part of the global-default or validation work. Reassess separately before claiming the entire repository test suite is green.

### Not yet run

- There is no dedicated test that collects two or more widely separated `virtualSource` errors and drives the new previous/next navigator across them. The shared locator pipeline and single far-cell behavior are tested, but this exact sequence should be made explicit.

## Prohibited approaches

- `.agents/notes/prohibited/handwritten-table-markup.md`: do not add public `STr`, `STh`, or `STd` authoring paths.
- `.agents/notes/prohibited/separate-table-grid-wrapper.md`: do not split query, toolbar, proxy, or virtual business behavior into another public table component.
- `.agents/notes/prohibited/conversation-history-in-public-docs.md`: keep this handoff and verification history internal; public docs describe only current behavior and APIs.

## Remaining work

1. Add explicit integration coverage for multiple distant generated-source errors navigated with previous/next, including bounded row/column reads, horizontal/vertical mounting, focus, and wraparound.
2. Re-run the focused validation tests and complete Table suite after that coverage or any implementation correction.
3. Continue with the user's next Table/component request from the current checkout, updating the smallest relevant specification and bilingual docs when behavior changes.

## Open questions

- Whether the user wants the generated-data documentation example expanded to visibly demonstrate several far-apart errors, or only wants internal integration coverage.
- Whether to repair the independent TableSelect named-slot test in the same continuation or leave it for a separate focused task.

## Next action

Inspect `use-table-validation.ts`, `use-table-data-scope.ts`, and `table-validation-integration.test.ts`, then add a bounded multi-error `virtualSource` previous/next navigation test before changing runtime behavior.
