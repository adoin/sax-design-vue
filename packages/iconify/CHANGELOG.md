# Changelog

## 1.1.0 — 2026-10-21

- Add `signSvgs` for local SVG files, with literal-name extraction, dynamic safelists, duplicate-name diagnostics, content-based shared data modules and development watching.
- Add the optional `sax-design-vue-iconify/api` browser entry for explicit API batches, alias rendering, cancellation, timeout and retry support; successful registrations are reused.
- Skip published component modules and internal library source during application transforms, preventing repeated extraction of library-owned icons.
- Allow local SVG names in the shared Iconify safelist. Vite 4, 5 and 8 remain supported.

## 1.0.2

- Existing build-time Iconify collection and runtime registry integration.
