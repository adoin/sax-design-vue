---
status: implemented
kind: project-specification
created_at: 2026-09-14
completed_at: 2026-09-14
modules:
  - packages/components/anchor
  - docs/.vuepress/theme
supersedes: []
---

# Route-boundary wheel ownership

## Contract

An `SAnchor` route boundary may accumulate wheel progress only from the page scroll context that owns the boundary. The owner is the element returned by `getContainer`, or `window` when no custom container is configured.

For every wheel event, the boundary follows `event.composedPath()` from the actual target toward that owner. If any intervening element has `overflow-x` or `overflow-y` set to `auto`, `scroll`, or `overlay` and has overflowing content on the corresponding axis, the gesture belongs to that nested scroller. The boundary must not accumulate or navigate, even when the nested scroller is already at its own edge.

Nested scroll ownership is structural and generic. It must not depend on Sax class names or component types; a handwritten `div`, third-party grid, native textarea, `STable`, and `SScrollbar` follow the same rule.

When a nested scroller receives a wheel event, both route-boundary direction intents reset immediately. Returning to the page therefore requires a newly armed page gesture; progress left by an earlier page gesture cannot be completed from another scrolling context.

## Implementation

- `packages/components/anchor/src/anchor-route-boundary-intent.ts` exports the composed-path and computed-overflow ownership check.
- `packages/components/anchor/src/anchor-route-boundary.vue` applies the check before choosing a direction or advancing progress, and resets both intents for nested gestures.

## Verification

- `pnpm exec vitest run packages/components/anchor/__tests__/anchor.test.ts --pool=threads --maxWorkers=1` — 1 file and 9 tests passed. The regression uses a plain overflowing `div`: 60% page progress is discarded by its wheel event, then two new page events are required to navigate.
- `pnpm exec eslint packages/components/anchor/src/anchor-route-boundary-intent.ts packages/components/anchor/src/anchor-route-boundary.vue packages/components/anchor/__tests__/anchor.test.ts --no-cache` — passed.
- `pnpm run typecheck:web` — passed.
- `pnpm run docs:build` — passed; 201 pages rendered.
- Headless Chrome on the Chinese Table editing guide reached the next-route boundary, accumulated 50% from a page wheel, reset to 0 after a wheel event from the overflowing `.s-vl__window`, and accumulated only 50% after returning to the page. The route did not change.
