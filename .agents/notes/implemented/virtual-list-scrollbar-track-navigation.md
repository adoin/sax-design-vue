---
status: implemented
kind: project-specification
created_at: 2026-09-11
completed_at: 2026-09-11
modules:
  - packages/components/virtual-list
  - packages/components/table
supersedes: []
---

# Virtual-list scrollbar track navigation

## Contract

Clicking an empty point on an `SVirtualList` native scrollbar track immediately maps the centered thumb position to that point across the complete physical scroll range. Compressed sparse virtualization then maps the physical offset to the corresponding logical row offset, so very large `STable` datasets update on the same click without requiring a held pointer or follow-up movement.

Pressing the current thumb remains a native drag. During that gesture, dynamic row measurements may continue but must not write corrective scroll positions or change track geometry until release. Vertical and horizontal tracks share the behavior.

Scrollbar hit testing supports reserved native gutters, CSS-scaled elements, left-side vertical scrollbars, and Chromium-style overlay scrollbars that do not reduce `clientWidth` or `clientHeight`. The bottom scrollbar corner does not navigate either axis.

`--s-vl-scrollbar-track-inset` reserves transparent space at both ends of each native track. Standalone VirtualList defaults to zero; rounded Table viewports set 4px so horizontal and vertical thumbs do not enter clipped corners. Thumb geometry and direct track navigation use the same computed inset, and clicks in the reserved end space do not navigate.

## Implementation

- `packages/components/virtual-list/src/use-scrollbar-drag.ts` distinguishes the current thumb from empty track space, prevents the native page-step only for track clicks, and writes the proportional physical offset immediately.
- The existing `useSparseVirtualizer` remains the sole physical-to-logical mapping layer. Table does not duplicate scrollbar logic.

## Verification

- `pnpm exec vitest run packages/components/virtual-list/__tests__` — 3 files and 27 tests passed, including inset-aware vertical and horizontal track jumps, rounded-end hit testing, overlay-scrollbar hit testing, native thumb dragging, measurement locking, and sparse mapping.
- `pnpm exec vitest run packages/components/table/__tests__` — 62 files and 643 tests passed.
- `pnpm exec eslint packages/components/virtual-list/src/use-scrollbar-drag.ts packages/components/virtual-list/__tests__/scrollbar-drag.test.ts` — passed.
- `pnpm run typecheck:web` — passed.
- Headless Chrome against the local documentation verified an ordinary virtual table changing its first rendered index from 0 to 6557 after one 65%-track click, and the million-row example changing to index 817083 after one 80%-track click. A current-thumb press remained unprevented, entered the measurement lock, and restored normal layout on mouse release.
