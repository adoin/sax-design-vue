---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Progress fill textures

## Contract

- `texture` supports `default`, `bubbles`, `waves` and `sparkle`; default preserves the plain fill. `textureAnimated`, `textureDuration` and `textureOpacity` configure decorative playback independently of progress values.
- Texture is clipped to the determinate fill or indeterminate segment. It does not decorate the unfinished track, capture pointer input or add accessibility content.
- Bubble appearance follows the carman popup.png principle: a shared 110 × 64 translucent microbubble tile over a semantic-colored fill, moving vertically. Deterministic SVG microbubble resources replace external image requests.
- Sea waves use native SVG path morphing through lift, curl, downward break and spread. A cyclic Catmull–Rom control curve is sampled into 49 continuous morph values. Adjacent waves are offset by half a cycle. After landing, controls unfold into a single-valued surface without a reverse-folded lip.
- Sparkle uses independent phased brightness, scale and ray expansion. It does not move the whole pattern horizontally. Inline SVG pattern/gradient identifiers are unique through the shared ID context.
- Actual rendered height drives proportional scaling of both axes, including CSS length heights and later resize. Bubble resources use a 32px reference; sea/sparkle patterns use their 40-unit logical height. The controls example compares 5/8/16/32px.
- CSS owns bubble/sparkle animation; native SVG owns wave interpolation. Vue only updates settings and visibility/lifecycle gates. Offscreen, hidden-document, deactivated and reduced-motion states pause playback; determinate completion also pauses. No per-frame Vue updates or SVG filters are used.
- Default plain fills allocate no new texture observers or nodes. Active textured progress owns resize/playback observers and releases them on teardown or when no longer required. Zero opacity/duration and explicit animation opt-out keep decoration static.
- Height accepts CSS lengths, custom colors consume complete color tokens, and percentage values are clamped to 0–100 with accessible native progressbar semantics. Existing tooltip content remains supported.

## Verification

- 14 component tests passed: plain defaults, each texture, native pattern isolation and phase timing, actual-height scaling, seamless wave loop/alternating phases/unfolded landing, clipping/indeterminate ownership, settings, visibility cleanup, reduced motion, color/height normalization and SSR.
- Documentation example/API audit: 21 tests passed. Web/Vitest type checks, component/example ESLint and theme build passed.
- Browser: compared original PNG and SVG on the same base color; observed independent star phases, native wave morphs, 5px proportional scales, static mode and endpoint pause/removal. Paired documentation examples reconstruct full Code and Playground SFCs.
