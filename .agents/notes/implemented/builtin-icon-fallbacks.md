---
status: implemented
kind: project-specification
updated_at: 2026-10-21
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

The library embeds only Carbon icons required by its internal controls. IconPicker retains 168 candidate names without embedding their SVG payloads. It reuses application registrations and the same control fallback map before requesting missing candidates from its runtime API. `api: false` disables browser requests; an application may instead prebundle its candidates through its own Iconify safelist. Application-owned SVG data must remain in the application output, never in the component library.

`scripts/generate-builtin-icon-fallbacks.ts` scans component source, excludes generated files and IconPicker's candidate list, and regenerates only the control map from the pinned Carbon development package. Its coverage test fails when component source introduces a new hard-coded `cb:*` name without regenerating the fallback. Library module/full builds must not run the application Iconify extraction plugin. Application transforms skip published library modules and this repository's internal component sources.

## Verification

- The current control map contains 66 names; 46 overlap the 168 candidate names. The remaining 122 candidate payloads are absent from both the rebuilt ESM modules and full ESM bundle, verified by parsing their JavaScript string literals and comparing to Carbon data.
- Rebuilt library output contains zero candidate-table modules and zero Iconify SVG virtual modules.
- Icon/plugin suites pass 99 tests, including Vite 4/5/8 extraction, runtime API batches/aliases, offline mode, fallback reuse, cancellation, caching and retry. Vitest type checking and all 22 documentation checks pass; full library/declaration/style and 237-page documentation builds pass.
- IconPicker loads only after mounting; ordinary SIcon and SSR/service imports do not initiate requests. Runtime data loading lives in the browser-safe optional `sax-design-vue-iconify/api` entry, separate from Vite/filesystem code.
