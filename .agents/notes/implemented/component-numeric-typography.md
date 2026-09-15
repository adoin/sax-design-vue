---
status: implemented
kind: project-specification
created_at: 2026-09-14
completed_at: 2026-09-14
modules:
  - packages/theme-chalk/src/reset.scss
supersedes: []
---

# Component-wide numeric typography

## Contract

All Sax component roots request tabular, lining figures through the inherited declaration `font-variant-numeric: tabular-nums lining-nums`. The default belongs to the component namespace rule in the theme reset, so it reaches Table content, controls, overlays, and other component descendants without changing typography in unrelated application content.

Numeric alignment remains component- and consumer-controlled. This default does not force right, center, or left alignment and does not change Table column `align` behavior. Consumers may override `font-variant-numeric` when a component needs proportional or old-style figures.

The active font must expose the corresponding OpenType features for glyph advances to change. CSS requests but cannot synthesize tabular figures. The bundled documentation Poppins face currently reports the component default in computed styles but retains proportional digit widths; changing the project-wide font or introducing a dedicated numeric face is a separate product decision.

## Implementation

`packages/theme-chalk/src/reset.scss` declares the numeric variant beside the existing component-wide font family on `[class^='#{$namespace}']`. The property inherits through each component subtree. Existing component-specific tabular declarations remain compatible.

## Verification

- `pnpm run build:theme` — passed; generated `base.css` and `index.css` contain the component namespace declaration.
- `pnpm run docs:build` — passed; 201 pages rendered.
- Headless Chrome against the local documentation reported `lining-nums tabular-nums` for a Table data cell, its nested content, and a Button while the Table cell remained `text-align: left`.
- Browser measurement confirmed the documented Poppins limitation: computed styles contain the requested variant, while its digit advances remain proportional.
