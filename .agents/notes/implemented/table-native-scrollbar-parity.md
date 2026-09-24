---
status: implemented
kind: project-specification
created_at: 2026-09-21
completed_at: 2026-09-21
modules:
  - packages/theme-chalk/src/table.scss
  - packages/theme-chalk/src/virtual-list.scss
supersedes: []
---

# Table native scrollbar parity

## Contract

Table has two legitimate horizontal scroll owners: the Table root for ordinary rows and the existing VirtualList window for virtual rows. They must expose the same visible scrollbar treatment so switching virtualization does not change color, thickness, hit area, or hover feedback.

Both owners use a 6px WebKit scrollbar, a one-pixel transparent thumb border, pill geometry, the primary color at 30% opacity, and 52% opacity on hover. Firefox uses the corresponding thin scrollbar with a translucent primary thumb and transparent track.

Keep the existing owner for each mode. Do not introduce `SScrollbar`, an outside track, a second scroll conductor, or a stable gutter. Documentation theme scrollbar rules must not define Table's component appearance.

## Verification

- `pnpm run build:theme` — passed.
- Runtime Chromium inspection on the ordinary fixed-column example and the virtual column-resizing example confirmed matching `6px × 6px` tracks, identical primary-color thumb values, one-pixel transparent borders, and pill radii.
- The ordinary table retained `scrollWidth > clientWidth` and horizontal scrolling after the visual change.
