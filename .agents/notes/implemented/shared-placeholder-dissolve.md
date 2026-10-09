---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Shared placeholder dissolve

## Contract

- Ordinary text placeholders use `packages/components/base/src/placeholder-text.vue` and the shared SVG animation graph/driver with the registered dissolve module. The placeholder owns transient playback directly; do not add nested lazy controllers, duplicate the filter definition, or add Canvas renderers. `SvgDissolveFilter` / `useSvgDissolve` remain compatibility adapters for other consumers.
- Covered independent controls: Input, Textarea, Select (including multiple/search fields), Cascader, TableSelect, editable Tag, IconPicker search, and the documentation navbar search.
- DatePicker (including ranges), TimePicker, InputNumber and their composed usages inherit Input's implementation. TimeSelect inherits Select. TreeSelect inherits TableSelect. TagGroup inherits editable Tag.
- Focus/open dissolves a plain hint; an empty blurred/closed control reassembles it. Entered or selected content hides the hint immediately. Floating labels keep their existing floating behavior instead of receiving a dissolve filter.
- DatePicker and TimePicker keep their trigger hints dissolved (and floating labels raised) for the whole open-panel interaction, including uncommitted selections and focus moving into the teleported panel. A scoped input interaction context combines native focus with panel visibility; DOM containment limits that context to trigger inputs, preserving independent inputs in custom panel footers. Empty hints recover only after the panel closes and native focus leaves.
- Textarea retains multiline hints, line breaks, wrapping, native editing/IME/deferred commits, independent labels, disabled/loading behavior, and reserved loader space.
- Each playback owns a transient mutable graph and timeline, driven by the registered `dissolve` animation module. Idle placeholders and SSR emit no filter graph. Client playback IDs combine Vue's native ID and runtime instance UID to isolate separate imperative roots; no filter ID is emitted during hydration. Unmount/KeepAlive/reduced-motion handling releases the graph and timeline.
- Stable visible/hidden states retain neither a URL filter nor graph/listeners; filter rasterization is enabled only while an animation is running. Existing opacity/layout transitions must not erase the SVG animation before it completes.
- Playback is decided before the placeholder's DOM patch, mounting its graph and applying its URL together. The `padded-text` region uses the already padded wrapper at 100% width/height, avoiding the additional 300% × 600% expansion. Horizontal 38px / vertical 20px padding contains the maximum 25px / 16.5px displacement plus offset. The existing text/surface regions remain available to other consumers.
- Placeholder overlays do not intercept pointers. Native inputs keep explicit accessible names even when the decorative text is hidden.
- Shared styles belong in `theme-chalk/src/placeholder.scss`, imported by `base.scss`, so on-demand component styles and full theme builds include them. Do not rely on a component-local CSS extraction pipeline for this library primitive.
- Documentation search retains constant input width on focus so its hint does not move during dissolution.
- Programmatic IconPicker disposal runs after Vue's close update, avoiding reentrant removal of the dialog's nodes.

## Verification

- Playback/picker optimization (2026-10-09): nine focused files / 76 tests plus twelve affected-control/documentation-audit files / 105 tests passed. Final pre-patch scheduling regression subset: three files / 30 tests passed. Component typecheck, targeted ESLint and theme build passed. Tests retain zero idle graphs, first-frame start, reversal, resource release, hydration/KeepAlive and picker focus ownership, and assert the padded region's 100% bounds. Browser DOM measurements confirmed Switch label line-height 14px and the intended 0.5px optical compensation.
- Picker interaction correction (2026-10-08): six component test files / 69 tests passed, including ten regressions covering staged time edits, confirmation, empty closing, native-focus retention, date/datetime/range inputs, floating labels, siblings and independent footer inputs. Component typecheck and targeted ESLint passed. Browser verified empty DatePicker/TimePicker triggers remain at opacity 0 with no URL filter after focus moves into the time panel; an empty DatePicker recovers to opacity 1 after outside closing.
- Component regression suite: nine files, 119 tests passed. Additional final ownership/idle/hydration/API suite: three files, 27 tests passed, including the newly added cross-root isolation case.
- API tests use reduced motion for deterministic picker result/disposal checks; particle timing, reversal, independent IDs, reduced motion and hydration have dedicated tests.
- Component typecheck and targeted ESLint passed.
- Documentation source/API audit: four files, 21 tests passed. Normalization changed only the two Textarea documentation pages and their new localized examples.
- Final VuePress production build: all 201 pages, completed in 109.54s. Theme build passed.
- Browser verified multiline Textarea resting/dissolved/reassembled states, Chinese and English Code/Playground sources and previews, Select's opening dissolve, TableSelect's resting text without a URL filter, navbar search geometry, and a real programmatic IconPicker selection/close. Five simultaneously mounted filter IDs were all unique.
- Navbar search geometry before/after focus: left 1805.333px, width 240px in both states.
- Full library packaging was attempted and stopped in the unmodified Table component's Vue Macros type resolution (`Cannot resolve TS type: TableColumnOptions`). This is a remaining packaging limitation; no Table/build-configuration changes were included in this task.
