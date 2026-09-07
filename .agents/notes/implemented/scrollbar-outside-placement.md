---
status: implemented
kind: project-specification
updated_at: 2026-09-07
completed_at: 2026-09-07
modules:
  - packages/components/scrollbar
  - packages/theme-chalk/src/scrollbar.scss
  - docs/components/scrollbar.md
  - docs/zh/components/scrollbar.md
supersedes: []
---

# Scrollbar outside placement

## Contract

`SScrollbar` keeps `placement="inside"` as its default custom-track layout. `placement="outside"` reserves independent horizontal and vertical track space within the component footprint so thumbs do not cover content. It does not rely on negative offsets or changes to an ancestor's overflow.

`gap` controls the non-negative distance between the viewport and outside tracks. `thickness` controls track thickness. Track and thumb colors use the project's HSL tokens and current scrollbar treatment.

Only axes with overflowing content render a track. When `always` is false, the outside track can fade after pointer exit while its reserved space remains, preventing layout movement. Thumb dragging, track clicking, wheel and touchpad input, touch scrolling, and keyboard scrolling through the focusable viewport remain supported.

Native mode keeps browser scrollbars and ignores outside custom-track placement. The component continues to update thumb geometry after scrolling, resizing, and content changes, including environments with overlay scrollbars.

## Verification

- `packages/components/scrollbar/__tests__/scrollbar.test.ts` covers both-axis updates, content-fit removal, reserved hidden tracks, dragging, pointer visibility, default inside placement, and native mode.
- English and Chinese documentation contain the complete outside-placement example, Code source, and Playground source.
