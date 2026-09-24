---
status: implemented
kind: project-specification
created_at: 2026-09-21
completed_at: 2026-09-21
modules:
  - packages/components/table/src/table-merge-layer.vue
  - packages/components/table/src/table-core.vue
  - packages/theme-chalk/src/table.scss
supersedes: []
---

# Table merged-fragment interaction parity

## Contract

A logical merged cell may be split into fixed-left, center, and fixed-right DOM fragments. It remains one interaction subject across those rendering partitions.

Only the primary owner renders content, focus semantics, controls, validation state, or an editor. Continuation fragments remain aria-hidden and proxy click, double-click, and context-menu actions to that owner so address normalization and business callbacks retain the merged origin.

Every visible fragment of the same logical region shares hover, active-cell, and range-selection surfaces. Hovering any fragment highlights the complete visible region; selecting any covered address keeps the single logical active address at the owner while painting every fragment. Removing a region or moving it outside the rendered window clears stale shared hover state.

Do not duplicate text, focus targets, editor instances, or accessible cells across fragments.

## Verification

- Merge integration and merge-layer suites — 2 files and 19 tests passed.
- The fixed-pane continuation test confirms click normalization, synchronized active classes, synchronized hover classes, one editor, and owner-routed context menus.
- Chromium verification on the localized virtual merged-region example confirmed both visible fragments move together from the base surface to the shared hover tint and then to the shared active tint after clicking the center continuation.
- `pnpm run build:theme` — passed.
- Targeted ESLint — passed.
- `pnpm run typecheck:web` reached only the pre-existing `packages/components/table/src/table-find-panel.vue:633` callback mismatch from unrelated unstaged work.
