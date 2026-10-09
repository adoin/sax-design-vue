---
status: implemented
recorded_at: 2026-10-09
scope:
  - packages/components/popper
  - packages/components/tooltip
  - docs/components/popper.md
  - docs/components/tooltip.md
---

# Preferred-top automatic floating placement

- Omitted Popper and Tooltip `placement` starts at `top`; shared Popper collision handling tries `bottom`, `right`, and `left` when needed, using its existing best-fit fallback when no direction fits.
- Enabled shift recovers alignment overflow along a side before a direction change is necessary. Explicit placement retains the normal opposite-side flip behavior.
- Empty flip/shift option objects enable their middleware. `false` disables the corresponding feature; custom options override automatic defaults.
- Placement, offset, flip, and shift options are reactive. Existing shared viewport/clipping measurements, scrolling/resizing, arrow updates, and default Teleport behavior remain the positioning pipeline.
- Tooltip inherits this policy from Popper; it does not implement a second positioning layer.

## Verification

- 22 Popper tests passed, covering Tooltip inheritance, top preference, bottom/horizontal fallback, oversized panels, custom fallbacks, opt-outs, reactive placement, scroll/resize updates, alignment shifting, and existing virtual-anchor/outside-click behavior.
- Web and test TypeScript checks, targeted ESLint, and all 21 documentation checks passed.
- Browser verified the unchanged default example first above its trigger, then below it after scrolling the trigger near the top edge. Paired documentation describes omitted versus explicit placement and lists all supported directions.
