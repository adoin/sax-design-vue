---
status: implemented
kind: project-specification
completed_at: 2026-09-30
modules:
  - packages/components/input/src/input.vue
  - packages/theme-chalk/src/input.scss
---

# Input text position stability

## User request

> 上一个问题还是会平移，是不是加了padding还是什么的导致的 你看看吧 平移不一定是css transform

## Contract

- Hover and focus must preserve Input's native horizontal padding, wrapper position, width, and ordinary placeholder text position. Motion audits must include padding, margins, widths, and alignment in addition to transform and left/right.
- Ordinary placeholders use opacity and blur to dissolve in place. Floating labels retain their explicit label transition; reduced-motion users receive no dissolve animation.
- Native text and ordinary placeholders share the `--sax-input-text-inset` layout variable, including legacy icon slots, icon-after, and prefix layouts. Do not restore the legacy 38px-to-40px focus padding change.
- When allowClear or clearable is configured, reserve its trailing space even while the action is hidden. Visibility remains controlled by showClear. Hover must not shrink the native text viewport or shift center/right aligned values merely to show an action.

## Verification

- 31 Input tests and the theme build passed.
- Browser measurements for ordinary, icon-slot, state/icon, and clearable inputs confirmed identical wrapper x/width, placeholder text x, and left/right padding before and after focus.
