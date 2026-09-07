---
status: prohibited
kind: prohibited-approach
recorded_at: 2026-09-07
scope:
  - packages/components/table
  - docs/components/table.md
  - docs/zh/components/table.md
reopen_only_if: The user explicitly reopens the public component split and provides a compatibility or migration requirement.
---

# Separate public table grid wrapper

## Prohibited approach

Do not expose `STableGrid`, `TableGrid`, or another public component that wraps `STable` solely to add query forms, toolbars, request proxy behavior, or virtual business-table examples.

This split duplicates the table rendering contract, fragments refs and exposed methods, creates separate documentation and navigation, and makes consumers choose between two components for the same table. The user explicitly rejected that public split.

## Required alternative

Add optional business behavior to `STable` through `queryConfig`, `toolbarConfig`, and `proxyConfig`. Keep query form and toolbar views private to the table package, and keep request state and orchestration in table composables.

The governing implemented contracts are [table-component-architecture.md](../implemented/table-component-architecture.md) and [table-single-component-business-shell.md](../implemented/table-single-component-business-shell.md).
