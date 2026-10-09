---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Result feedback illustrations and examples

## Contract

- Preserve success/warning/error/info status, title, description, content alias, icon/title/default/extra slots. Default content accepts block markup without paragraph nesting. description takes precedence over the content alias.
- Default artwork is a semantic inline SVG with layered paper, shaded confirmation seal, decorative glints and a vector state mark. It consumes complete theme color tokens and uses unique SVG gradient and heading IDs through the shared ID context; no SVG filters or external assets are needed.
- `animated` defaults to true: one entrance runs on first visibility, then rests. It pauses when hidden/offscreen/deactivated, honors reduced motion, and releases observers/listeners after completion. Custom icon content controls its own motion.
- Shared `size` adjusts artwork, typography and spacing. `layout` supports vertical and responsive horizontal arrangements, with wrapping actions and narrow-screen stacking.
- `details` adds a structured-content region. Every slot receives the current status. Empty slot regions do not reserve arbitrary overlay space.
- Public docs provide eight paired examples: success, information, warning, error, sizes, horizontal layout, custom content and animation. All rendered examples, Code and Playground use localized complete SFC sources and canonical English hashes.

## Verification

- Nine component tests passed: four statuses, text/slot precedence and valid block content, size/layout behavior, visibility-triggered one-time motion and cleanup, opt-out/reduced motion, ID isolation and seeded SSR.
- Documentation source/API audit: 21 tests passed. Web/Vitest type checks, targeted ESLint and theme build passed.
- Browser verified acknowledgment, warning-to-success update and details expansion/collapse. All eight Code/Playground examples were checked in both locales through one reused verification tab. A 390px viewport stacked the horizontal example without overflow.
