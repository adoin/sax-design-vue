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
- Focus on an empty input dissolves; blur on an empty input reassembles. The original 950ms cubic ease-in-out timeline was replaced after the user reported delayed focus feedback: cubic ease-out now uses 480ms for dissolve and 650ms for reassembly, scaled to the remaining distance. Erosion starts at progress zero rather than waiting for 0.08; a representative noise sample is already partially transparent at 80ms. Reversal continues from current progress and cancels the previous callback. Complete states schedule no frames.
- Initial occupied inputs initialize fully dissolved without animation. Entering a value immediately hides the placeholder wrapper to prevent overlaying typed text. Clearing while focused leaves the prompt dissolved; clearing while blurred reassembles it. Floating labels retain the existing label animation and create no dissolve graph.
- No layout values animate. Ordinary placeholder position shares the native input's text inset; a padded inner filter target bounds the scatter without changing the glyph origin. Text truncation remains inside a content span; prefix, suffix, actions, and control size layouts retain their reserved space.
- Animation updates only local SVG attributes, with no per-frame reactive component render. Reduced-motion preference immediately settles the target; changing the preference while animating cancels the active frame. Unmount removes listeners and cancels frames, while local SVG nodes leave with their component. KeepAlive deactivation cancels animation and activation restores the current final state.
- The graph and timeline are now shared internally through `packages/components/base/src/svg-dissolve-filter.vue` and `packages/hooks/use-svg-dissolve`; the former Input composable path remains a compatibility re-export. Placeholder geometry, IDs and behavior stay as specified above. Dialog reuse follows [dialog-close-dissolve.md](dialog-close-dissolve.md).
- Paired Input docs include a localized two-input example with complete template/script/style source slots. The Configuration guide distinguishes static sharing from local mutable graphs and explains multi-app prefixes.

## Verification

### Intrinsic text raster bounds (2026-10-16)

- Shared single-line PlaceholderText uses `width: fit-content` on its padded dissolve target. Keep the existing `max-width: 100%` and inner ellipsis so long text stays bounded; multiline placeholders retain full width and their height/wrapping contract. Do not rasterize blank control width for a short prompt.
- Select's default prompt target shrank from about 228×58 to 113×58 CSS pixels in the in-app browser. One 800ms post-pointerdown trace measured Paint totals of 63ms before and 55ms after; this is a local observation, not a cross-device performance guarantee or proof that all reported stutter is resolved.
- Paint containment and temporary compositing hints did not show consistent gains during investigation and were not retained. The filter graph, timing, scatter padding, instance ownership and idle cleanup are unchanged.
- Verified Select open/close, reversal and selection in the in-app browser; existing placeholder, Select and Input motion suites passed (5 files, 52 tests).

### Temporary Select fade experiment — superseded (2026-10-16)

- The user reported that intrinsic raster bounds did not resolve perceived Select stutter. Do not treat that optimization alone as a verified Select responsiveness fix.
- The temporary experiment opted into an internal PlaceholderText `effect="fade"` path (removed by the particle-preserving revision below). It changes opacity with motion tokens and reduced-motion support; focus, open, close and search do not create SVG filter graphs or run their per-frame animation. Input and Textarea keep the established dissolve effect.
- The internal effect defaults to `dissolve`; `fade` is an explicit semantic mode. Preserve occupied-placeholder hiding and floating-label behavior independently from the effect.
- One same-page 800ms post-pointerdown trace measured 126 Paint events / 60ms with dissolve and 82 / 51ms with fade. This is a local sample, not a guarantee that all user-reported stutter has been reproduced or eliminated.
- Verification: Select, Input dissolve and Textarea suites passed (5 files, 58 tests), including a new Select regression that focuses, opens, closes and blurs without creating a filter. Web component typecheck passed. In-app browser confirmed selection, search and multiple selection with no filter graphs.

- Focus timing refinement: 28 placeholder/Input behavior tests passed. A new regression checks that the mask for a representative noise value is partially transparent by 80ms while final alpha remains one. Chromium sampling at 86ms measured mask alpha 0.373; the animation reached final alpha zero after completion while the sibling filter remained unchanged.
- 40 Input and Input-motion tests passed, including eight new animation tests for endpoints, reversal, independent IDs/graphs, unmount cleanup, live reduced-motion preference changes, occupied/float behavior, SSR hydration, and KeepAlive deactivation/reactivation.
- 21 documentation example checks and web/Vitest type checks passed. Theme compilation passed.
- Browser: one focused input reached threshold intercept -13, displacement 26, and final alpha zero while the sibling retained intercept one, displacement zero, and alpha one. Text x positions and native left padding stayed stable. Both localized Code dialogs exposed complete SFC blocks and both Playground previews rendered the matching localized controls. The active document with its Playground contained no duplicate placeholder filter IDs.

### Select particle-preserving scheduling and faster popup (2026-10-16)

- The user confirmed fade removed the stutter but explicitly requested retaining particles, then asked to speed up dropdown opening. The fade experiment is superseded; Select again uses the original two-octave noise, erosion and scatter graph.
- Select requests deferred startup: two requestAnimationFrame callbacks give the popup a paint opportunity before mounting the SVG graph. Keep ordinary text visible during this pending period; reversing, hiding, deactivating or unmounting cancels pending frames without a flash. Other placeholder consumers remain immediate by default.
- Select dissolution uses 240ms and reassembly 300ms; Input/Textarea retain their existing default durations. Popup enter transform uses the shared quick 150ms token instead of 250ms, with enter opacity also 150ms.
- Web component typecheck passed. The directly affected Select enhancement suite passed 35 tests and Input placeholder suite passed 10 tests, including deferred playback and cancellation. A broader concurrent run failed from host native-memory exhaustion, so do not report it as a passing full suite or claim a reliable new performance comparison from this run.
