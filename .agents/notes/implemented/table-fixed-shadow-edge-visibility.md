---
status: implemented
kind: project-specification
created_at: 2026-09-21
completed_at: 2026-09-21
modules:
  - packages/components/table/src/composables/use-table-column-virtualization.ts
  - packages/components/table/src/table-core.vue
  - packages/theme-chalk/src/table.scss
supersedes: []
---

# Table fixed-column shadow edge visibility

## Contract

Fixed-column boundary shadows communicate horizontally occluded content, not the mere presence of a fixed column. At the logical left edge, the left shadow is absent and the right shadow remains only when content continues to the right. At the logical right edge, the right shadow is absent and the left shadow remains only when content continues to the left. Between the edges, both applicable shadows are visible; when no horizontal overflow exists, neither shadow is visible.

Ordinary and horizontally virtualized tables use the same logical edge state from the column-virtualization controller. The edge calculation uses logical scroll distance so compressed million-column tracks and ordinary physical tracks follow the same behavior, with a one-pixel tolerance for native rounding.

The existing pointer-transparent fixed-boundary overlay remains the only shadow surface. Do not add per-cell gradients, another overlay per row, or a second scroll owner.

An actively edited fixed cell rises above the boundary overlay only for the duration of that edit session. Because a child editor's outward shadow can still be covered by adjacent sticky cells or clipped at the scrollport edge, the fixed cell owns a pointer-transparent focus-shadow layer above its editor content. That layer combines an outward soft shadow with a contained inner glow, so all four edges retain visible state feedback without adding an outline or ring. Input-surface controls inside that fixed editing cell suppress their own focus and hover shadows, preventing the raised child shadow from bleeding through later rows; the cell-owned shadow remains stable across pointer states. This exception does not add another fixed-column gradient or change the logical edge calculation; the boundary overlay retains normal ownership of horizontal occlusion.

## Verification

- `pnpm exec vitest run packages/components/table/__tests__/table-keyboard.test.ts packages/components/table/__tests__/table-column-scroll-anchor.test.ts --pool=threads --maxWorkers=1` — 2 files and 25 tests passed.
- Full Table suite — 64 files and 682 tests passed.
- Targeted ESLint for the changed Table implementation and tests — passed.
- Chromium verification on both ordinary and virtual Table examples confirmed `right-only → both → left-only` overlay classes at start, middle, and end.
- `pnpm run test:docs-examples` — 4 files and 14 tests passed.
- Fixed-editor hover verification confirmed the nested Input keeps `is-hovering` while its wrapper resolves to `box-shadow: none`; the cell-owned soft shadow remains unchanged and no longer bleeds through later rows. Four focused test files with 40 tests, targeted ESLint, the Web type check, and the theme build passed.
