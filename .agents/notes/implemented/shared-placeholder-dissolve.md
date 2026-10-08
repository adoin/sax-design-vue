---
status: implemented
kind: project-specification
updated_at: 2026-10-08
---

# Shared placeholder dissolve

## Contract

- Ordinary text placeholders use `packages/components/base/src/placeholder-text.vue` and the existing `SvgDissolveFilter` / `useSvgDissolve` timeline. Do not duplicate the filter graph or add Canvas renderers.
- Covered independent controls: Input, Textarea, Select (including multiple/search fields), Cascader, TableSelect, editable Tag, IconPicker search, and the documentation navbar search.
- DatePicker (including ranges), TimePicker, InputNumber and their composed usages inherit Input's implementation. TimeSelect inherits Select. TreeSelect inherits TableSelect. TagGroup inherits editable Tag.
- Focus/open dissolves a plain hint; an empty blurred/closed control reassembles it. Entered or selected content hides the hint immediately. Floating labels keep their existing floating behavior instead of receiving a dissolve filter.
- Textarea retains multiline hints, line breaks, wrapping, native editing/IME/deferred commits, independent labels, disabled/loading behavior, and reserved loader space.
- Each playback owns a transient mutable graph and timeline, driven by the registered `dissolve` animation module. Idle placeholders and SSR emit no filter graph. Client playback IDs combine Vue's native ID and runtime instance UID to isolate separate imperative roots; no filter ID is emitted during hydration. Unmount/KeepAlive/reduced-motion handling releases the graph and timeline.
- Stable visible/hidden states retain neither a URL filter nor graph/listeners; filter rasterization is enabled only while an animation is running. Existing opacity/layout transitions must not erase the SVG animation before it completes.
- Placeholder overlays do not intercept pointers. Native inputs keep explicit accessible names even when the decorative text is hidden.
- Shared styles belong in `theme-chalk/src/placeholder.scss`, imported by `base.scss`, so on-demand component styles and full theme builds include them. Do not rely on a component-local CSS extraction pipeline for this library primitive.
- Documentation search retains constant input width on focus so its hint does not move during dissolution.
- Programmatic IconPicker disposal runs after Vue's close update, avoiding reentrant removal of the dialog's nodes.

## Verification

- Component regression suite: nine files, 119 tests passed. Additional final ownership/idle/hydration/API suite: three files, 27 tests passed, including the newly added cross-root isolation case.
- API tests use reduced motion for deterministic picker result/disposal checks; particle timing, reversal, independent IDs, reduced motion and hydration have dedicated tests.
- Component typecheck and targeted ESLint passed.
- Documentation source/API audit: four files, 21 tests passed. Normalization changed only the two Textarea documentation pages and their new localized examples.
- Final VuePress production build: all 201 pages, completed in 109.54s. Theme build passed.
- Browser verified multiline Textarea resting/dissolved/reassembled states, Chinese and English Code/Playground sources and previews, Select's opening dissolve, TableSelect's resting text without a URL filter, navbar search geometry, and a real programmatic IconPicker selection/close. Five simultaneously mounted filter IDs were all unique.
- Navbar search geometry before/after focus: left 1805.333px, width 240px in both states.
- Full library packaging was attempted and stopped in the unmodified Table component's Vue Macros type resolution (`Cannot resolve TS type: TableColumnOptions`). This is a remaining packaging limitation; no Table/build-configuration changes were included in this task.
