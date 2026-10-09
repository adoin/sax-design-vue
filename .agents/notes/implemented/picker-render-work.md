---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Picker rendering work and compact Switch labels

## Contract

- DatePicker does not connect date/time candidate constraints when neither a disabled callback nor minimum/maximum bounds are configured. TimePicker connects its timezone-aware constraint only when a disabled-hours/minutes/seconds callback exists. TimePanel retains explicit option/method disabling while skipping date cloning when no date callback exists.
- DatePanel computes disabled state and festival metadata once per visible calendar cell. All bindings and range hover states reuse that result. Reactive dependencies and callback changes invalidate the computed metadata; selection remains checked at the point of interaction.
- Placeholder uses its own transient playback state with the shared graph/driver directly, deciding playback before DOM patch. Its existing 38px/20px padding supplies particle overflow room, so the dedicated padded-text filter region does not repeat the old 300%/600% expansion. Other module regions and Dialog playback are unchanged.
- Compact Switch labels keep their 10px font and stable state-label width. A 14px line box plus 1px top padding supplies a 0.5px downward optical adjustment for CJK glyphs. Classic, soft and text variants share this treatment; sizes, checked state and loader ownership remain independent.

## Verification

- Focused components/modules: nine files, 76 tests passed. Affected controls and full documentation source/API audit: twelve files, 105 tests passed. Final placeholder scheduling subset: three files, 30 tests passed.
- Calendar callbacks run 42 times for 42 dates, remain at 42 when the range preview changes, and update displayed metadata/disabled state after callback changes. TimePicker constraint attachment/removal and disabled-hour behavior are covered.
- Component typecheck, targeted ESLint and theme build passed. Browser measured Switch's 14px line-height and 0.5px label-box center offset consistently, including classic/text checked and unchecked controls.
- The initial Windows fork-pool run timed out before executing tests. Repeating with two thread workers passed; this was a runner startup issue, not a passing test result.
- These changes reduce known render work and filter bounds. No numerical end-to-end FPS improvement is claimed from the development browser's noisy timing samples.
