---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Tag leading Avatar spacing

## Contract

- Tag owns the left inset of a leading Avatar through parent padding. An Avatar directly inside the text slot has no negative left margin.
- Normal Tags retain 10px left padding; a leading Avatar uses 2px. Mark and pill-mark retain their existing shape clearance through preset-specific parent padding values.
- Detection applies to a leading direct Avatar element. Other slot content does not trigger the compact left inset. Existing Avatar size, vertical/right spacing, Tag width, height, color and shape are preserved for the documented leading-Avatar composition.

## Verification

- Browser compared all six icon examples before/after: Avatar left margin changed from -8px to 0px, parent padding from 10px to 2px. Width, height and left inset differences were zero for every example.
- Existing Tag suite: 11 tests passed. Theme build and diff whitespace checks passed.
