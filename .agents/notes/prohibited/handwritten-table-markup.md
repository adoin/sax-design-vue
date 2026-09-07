---
status: prohibited
kind: prohibited-approach
recorded_at: 2026-09-07
scope:
  - packages/components/table
  - docs/components/table.md
  - docs/zh/components/table.md
reopen_only_if: The user explicitly requests a second table-authoring model and supplies compatibility requirements that cannot be met by columns or STableColumn.
---

# Public handwritten table row and cell components

## Attempted approach

Expose public `STr`, `STh`, or `STd` components, or document handwritten row and cell markup as another way to build `STable`.

## Evidence

The user explicitly required one data-driven table component that supports configuration-object columns and nested `STableColumn` declarations. The current implementation and tests use those two column-authoring forms without public row or cell components.

## Why it is prohibited

A handwritten markup path would create a second rendering model for sorting, filtering, selection, editing, hierarchy, merging, fixed columns, and virtualization. It would fragment behavior and make examples suggest capabilities that bypass the shared Table pipeline.

## Required alternative

Provide rows through `data`. Define columns through `columns` or renderless nested `STableColumn` children, using slots and renderers for custom content.
