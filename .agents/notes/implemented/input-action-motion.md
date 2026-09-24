---
status: implemented
kind: project-specification
created_at: 2026-09-21
completed_at: 2026-09-21
modules:
  - packages/theme-chalk/src/input.scss
supersedes: []
---

# Input trailing-action motion

## Contract

Input clear and password-visibility actions appear and disappear in their final trailing slot. Their transition must never replace the `translateY(-50%)` transform that centers the control or derive movement from right-position variables.

Entry uses the shared quick duration with opacity and a restrained `0.88 → 1` scale around the action center. Exit uses the shared micro duration with the same fixed center. No horizontal or vertical travel is introduced, and the transition does not animate layout properties.

Reduced-motion mode disables the action transition. Clear behavior, focus retention, keyboard clearing, suffix spacing, and password visibility behavior remain unchanged.

## Verification

- `packages/theme-chalk/__tests__/input-motion.test.ts` guards the centered scale states, motion tokens, removal of the old keyframes, and reduced-motion fallback.
- Input and theme motion suites — 3 files and 24 tests passed.
- `pnpm run build:theme` — passed.
- Chromium sampling on the localized query-form example confirmed the clear button's center remains exactly aligned with the input throughout entry while opacity and scale interpolate in place.
