---
status: implemented
kind: project-specification
updated_at: 2026-09-14
completed_at: 2026-09-14
modules:
  - packages/components/table
  - packages/theme-chalk/src/table.scss
  - packages/locale/lang/en.ts
  - packages/locale/lang/zh-cn.ts
  - docs/components/table/editing-validation-and-changes.md
  - docs/zh/components/table/editing-validation-and-changes.md
supersedes: []
---

# Table validation overlay

## Contract

Table validation feedback never contributes to row height or column sizing. Invalid cells use a contained danger shadow, subtle surface tint, icon marker, and hidden accessible description rather than an inline message or border.

The currently active error displays through a teleported `SPopper` anchored to its mounted cell. Its Teleport target is a dedicated clipped overlay host inside the Table data view. The host is separate from ordinary and virtual row content, so it gives the validation callout a hard painting boundary without affecting scroll geometry, mounting inside recyclable rows, or changing the global destination used by other floating controls.

A newly collected, marker-activated, or navigated error shows its callout for two seconds and then hides it without clearing the invalid state. Hovering an invalid cell selects and shows that error until the pointer leaves. The callout ignores pointer events so it cannot block cell clicks or double-click editing; the marker remains the keyboard- and touch-operable way to reopen it. `SPopper` observes the real cell element, so the callout hides when that anchor leaves the viewport or an overflowing Table ancestor. When the observer marks the cell as clipped, `SPopper` immediately stops painting the callout with `visibility: hidden` before its normal leave transition completes.

Multiple errors open a non-flow navigator at the table's lower-right edge with the total, current position, previous, next, and close actions. Navigation wraps, locates virtual or paginated errors through the existing validation locator, and remains keyboard operable. Closing navigation hides its callout without clearing errors; selecting a marker reopens it.

When validation reaches `maxErrors`, the navigator presents the collected count as a lower bound rather than an exact total. A limit and collected count of 100 display as `99+`, so the initial position reads `1 / 99+`; navigating to the last collected entry reads `99+ / 99+` instead of the contradictory `100 / 99+`. Clearing all errors restores exact counting.

Generated-source navigation waits for both the vertical row window and horizontal column window to mount before focusing the target cell. If the horizontal range is committed on an animation frame, the shared locator performs one bounded post-frame focus retry rather than scanning or polling the logical source.

Large validation scans execute built-in rules through a synchronous fast path and check the cooperative scheduling budget every 128 visited targets, yielding only after approximately eight milliseconds of work. Custom validators run in ordered stages with configurable `concurrency`, defaulting to 8 and clamped to 1–32. Stage size never exceeds the remaining `maxErrors` capacity; reaching the error limit prevents another target from being read in the all-failing case, stops later stages, and reports `truncated: true`. Cancellation and stale-value checks still discard the whole run rather than publishing partial results.

Manual `validate`, `validateRow`, and `validateCell` calls cancel an active editor before scanning committed data. Starting an editor clears existing errors for that cell, or for the row in row-edit mode. A failed commit retains the editor and publishes a fresh error, restoring the danger shadow and callout; changing the draft clears it again until the next failed commit.

Every active validation session participates in the Table busy state. The existing loading mask covers the data surface, the Table exposes `aria-busy`, and user editing, selection, header controls, column configuration, details, grouping controls, and Table keyboard shortcuts are blocked until validation completes or is cancelled. Internal error location remains able to expand hierarchy state and change the local page while busy, so loading cannot deadlock validation navigation.

## Accessibility

Invalid cells expose `aria-invalid` and reference a visually hidden live error message through `aria-describedby`. Error markers and navigator actions use native buttons with localized names. Color is supplemented by the error icon, callout text, live announcement, and error position.

## Verification

- Validation state, integration, and shared-tooltip regression coverage: 3 files and 57 tests passed.
- Complete Table suite: 62 files and 643 tests passed with one worker.
- Targeted ESLint, full `pnpm run typecheck`, `pnpm run build:theme`, and `pnpm run build` passed. The package build retains the existing non-fatal Vue Macros Table generic-resolution warnings.
- `pnpm run test:docs-examples`: 4 files and 12 tests passed.
- `pnpm run docs:build`: 201 pages rendered.
- Browser verification covered three simultaneous errors, stable 44 px row heights, previous/next navigation, close without clear, marker reopening, editor cancellation before manual validation, error removal on edit, error restoration after failed commit, dark-mode contrast, and an empty error console.
- `design-qa.md` records the selected design, browser screenshot, normalized comparison, one corrected dark-mode P2, and `final result: passed`.
- A local core-session benchmark checked 1,000,000 built-in-rule cells in approximately 952ms. Regression coverage also proves that `maxErrors: 3` with a higher requested concurrency reads, starts, and publishes exactly three all-failing custom-validator targets.
