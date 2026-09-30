---
status: implemented
kind: project-specification
completed_at: 2026-09-30
modules:
  - packages/components/input/src/input-placeholder.vue
  - packages/components/input/src/composables/use-placeholder-dissolve.ts
  - packages/theme-chalk/src/input.scss
  - docs/components/input.md
  - docs/zh/components/input.md
---

# Input placeholder dissolve and reassembly

## User request

> 我按我想象的例子消散做成了demo，你参考里面的消散和聚合动画还有稳定态做一下placeholder，但是这种动态的svgFilter不好作为注册管理工具去复用吧 因为要改svgFilter里面的值，用同一个id的话其他的组件就会一起变化了。这种情况应该还是要内部消化，生成一个伴随组件周期的临时id（如果可以，vue是否有适合当实例id的东西提供来拼接？）

Reference: `svg-dom-dissolve-toggle-v5.html`, supplied by the user.

## Contract

- Ordinary SInput placeholders use the supplied fractal-noise graph: RGB average mapped into alpha, linear threshold, SourceGraphic composite, displacement, offset, and final alpha cleanup. The complete state keeps the filter installed, a fully white mask, zero displacement/offset, and final alpha one. The dissolved state has final alpha exactly zero.
- Every InputPlaceholder owns its mutable SVG nodes and requestAnimationFrame timeline. It uses native Vue `useId()` in setup with a semantic prefix. IDs are stable during SSR hydration and distinct within an application. Multiple applications in one document must use different `app.config.idPrefix` values on server and client, as documented. The static global filter registry is not used for this graph.
- Focus on an empty input dissolves; blur on an empty input reassembles. The supplied 950ms cubic ease-in-out timeline scales duration to the remaining distance. Reversal continues from current progress and cancels the previous callback. Complete states schedule no frames.
- Initial occupied inputs initialize fully dissolved without animation. Entering a value immediately hides the placeholder wrapper to prevent overlaying typed text. Clearing while focused leaves the prompt dissolved; clearing while blurred reassembles it. Floating labels retain the existing label animation and create no dissolve graph.
- No layout values animate. Ordinary placeholder position shares the native input's text inset; a padded inner filter target bounds the scatter without changing the glyph origin. Text truncation remains inside a content span; prefix, suffix, actions, and control size layouts retain their reserved space.
- Animation updates only local SVG attributes, with no per-frame reactive component render. Reduced-motion preference immediately settles the target; changing the preference while animating cancels the active frame. Unmount removes listeners and cancels frames, while local SVG nodes leave with their component. KeepAlive deactivation cancels animation and activation restores the current final state.
- Paired Input docs include a localized two-input example with complete template/script/style source slots. The Configuration guide distinguishes static sharing from local mutable graphs and explains multi-app prefixes.

## Verification

- 40 Input and Input-motion tests passed, including eight new animation tests for endpoints, reversal, independent IDs/graphs, unmount cleanup, live reduced-motion preference changes, occupied/float behavior, SSR hydration, and KeepAlive deactivation/reactivation.
- 21 documentation example checks and web/Vitest type checks passed. Theme compilation passed.
- Browser: one focused input reached threshold intercept -13, displacement 26, and final alpha zero while the sibling retained intercept one, displacement zero, and alpha one. Text x positions and native left padding stayed stable. Both localized Code dialogs exposed complete SFC blocks and both Playground previews rendered the matching localized controls. The active document with its Playground contained no duplicate placeholder filter IDs.
