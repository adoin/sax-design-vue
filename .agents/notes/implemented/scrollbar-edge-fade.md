---
status: implemented
kind: project-specification
created_at: 2026-09-22
completed_at: 2026-09-22
modules:
  - packages/components/scrollbar
  - packages/theme-chalk/src/scrollbar.scss
  - docs/components/scrollbar.md
  - docs/zh/components/scrollbar.md
supersedes: []
---

# Scrollbar edge fade

## Contract

`SScrollbar.fade` is opt-in and defaults to `false`. `true` and `y` fade both vertical edges; `x` fades both horizontal edges. `top`, `bottom`, `left`, and `right` select physical edges. `start` and `end` select direction-aware inline edges. The shadcn-style aliases `t`, `b`, `l`, `r`, `s`, and `e` map to those full names.

A non-negative number enables the vertical pair and sets the fade size in pixels. `ScrollbarFadeOptions` accepts `direction` plus a numeric pixel size or CSS length/percentage string. The default size follows shadcn's `min(12%, 40px)` treatment.

The mask is applied to the existing Scrollbar viewport, never to a new wrapper or second scroll owner. Existing inside, outside, native, custom-track, keyboard, pointer, wheel, and programmatic scrolling behavior remains unchanged.

Fade progress comes from Scrollbar's existing measurement and scroll pipeline. Each requested edge grows over the first 96 pixels away from that edge and clears as the edge is reached. A non-overflowing axis resolves both edge sizes to zero, avoiding the permanent static mask produced by shadcn's current non-scroll-timeline fallback in Firefox. Horizontal logical edges respect RTL and normalize negative or positive RTL scroll offsets.

English and Chinese documentation use separate localized example SFCs. Their rendered examples, Code, and Playground expose every direction through an existing Select control and demonstrate a custom 48px size.

## Verification

- Scrollbar, theme, and API metadata tests: 3 files and 15 tests passed.
- Targeted ESLint, `pnpm run typecheck:web`, and `pnpm run build:theme` passed.
- `pnpm run test:docs-examples`: 4 files and 17 tests passed.
- `pnpm run docs:build`: 203 pages rendered; canonical `edge-fade` headings and recursive `ScrollbarFade`, `ScrollbarFadeOptions`, and `ScrollbarFadeDirection` type details are present in both locales.
- Browser verification covered vertical start and middle positions, horizontal start and near-end positions, proportional 48px masks, direction switching, localized English and Chinese examples, and both Code and Playground sources.
