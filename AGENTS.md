# Project Rules

## Documentation examples

- Write public documentation for developers using the library: explain APIs, behavior, and usage choices. Keep task instructions, implementation constraints, conversation history, and verification reports in internal records rather than example descriptions or demo copy.

- When a documentation example needs controls or supporting UI beyond the component being documented, prefer existing components from this repository instead of rebuilding them with custom HTML and CSS. Only create a custom control when no suitable repository component exists, and briefly document why.
- Keep each example's heading, explanatory copy, notes, controls, and rendered demo inside the same `<card>` block. Only the page title, frontmatter summary, and generated API reference may sit outside example cards.
- Do not add large fixed or minimum heights to documentation demos just to reserve room for a teleported popper, dialog, or other overlay. Overlay components must layer over the page while the closed demo stays content-sized.
- Treat the rendered example, the **Code** dialog, and **Playground** as one feature. Whenever an example component changes, update and verify both English and Chinese documentation source slots so Code and Playground stay synchronized with the rendered demo.
- Localize example-facing copy together with the page copy. When an example contains visible text, labels, alternative text, or accessibility names, give each documentation locale a matching localized example source so the rendered demo, Code dialog, and Playground never expose the other locale by default.
- Open an example Playground in the shared large in-page dialog by default. Keep the standalone example-playground route as a thin wrapper around the same workspace for direct links; do not duplicate the editor/preview implementation or return the normal example action to a route-only flow. Preserve focus trapping/restoration, Escape closing, body scroll locking, and the responsive editor/preview layout when changing this pipeline.
- Every example with `<template #example>` must also provide source slots for Code and Playground. Those slots must reconstruct a complete, valid Vue SFC: reference the full top-level `<template>`, `<script>` / `<script setup>`, and `<style>` blocks that exist in the example file; never use a partial line range that cuts a block, tag, type declaration, import, or style rule.
- Keep a blank line before and after every `@[code...]` include inside a source slot. VuePress requires this spacing to render the include; without it, the page exposes the directive as literal text and Code receives an empty source.
- Keep every `PROPS`, `CHILD_PROPS`, `EVENTS`, `SLOTS`, and `EXPOSES` API entry on its own row. Never combine names with `/`; each row must carry the type, values, description, default, and usage link for that one entry.
- Represent an API entry with no default as `default: null` or omit the field. Do not use `-` or `—` in metadata; the API table owns the single visual placeholder.
- Prefer running `pnpm run normalize:doc-examples` after adding, moving, or substantially editing examples. Review the resulting line-range changes rather than maintaining fragile ranges by hand.
- Before completing any component-documentation change, run `pnpm run test:docs-examples`. For changes to the shared Code or Playground pipeline, also run `pnpm run docs:build` and verify the changed example through both the Code button and the Playground button in the browser. Cross-cutting source or compiler changes require the full component-example audit, not a sample-only check.

## Table architecture

- Use `v-model:row` for the table's selected row or row array. Keep selection effects distinct from the header surface; prefer a contained shadow treatment over a primary-colored row background.

- Hierarchical data belongs to `STable`; do not reintroduce standalone `STree` or `STreeSelect` components. `STableSelect` must reuse the table tree-data mode so expansion behavior and accessibility stay aligned.
- `STable` is data-driven only. Its canonical APIs are Grid-style `data + columns` configuration and declarative `STableColumn` children; do not reintroduce public `STr`, `STd`, or `STh` components or handwritten row/cell examples.
- Keep `STableColumn` renderless and registered through the parent table. A configured `columns` array takes precedence when both declaration styles are present, and both styles must share the same cell-rendering pipeline.
- Keep column sizing aligned with VXE-style allocation: `width` columns reserve a fixed track; columns without `width` start from `minWidth` (120px by default) and receive equal shares of any remaining width. Preserve the summed minimum width and horizontal scrolling when the container is narrower.
- Preserve the data-cell rendering precedence: column-specific slot, generic cell slot, column render function or named renderer, then raw field value.
- Tree rows must be flattened from the current expansion state before virtualization. Do not mutate consumer row data when loading children; keep lazy results internal and emit them for optional persistence.
- Virtual table changes must support measured dynamic heights, stable row keys, row and column overscan, keyboard-accessible expand controls, and the exposed `scrollToRow` / `scrollToColumn` / `measure` methods. Keep Y-axis row virtualization and X-axis column virtualization independently configurable; verify normal rows, lazy tree expansion, two-axis large virtual data, Code, and Playground together.
- `STableSelect` must remain a thin selector shell over `STable`, forwarding columns, tree configuration, renderers, cell/header slots, and `virtualConfig`. Large-data examples must verify that a bounded popup renders only the visible row window rather than mounting every row.

## Overlay architecture

- Dropdowns, pickers, menus, tooltips, and other floating panels must reuse the shared `SPopper` layer. Keep Teleport enabled by default so cards, scroll containers, transforms, and stacking contexts cannot clip the panel; do not solve clipping by changing documentation-card overflow.
- Let `SPopper` own floating positioning, viewport flipping and shifting, z-index, scroll or resize tracking, and outside-click closing. Do not add a second absolute-positioning implementation or a component-level document listener for the same behavior.

## Form control parity

- Select-like controls should share the repository's control-surface shadow, focus treatment, block and square layouts, semantic color or state handling, loading feedback, and popup configuration whenever those capabilities make sense for the control's data model.
- Keep decorative prefix and suffix content separate from reserved actions. A custom suffix must not remove the clear action, loading indicator, or dropdown affordance unless the public API explicitly requests that replacement.
- Components that expose `shape` must resolve it through the shared shape hook so precedence stays component prop, local fallback, global `SConfigProvider` or install option, then `rounded`. Forward the resolved shape to internal controls and teleported popups; a square trigger must not open a rounded panel.
- Use `variant` for visual treatments and `shape` for geometry. The canonical square API is `shape="square"`; do not add new `square`, `round`, or similarly named Boolean geometry props. Existing Boolean props may remain only as documented compatibility aliases.
- Give `shape` its own documentation example instead of mixing it into default, border, shadow, color, or state examples. Keep rounded and square examples side by side so geometry can be reviewed independently from variants.

## Tag architecture

- `STag` is the single compact-label component. Do not reintroduce `SChip`, a second Tag implementation, or Chip-named public APIs, styles, examples, and navigation entries.
- Use `STagGroup` for editable collections of tags. Select-like controls must call their selected values tags (`collapseTags`, `maxCollapseTags`, and tag-related elements) so public terminology stays consistent.
- Keep Tag visual treatment in `variant` and geometry in `shape`; preserve semantic `status`, custom `color`, disabled behavior, and closable interaction when extending the component.

## Card architecture

- Card presets use stable semantic names: `classic`, `overlay`, `split`, `frosted`, `reveal`, `profile`, `metric`, and `article`. Preserve `classic` as the default; numeric values 1-5 are compatibility aliases only and must map to the first five names without rendering numeric CSS classes.
- Never rename, renumber, demote, or silently restyle an established named preset. New presets must represent a complete content pattern with its own layout and information hierarchy, not a minor shadow, border, color, or radius variation.
- Add `variant`, `orientation`, `hover-effect`, `shape`, and interaction state as explicit opt-in extensions. An existing Card that does not pass an extension prop must retain its previous classes, DOM structure, layout, and hover behavior.
- Keep all named preset examples first and in the canonical order above in both documentation locales. Place extension examples afterward and explain them as additional capabilities, not replacements for `type`.
- Add `interactive` only when the whole surface performs an action, and keep its keyboard focus and Enter/Space behavior aligned with button semantics.
- Use `selectable` with the controlled `v-model:selected` contract and `aria-pressed`; loading cards must preserve their footprint, expose `aria-busy`, and block interaction.
- Preserve `img` and `buttons` as the established preset slots and their direct DOM wrappers. `media` and `actions` are extended-layout slots, not replacements. Every Card example must be verified in the rendered example, Code dialog, and Playground in both languages.

## Image preview architecture

- Keep zoom, rotation, fit/original sizing, reset, navigation, and magnified-image panning in `SImagePreview`; documentation examples may provide image data and triggers but must not fake viewer behavior locally.
- Recalculate fit scale from the rotated image bounds after every quarter turn. Reset transform state when the active URL changes so scale, rotation, and offsets never leak across images.
- Preserve visible toolbar alternatives for gesture behavior, localized accessible labels, keyboard navigation and transform shortcuts, focus containment/restoration, Escape closing, and body scroll locking.
- Throttle high-frequency pointer panning to animation frames, keep transform animation reduced-motion aware, and preserve 44px minimum icon-button targets with visible focus and disabled states.
- Treat `SImage`, rendered Image Preview examples, the Code dialog, and Playground as one integration surface. Verify single-image navigation visibility, multi-image switching, rotated fit, zoom limits, panning, reset, and both documentation locales together.

## Image architecture

- `SImage` must render a semantic native `img`; do not replace the primary image with a CSS background. Forward responsive native attributes such as `srcset` and `sizes`, preserve meaningful `alt` text, and keep preview-enabled items operable by both pointer and keyboard.
- Keep source dimensions independent from the display box. Apply `fit` through native `object-fit`, apply focal alignment through `object-position`, and reserve layout space with an explicit width, height, or aspect ratio so loading does not shift surrounding content.
- Preserve the built-in loading skeleton, failed-image state, and their customization slots when changing image rendering. Loading animation must honor reduced-motion preferences, and image load/error events must continue to reflect the primary source image.
- Demonstrate non-matching source and container ratios in the dedicated fit example. Keep every supported fit mode, focal-position behavior, lazy loading, localized alternative text, Code, and Playground synchronized in both documentation locales.

## Upload architecture

- Keep `SUpload.pick` and the named `pickUploadFiles` export as the canonical Promise-based file picker. It selects files without mounting Vue UI; cancellation resolves `undefined`, validation rejects with `UploadPickError`, and `multiple` or `directory` returns `File[]`.
- The Promise picker owns only native selection and pre-queue validation. Do not silently perform a network request there or duplicate the component's visible queue; callers upload the returned files themselves, while `SUpload` remains the choice for progress, removal, retry, and other visible workflow states.
- Always remove the Promise picker's temporary input and listeners after selection, cancellation, rejection, or abort. Preserve SSR-safe rejection, `AbortSignal` support, and the native `cancel` event with the window-focus fallback.
- Treat file picking and drag-and-drop as two entry points into one validation and queue pipeline. Apply `accept`, image mode, size, count, and `beforeSelectMethod` consistently before a file enters the queue; never rely on the native picker filter alone.
- Keep raw consumer `File` objects in the controlled `v-model` contract while storing preview, progress, response, error, and lifecycle state in internal `UploadFileItem` records. External model updates must synchronize without discarding the status of unchanged internal items during normal emitted updates.
- Preserve explicit `ready`, `uploading`, `success`, and `error` states. Failed items stay in the queue and remain individually retryable; progress callbacks must be clamped to 0–100 and represented with accessible progress semantics.
- Keep upload orchestration in `SUpload`, file validation and collection state in `useUploadFiles`, and queue presentation in `UploadFileList`. Do not duplicate selection, removal, or validation rules inside documentation examples.
- Keep the upload surface keyboard operable, provide accessible names for icon-only actions, announce validation and upload outcomes through localized live regions, and never communicate success or failure by color alone.
- Apply `shape` to the dropzone, queue, previews, and actions together. Keep `listType` responsible only for queue presentation and `previewFit` responsible only for image fitting; neither may change validation or request behavior.
- Verify picker selection, drag-and-drop rejection, count and size limits, manual and automatic requests, progress, failure retry, removal guards, controlled values, image cards, both shapes, and every localized Code and Playground example together.
