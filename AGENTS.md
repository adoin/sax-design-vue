# Project Rules

## Documentation examples

- When a documentation example needs controls or supporting UI beyond the component being documented, prefer existing components from this repository instead of rebuilding them with custom HTML and CSS. Only create a custom control when no suitable repository component exists, and briefly document why.
- Keep each example's heading, explanatory copy, notes, controls, and rendered demo inside the same `<card>` block. Only the page title, frontmatter summary, and generated API reference may sit outside example cards.
- Do not add large fixed or minimum heights to documentation demos just to reserve room for a teleported popper, dialog, or other overlay. Overlay components must layer over the page while the closed demo stays content-sized.
- Treat the rendered example, the **Code** dialog, and **Playground** as one feature. Whenever an example component changes, update and verify both English and Chinese documentation source slots so Code and Playground stay synchronized with the rendered demo.
- Every example with `<template #example>` must also provide source slots for Code and Playground. Those slots must reconstruct a complete, valid Vue SFC: reference the full top-level `<template>`, `<script>` / `<script setup>`, and `<style>` blocks that exist in the example file; never use a partial line range that cuts a block, tag, type declaration, import, or style rule.
- Keep a blank line before and after every `@[code...]` include inside a source slot. VuePress requires this spacing to render the include; without it, the page exposes the directive as literal text and Code receives an empty source.
- Prefer running `pnpm run normalize:doc-examples` after adding, moving, or substantially editing examples. Review the resulting line-range changes rather than maintaining fragile ranges by hand.
- Before completing any component-documentation change, run `pnpm run test:docs-examples`. For changes to the shared Code or Playground pipeline, also run `pnpm run docs:build` and verify the changed example through both the Code button and the Playground button in the browser. Cross-cutting source or compiler changes require the full component-example audit, not a sample-only check.
