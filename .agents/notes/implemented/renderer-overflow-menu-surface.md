---
status: implemented
kind: project-specification
created_at: 2026-09-21
completed_at: 2026-09-21
modules:
  - packages/components/button/src/renderer-buttons.vue
  - packages/components/table/src/table-toolbar-button.vue
  - packages/theme-chalk/src/button.scss
supersedes: []
---

# Renderer overflow-menu surface

## Contract

Shared renderer overflow actions and Table toolbar child actions use the same `SPopper` menu surface. The panel is content-sized with a 96px minimum and a 240px viewport-bounded maximum instead of a fixed wide minimum.

Default menu actions use the small Button size, a 32px minimum row height, 13px readable text, left-aligned icon/content spacing, and the semantic dark text color. Long action text may wrap inside the bounded panel. An action's explicit Button `type`, `size`, `color`, or `block` prop overrides these defaults.

The compact icon-only overflow trigger may remain mini; the readable menu rows must not inherit that trigger density. The shared Popper continues to own teleportation, positioning, flipping, shifting, focus, and outside-click behavior.

## Verification

- Table business, Form, and Button suites — 3 files and 39 tests passed.
- Targeted ESLint — passed.
- `pnpm run build:theme` — passed.
- Chromium verification on the localized query-and-toolbar example measured a 96px panel, two 82px content rows, 32px action heights, 13px text, and the expected dark readable color.
- `pnpm run typecheck:web` reached only the pre-existing `packages/components/table/src/table-find-panel.vue:633` callback mismatch from unrelated unstaged work.
