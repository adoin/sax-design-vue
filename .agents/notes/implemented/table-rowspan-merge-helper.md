---
status: implemented
kind: project-specification
created_at: 2026-09-21
completed_at: 2026-09-21
modules:
  - packages/components/table/src/table-merge.ts
  - docs/components/table/merged-cells.md
  - docs/zh/components/table/merged-cells.md
supersedes: []
---

# Table consecutive-row merge helper

## Contract

The Table package publicly exports `createTableRowspanMerges(rows, { field, col, equals? })` for the common case of vertically merging consecutive JSON rows with equal field values.

The helper follows the supplied row order, supports typed dot-separated `FieldPath` values, compares with `Object.is` by default, and accepts an optional typed equality callback for normalization or structural comparison. It returns only runs longer than one row, preserves the target zero-based visible `col`, always writes `colspan: 1`, and never mutates or reorders the supplied rows.

Repeated values separated by another value form independent runs and are never merged across that gap. Call the helper separately for independently merged columns. Horizontal, intersecting, generated-source, or otherwise application-specific regions remain explicit `TableMergeRange` values or `TableMergeResolver` functions.

The result is a snapshot of the supplied order. Consumers must recompute it when sorting, filtering, pagination, tree expansion, or column placement changes the row or visible-column coordinates.

## Verification

- `packages/components/table/__tests__/table-merge-utils.test.ts` covers consecutive and separated runs, nested fields, custom equality, input preservation, single rows, and invalid target columns.
- Merge utility and integration tests — 2 files and 16 tests passed.
- Targeted ESLint for the utility, tests, and localized examples — passed.
- `pnpm run test:docs-examples` — 4 files and 14 tests passed.
- Chromium verification confirmed the localized example renders the two computed `rowspan=2`, `colspan=1` owner cells.
- `pnpm run docs:build` — passed; 201 pages rendered and the public package import resolved in production.
