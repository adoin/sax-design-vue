## Changelog

### Unreleased

- Fixed Brand Loading color tips collapsing and expanding during final logo restoration; each returning strand now smoothly restores its original sampling length.
- Redesigned Empty with an animated inline SVG of a completely empty open box with shared perspective geometry and synchronized one-time hinge opening, brief glowing star accents, soft paper surfaces and a replayable documentation example, theme-aware colors, an animation toggle, offscreen/hidden-page pausing and reduced-motion support. Preserved custom image URLs, image-size and illustration slots, with paired documentation examples.
- Expanded Drawer with Promise/callback close approval, delayed opening/closing, content caching and destruction, container mounting, focus management, nested push behavior, loading, and controlled pointer/keyboard resizing.
- Added scoped Drawer header, title, extra, footer, close-icon, loading, mask, and resizer slots, region styles/classes, compatibility aliases, and ten paired English/Chinese documentation examples.
- Enabled public locale imports in documentation Code/Playground previews and fixed Drawer default body mounting when no container is specified.

### 2.0.0 — 2026-09-30

#### Breaking changes and migration

- Removed `SPrompt`, `SPromptBox`, and `$prompt`. Use `SDialog` for declarative content and `SDialogBox` / `$dialog` for imperative messages and confirmations. Dialog supports `beforeConfirm` validation, custom footer callbacks, and asynchronous close approval.
- `beforeClose` now takes no arguments and must return `Promise<void>`. Resolve to approve closing; reject with a string or `Error` to retain the dialog and show the reason. Replace callback-based `done()` guards with Promise fulfillment/rejection.
- When `beforeClose` is configured, overlay clicks no longer request closing by default. Explicitly set `:mask-closable="true"` on the instance (or `maskClosable: true` in imperative options) to enable this entry; inherited defaults do not opt in.
- Dialog closes with a surface-only particle dissolve by default. Set `:close-animation="false"` to disable it, or `close-animation-duration` to customize the default 220ms duration. Imperative/global options use `closeAnimation` and `closeAnimationDuration`.

#### Features

- Added Dialog minimization, restorable dock bubbles, and optional `global` lifetime beyond owner teardown. Closing waits for validation, loading completion, and dissolution before disposal; the overlay stays unchanged during dissolution and is removed with the surface.
- Added Input-managed autocomplete suggestions, disabled native browser autocomplete by default, and introduced instance-scoped SVG placeholder dissolve/reassembly. Static SVG filter definitions can be shared through the common filter registry; animated graphs remain local to their instances.
- Added Select item renderers with search context and warm matching highlights, placeholder fallback for floating labels, and options-first documentation. Unified virtual scrolling around the height-delta index, batched dynamic row measurements, and added data-driven virtual List rendering.
- Added TableSelect multiple selection for flat and tree data, parent/child check strategies, independent checking, and selected-value tags.
- Unified loading feedback across Input, Select, Cascader, TableSelect, DatePicker, TimePicker, TimeSelect, and Textarea. Added compact four-point loading exits for Radio and Dialog close controls, with complete animation handoff before normal content returns.

#### Fixes and documentation

- Corrected fractional Rate star clipping and alignment; preserved Slider disabled behavior; fixed TimePicker loading/text overlap, Textarea surfaces, renderer button wrapping, and selected tree-row labels/structure.
- Stabilized Input text insets, hover targets and close controls; improved Switch loading outlines/exits, List presentation, example spacing, and scrollbar-track interaction feedback.
- Expanded paired documentation for flat/tree single/multiple selection, dynamic-height virtual lists, loading controls, Dialog footer/close behavior, and imperative use. Clarified dismissal labels and explicitly enumerated color/state choices in API tables; Code and Playground sources stay synchronized.
- Companion package remains `sax-design-vue-iconify@1.0.1`.

### 1.1.1

- Added shared week-start and week-number rules for DatePicker, DatePanel, and Calendar, whole-week selection, current-period styling, and date-range hover previews.
- Added native email, URL, required, and pattern validation with Input/Form integration and localized messages.
- Added directional Radio dot motion, synchronized button backgrounds, and SVG contour/fill animation.
- Refined Checkbox mixed states and square logo loading, unified close artwork, clear-icon sizing, and loading cursors.
- Improved multiple-date tags, Input surfaces, breadcrumb overflow, Tabs rendering, Table workflows, and component alignment.
- Unified documentation API structure and scoped-slot types; supplied known icons automatically to Playground.
- Compatibility: DatePicker defaults to Monday as the first weekday. Set `start-day="0"` or global `firstDayOfWeek: 0` to retain Sunday-first calendars. The standalone Sidebar component has been removed. Prefer Tabs `render-mode` over its compatibility rendering flags.
- Companion package: `sax-design-vue-iconify@1.0.1` preserves the built-in `sax:close` icon during strict Vite transforms.

### 1.0.1

- Expanded Table editing, validation, selection, grouping, and renderer workflows.
- Added shared motion tokens, reduced-motion protection, and refined component transitions.
- Improved localized documentation, examples, built-in icons, and deployment behavior.

### 1.0.0

- First stable release of Sax Design Vue.
- Includes the Vue 3 component library, theme styles, TypeScript declarations, and Iconify integration.

### 0.0.1
