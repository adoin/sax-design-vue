---
status: implemented
kind: project-specification
updated_at: 2026-09-09
completed_at: 2026-09-09
modules:
  - packages/components/icon
  - packages/components/loading
  - packages/components/button
  - packages/components/notification
  - packages/components/radio
  - packages/components/steps
  - packages/components/switch
  - packages/components/table
---

# Sax logo loading

## Contract

`SLogoLoading` is the shared SVG loading indicator. It uses the Sax mark geometry and four motion phases: idle, starting, running, and stopping. The implementation must remain SVG based and must not require Canvas. Multiple instances share one animation-frame scheduler, server rendering emits the resting mark, and reduced-motion mode renders a static ring.

The public component supports `active`, `size`, `speed`, `reducedMotion`, and `label`. Its default speed is `2.5`. Setting `active` to false restores the mark before returning to idle; exposed methods support explicit start, stop, and reset control.

`IconLoading` is the internal compatibility wrapper used by component loading states. Existing components that use their default loading indication resolve to the shared Sax loader. `SLoading` changes only its `default` type to this loader; explicitly selected named animations such as `atom`, `ball`, `waves`, `border`, `points`, `square`, `circles`, `corners`, `gradient`, `rectangle`, and `square-rotate` keep their original visuals.

The Button default loading state centers the Sax loader in a transparent overlay. It keeps the original label visible, adds no white disk or opaque background, preserves the button footprint, and blocks interaction. Explicit `pulse`, `ripple`, and `shimmer` button loading styles and the `loading` slot remain available.

Skeletons, progress indicators, and motion unrelated to a loading state are outside this replacement contract.

## Verification

- SVG rendering, state transitions, reduced motion, and the internal wrapper pass the logo-loading tests; no Canvas element is rendered.
- The affected component test suite passes: 83 files and 770 tests. The final Button and logo-loading focused suite passes: 2 files and 12 tests.
- Documentation example checks pass: 2 files and 9 tests.
- Web type checking, the complete package build, generated declarations, and the 173-page VuePress build pass.
