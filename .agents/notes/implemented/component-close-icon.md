---
status: implemented
kind: project-specification
updated_at: 2026-09-28
---

# Shared close artwork

- Built-in close, clear, and tag-removal controls use the soft solid X in `packages/components/icon/src/close-artwork.ts`.
- Use `IconClose` in component templates and `sax:close` for dynamic icon-name defaults. Preserve custom icon slots and explicit icon data.
- Do not add text X/× close controls, CSS crossed lines, or separate hand-drawn close paths. Mathematical multiplication symbols are unrelated.
- Preserve each control's accessible name and click target. The SVG uses currentColor; size and scale adapt to the surface. DatePicker uses a centered 14px SVG within its fixed 20px action area.
- Component tests, Web type checking, theme build, and the 203-page documentation build passed for the shared artwork migration.
