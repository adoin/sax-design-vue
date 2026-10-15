---
status: active
kind: project-specification
updated_at: 2026-10-15
modules:
  - packages/theme-chalk/src/card.scss
  - docs/components/card.md
  - docs/zh/components/card.md
---

# Card explicit hover feedback precedence

## Contract

- Omitted `hover-effect` preserves each named preset's existing behavior.
- Explicit `none`, `lift`, and `glow` replace preset surface transforms and hover shadow changes; preset internal media and content reveals remain available.
- `none` keeps the surface stationary, `lift` moves it up 4px, and `glow` changes its shadow without moving it.
- Interactive keyboard-focus feedback must not reintroduce surface movement for explicit `none` or `glow`. Press feedback remains a separate interaction state.
- Material and decorative `effect` layers remain independent.

## Implementation and verification

- Local changes guard preset surface feedback and the default interactive focus translation; omitted props retain the previous CSS behavior.
- Theme build passed; Card and documentation checks passed: 5 files, 60 tests.
- Browser checks on repository documentation confirmed classic + none has no transform, classic + lift is translateY(-4px), classic + glow has no transform and a glow shadow, and omitted hover-effect retains translateY(5px).
- Both public documentation locales explain the distinction between preset internal presentation and surface hover feedback.

## Pending

- User explicitly requested keeping this change local and not publishing it yet. No package version change, release tag, push, or Admin dependency update was performed.
- Recheck with the remaining queued component changes before the next authorized release.


Release authorization: 2026-10-15 user requested publishing the new library version and upgrading Admin. Included in 2.1.7 after local verification; previous release hold is superseded.
