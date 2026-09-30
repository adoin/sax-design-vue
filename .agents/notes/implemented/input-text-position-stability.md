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
- Ordinary placeholder layout keeps its inset, margin, padding, and transforms unchanged through focus. The original opacity-only fade is superseded by the user-provided SVG dissolve/reassembly animation in [input-placeholder-dissolve.md](input-placeholder-dissolve.md). Only the filtered graphic's fragments scatter; the text container and native input remain stationary. Floating labels retain their explicit label transition; reduced-motion users receive an immediate state change.
- Native text and ordinary placeholders share the `--sax-input-text-inset` layout variable, including legacy icon slots, icon-after, and prefix layouts. Do not restore the legacy 38px-to-40px focus padding change.
- When allowClear or clearable is configured, reserve its trailing space even while the action is hidden. Visibility remains controlled by showClear. Hover must not shrink the native text viewport or shift center/right aligned values merely to show an action.
- Native Input transitions enumerate background color, text color, and box shadow. Do not animate its padding, width, margins, or position through transition-all.
- Input color and state documentation demos use responsive grid cells, keeping each example independent of adjacent control geometry.

## Verification

- 31 Input tests and the theme build passed.
- Browser measurements for ordinary, icon-slot, state/icon, and clearable inputs confirmed identical wrapper x/width, placeholder text x, and left/right padding before and after focus.
- Both Warn demos were checked through focus, typing `Label Warn`, clearing, and blur; the field and label coordinates remained unchanged. The reported screenshot's whole-field shift was not reproduced in a fresh page; the grid change and explicit transition properties additionally stabilize the demo layout.
- The user later confirmed the residual drift was cached styling. Do not treat blur as an evidenced cause of that drift. The current ordinary fade uses opacity only; browser Range measurements confirmed identical glyph x/width, font size, weight, and spacing before and after focus.
