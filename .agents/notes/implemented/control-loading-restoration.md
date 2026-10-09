---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Compact control loading restoration

## Contract

- Compact loading feedback plays its introduction on activation. Deactivation requests stopping; an unfinished introduction completes before stopping begins. The normal control content returns only after the complete exit and its final empty SVG paint have finished.
- Input, Select, Textarea, Cascader and TableSelect retain their compact loading DOM, aria-busy, reserved action space and interaction guards through restoration. They pass the actual loading request into IconControlLoading while useControlLoading owns the retained presentation state.
- IconControlLoading delegates to SLogoLoading with the corners exit: strands clear at four boundaries instead of restoring a logo before the normal suffix. Shape follows the resolved control geometry. The existing default SLogoLoading restoration variant remains available.
- DatePicker and TimePicker keep the calendar/clock suffix, clearing actions and popup interaction suppressed until all ending child loaders finish. Their child completion scope is represented in an ancestor scope, so a containing Dialog also waits for nested picker restoration.
- Re-entering loading cancels stale parent completion updates and preserves the live loader. Teardown resolves pending loader waiters and unregisters completion participants. Reduced motion and hidden-page behavior remain owned by SLogoLoading.
- No artificial timers or repeated introductions are used to delay completion. The animation's restored event and shared loading-completion scope determine release.

## Verification

- Initial focused controls/loader/picker suite: seven files, 63 tests passed. Affected controls, existing Checkbox/Radio/Switch/Dialog behavior and full documentation source/API audit: twenty-four files, 235 tests passed. Final nested completion regression/Dialog subset: four files, 53 tests passed. Suites overlap; counts are separate runs.
- Five independent control cases cover retained loaders, busy/disabled state, shape, corners behavior, reactivation and release. Real DatePicker range and TimePicker timelines cover introduction completion after early deactivation, stopping, at least two empty paint frames, suffix restoration and completion visibility to an ancestor scope.
- Component typecheck and targeted ESLint passed. Test typecheck also prompted an explicit HTMLInputElement query type in the pre-existing time-panel focus regression.
- In the actual Input loading example, deactivation retained the loader, disabled input and aria-busy through the final idle/empty paint state; after restoration the loader disappeared and interaction was released.
