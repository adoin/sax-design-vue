---
status: implemented
kind: project-specification
updated_at: 2026-09-29
---

# Form control loading

Input, Select, Cascader, TableSelect (including the shared `$treeSelect` renderer), DatePicker, TimePicker, and TimeSelect expose `loading`.

- Use the shared `IconControlLoading` trailing indicator with a 20px box. Keep values visible and avoid a full-field overlay or blanket opacity reduction.
- Loading takes precedence over clear and dropdown/calendar/time actions. Preserve separate custom decorative affixes.
- Block value edits, clearing, tag removal, and popup opening while loading. Close an existing popup without committing draft values. Restore normal interaction when loading ends.
- Preserve `cursor: progress`, appropriate `aria-busy` state, and reduced-motion behavior inherited from LogoLoading.
- Documentation examples use the library Switch to toggle loading. Select option examples prefer `options` and `option-groups`; reserve slots for customization rather than routine option lists.
