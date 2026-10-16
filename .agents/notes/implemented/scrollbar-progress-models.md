---
status: implemented
kind: project-specification
updated_at: 2026-10-16
completed_at: 2026-10-16
modules:
  - packages/components/scrollbar
  - docs/components/scrollbar.md
  - docs/zh/components/scrollbar.md
---

# Scrollbar progress models

## User request

> 滚动条组件增加 滚动条百分比的通道 用来实现类似gsap那种滚动动画，比如可以直接v-model:x v-model:y 两个百分比，然后x或者y去控制动画？ 或者更好的其他方式。

## Contract

- Optional `x` and `y` props and `update:x` / `update:y` events expose actual scroll progress in the range 0–100, retaining fractional precision. Either axis works independently; event listeners alone support observation without two-way state.
- Progress divides the current offset by the scrollable range (scroll size minus client size). Horizontal progress starts at inline start, including negative native scrollLeft in RTL. No overflow reports zero; overscroll and finite out-of-range inputs are clamped. Non-finite inputs are ignored.
- Changed model inputs seek the native viewport. Echoes of reported progress do not rewrite the offset, preserving native smooth scrolling. Normalized values are emitted even when a rejected/clamped input resolves to an unchanged percentage.
- Native scroll events remain the source for wheel, keyboard, track/thumb and programmatic scrolling; the existing `scroll` payload remains `{ scrollTop, scrollLeft }` without extra fields.
- Existing resize measurement observes both content and viewport. Visible resize retains actual pixel position and recalculates progress. Zero-sized hidden viewports do not publish false zeroes; the last reported or newer requested percentage is restored when measurable. `noresize` retains its manual `update()` contract.
- Keep synchronization isolated in `use-scroll-progress.ts`; do not add an animation-engine dependency or create a separate scroll owner.
- Both documentation locales include a complete example mapping progress to position, rotation and opacity, with buttons seeking percentages and matching Code / Playground sources.

## Verification

- Scrollbar: 2 files, 15 tests passed, covering initialization, independent input/output, native mode, fractional progress, echo suppression, resizing, hidden restoration, normalization, no overflow and RTL, plus existing thumb/fade contracts.
- Component web typecheck passed; documentation source/API audit: 4 files, 21 tests passed.
- In-app browser verified bilingual rendered examples, both Code sources and Playgrounds, two-axis 50%/100% seeking, and native keyboard scroll updating progress and animation.
