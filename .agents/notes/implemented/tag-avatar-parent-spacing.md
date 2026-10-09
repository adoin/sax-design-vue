---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Tag leading Avatar spacing

## Contract

- Tag owns the left and vertical inset of a leading Avatar through parent padding. Avatar margins inside Tag are zero on all four sides; the text container owns the horizontal content gap.
- Normal Tags retain 10px left padding; a leading Avatar defaults to 4px. Mark and pill-mark retain their existing shape clearance through preset-specific parent padding values.
- Ordinary Tag has zero default external margin. Group/row spacing belongs to the parent container's gap. Existing preset-specific geometry clearance is separate from ordinary spacing.
- Detection applies to a leading direct Avatar element. Other slot content does not trigger the compact left inset. The parent adds 2px to each vertical padding and 4px to the text gap, preserving the documented leading-Avatar composition's existing spacing without child margins. Small/default/large retain their base vertical padding through a shared variable.

## Verification

- Browser compared all six icon examples before/after: Avatar left margin changed from -8px to 0px, parent padding from 10px to 2px. Width, height and left inset differences were zero for every example.
- Existing Tag suite: 11 tests passed. Theme build and diff whitespace checks passed.
- Full margin removal: all six examples report margin 0px, content gap 9.6px instead of 5.6px, and unchanged width, height, left inset (2px) and top inset (5px). Normal Tag padding remains 3px 10px and content gap remains 5.6px.
- Current default adjustment: all six icon examples report Tag margin 0px and Avatar left inset 4px. Each border-box width increases by 2px; height remains 34px. Parent gap is the sole source of ordinary inter-Tag spacing.
