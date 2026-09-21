---
status: prohibited
kind: prohibited-approach
recorded_at: 2026-09-20
scope:
  - packages/components/table
  - packages/theme-chalk/src/table.scss
reopen_only_if: The user explicitly asks to place Table scrollbars outside the viewport through SScrollbar or another second scroll owner.
---

# Table outside scrollbar to unclip rounded corners

## Prohibited approach

Do not wrap `STable` in `SScrollbar` (including `passthrough` plus `scrollTarget`) or add `scrollbarConfig` `{ x, y: 'inside' | 'outside' }` to move tracks outside the rounded data viewport.

That path introduces a second scroll conductor, extra Table APIs and documentation, and still fights overlay-scrollbar geometry around fixed columns. The user rejected it after a recoverable snapshot and asked to match Ant Design Vue instead.

## Required alternative

Round only the top two corners of the table chrome. Keep the bottom two corners square so native overlay thumbs stay unclipped on the existing virtual-list or table overflow owner. Do not force a stable scrollbar gutter to solve the same clip.
