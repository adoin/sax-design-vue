---
status: implemented
kind: project-specification
updated_at: 2026-09-09
completed_at: 2026-09-09
modules:
  - packages/components/icon
  - packages/components/icon-picker
  - scripts/generate-builtin-icon-fallbacks.ts
  - docs/icons/README.md
  - docs/zh/icons/README.md
---

# Built-in icon fallbacks

## Contract

Component-owned default icons must remain visible when an application does not configure the Carbon collection or the Sax Iconify Vite plugin. `SIcon` resolves icon data in this order: explicit `iconData`, a runtime or build-time registered icon, then the bundled essential Carbon fallback for hard-coded component defaults. Application registrations can therefore replace a bundled shape without changing component APIs.

The base fallback contains only Carbon names referenced by component source. IconPicker owns a separate generated map for its broader default list and registers those records only when the IconPicker module is loaded. Application-selected icons outside these two sets still require the corresponding collection or dynamic safelist.

`scripts/generate-builtin-icon-fallbacks.ts` scans component source, excludes generated files, separates IconPicker's default list, and regenerates both maps from the pinned Carbon development package. Its coverage test fails when component source introduces a new hard-coded `cb:*` name without regenerating the fallback.

## Verification

- The essential component map contains 40 icons and the IconPicker map contains 168 icons.
- The icon, IconPicker, pagination, select, table, tabs, and upload suites pass: 72 files and 689 tests.
- Icon validation finds 199 valid Iconify names across 72 files.
- Web type checking, focused linting, documentation example checks, declaration generation, and the full npm build pass.
- Direct SSR imports from the generated npm output render a fallback `SIcon` without registry data and expose all 168 IconPicker defaults.
