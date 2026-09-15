---
status: implemented
kind: project-specification
created_at: 2026-09-14
completed_at: 2026-09-14
modules:
  - packages/components/anchor
  - packages/theme-chalk/src/anchor.scss
supersedes: []
---

# Route-boundary progress parity

## Contract

Previous- and next-route boundaries expose the same visible circular progress feedback around their arrow. The inactive ring remains perceptible as soon as either boundary appears, and the active arc represents the accessible `aria-valuenow` progress without changing navigation thresholds or gesture arming.

Both directions share one SVG ring geometry and animation. Only the arrow rotates for the previous direction; the ring always begins at twelve o'clock and completes clockwise. Horizontal progress rules are prohibited because edge placement and rasterization can make equal CSS line heights appear unequal.

The ring uses normalized SVG path length. Progress maps to `stroke-dashoffset` from 1 to 0, and reduced-motion mode removes the transition without hiding the current value. Ring size and stroke width are controlled by `--s-anchor-route-progress-size` and `--s-anchor-route-progress-stroke-width` on the Anchor root.

Wheel navigation waits for the value circle's `stroke-dashoffset` transition to complete after progress reaches 100%. The boundary holds the pending wheel event during that final arc, cancels it if visibility or scroll ownership changes, and uses a bounded fallback when the platform does not dispatch `transitionend`. Direct link activation remains immediate.

## Implementation

- The boundary link selector includes its owning route-boundary element, restoring the component's flex layout against more general consumer `a` rules.
- The route-boundary progress element is a fixed-size inline grid containing the SVG track, SVG value arc and centered arrow.
- Track and value circles share `cx`, `cy`, `r`, `pathLength` and CSS-controlled stroke width. The value arc alone animates.
- The edge emits progress completion from the SVG value circle. The boundary owns pending navigation, cancellation and the no-transition fallback.
- Both rendered directions retain their progressbar semantics even at zero progress.

## Verification

- `pnpm exec vitest run packages/components/anchor/__tests__/anchor.test.ts --pool=threads --maxWorkers=1` — 1 file and 9 tests passed; both direction progressbars render with zero-valued accessible state, pending wheel navigation does not emit at 100% before SVG transition completion, and nested scrolling cancels accumulated progress.
- `pnpm run build:theme` — passed.
- `pnpm exec eslint packages/components/anchor/__tests__/anchor.test.ts --no-cache` — passed.
- `pnpm run typecheck:web` — passed.
- `pnpm run docs:build` — passed; 201 pages rendered.
- Headless Chrome on the Chinese Table hierarchy guide confirmed that no horizontal progress track remains. Both directions render the same circular SVG geometry around the arrow and map 0%, 50% and 100% progress to dash offsets 1, 0.5 and 0. During real route navigation, the path remained on the current guide while the final arc was still at dash offset `0.29125`; it changed only after SVG transition completion.
