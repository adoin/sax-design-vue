---
status: implemented
kind: project-specification
updated_at: 2026-10-16
completed_at: 2026-10-16
modules:
  - packages/components/popper
---

# Popper layer allocation belongs to the requesting instance

## User report

> 我仔细描述一下卡顿，例子溶解动画突然停在某一帧一段时间，并且弹出层等他不卡了才出现。

## Contract

- The global z-index allocator remains shared, but each Popper stores the number returned by its own `nextZIndex()` request in a local ref. Its rendered layer must not depend continuously on the global `currentZIndex` computed value.
- Opening or raising one Popper must not change sibling layers or invalidate every mounted persistent popup. Raising an older popup gives only that popup a newer layer.
- An explicit `zIndex` prop retains priority and does not allocate a new global layer during updates. Position updates requested without a layer update preserve the local layer.
- Do not remove Select's particle animation as a substitute for fixing cross-instance invalidation. The user's frame-freeze report is distinct from a preference for shorter CSS transitions.

## Evidence and verification

- Before the change, Popper's rendered zIndex read the shared allocator directly. CPU profiling on the Select documentation showed batches of Vue property updates during a single opening.
- In-app browser after the change: 43 mounted Poppers, only the requesting popup's layer changed. One CPU-profile comparison measured self-sampled `setFullProps`, `updateProps` and `validateProps` time at about 62ms before and 3.5ms after. These samples establish reduced unrelated update work, not a cross-device guarantee that every reported freeze is eliminated.
- Popper regression suites: 2 files, 24 tests passed, including sibling layer stability, raising an earlier instance and explicit zIndex priority. Existing placement, focus, outside-click and virtual-anchor checks passed.

## Library-wide follow-up audit

- Scanned all `useZIndex`, `currentZIndex`, `nextZIndex` references and 30 Popper-related Vue source files across 22 component directories (including Popper itself). Direct users and wrappers include Select, Tooltip/Popconfirm, Cascader, Date/Time/Color Picker, Menu, Context Menu, Table/Table Select, Input autocomplete, Tabs, Breadcrumb and Agent-related tools.
- Notification had the same continuous global-layer style dependency. It now retains a local layer, raises only when explicitly opened, and no longer allocates twice during open plus transition entry. Loading allocates and retains its layer on creation.
- Table Find's nested tooltips previously derived explicit layer props from the global current layer. They now let their internal Popper allocate a fresh layer when shown, avoiding reactive invalidation of every mounted tooltip and still opening above the parent panel.
- Dialog, Dialog Surface and Drawer already retained locally allocated layers; no replacement was needed. Remaining component reads of `currentZIndex` initialize local state only, never continuously drive rendered styles.
- Popper explicitly stops its outside-click listener when unmounted while open. Keep the open/close listener lifecycle and explicit unmount cleanup together; persistent hidden content must not retain an active outside-click listener.
- Added mixed Notification/Loading regressions with 50 unrelated allocations, explicit Notification reopen layer isolation, and open-Popper outside-listener removal. Related component suites passed: 24 files, 306 tests; the outside-listener file was rerun separately after its final edit (12 tests passed).
- Component web typecheck passed after the audit changes.
