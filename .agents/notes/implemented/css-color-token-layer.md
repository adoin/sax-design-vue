---
status: implemented
kind: project-specification
created_at: 2026-09-18
completed_at: 2026-09-18
modules:
  - packages/theme-chalk/src/mixins/function.scss
  - packages/theme-chalk/src/mixins/_var.scss
  - packages/utils/color.ts
supersedes: []
---

# Two-layer CSS color tokens

## Contract

Semantic colors keep HSL channel tokens such as `--sax-primary` for theme generation. Every channel token also publishes a complete CSS color token `--sax-css-*` whose default value is `hsl(var(--sax-*))`.

Components consume the complete color layer through `getColor()` / `var(--sax-css-primary)` and tint with `color-mix(in srgb, var(--sax-css-primary) 12%, transparent)`. Applications may override `--sax-css-primary` with any CSS color (`oklch()`, `hex`, `color-mix()`) without rewriting HSL channels. Dark mode continues to replace channel tokens only; `--sax-css-*` theme tokens stay on `:root`/`html` and recompute with the dark channels.

`--sax-color` is a per-component slot, not a theme key. Do not publish `--sax-css-color` on `:root`: custom properties inherit computed values, so a root complete color would freeze to the base ink and ignore local `--sax-color`. Re-specify `--sax-css-color: hsl(var(--sax-color))` on the same element that sets `--sax-color`, such as `[class*='--primary']`.

Do not inline `hsl(var(--sax-*))` in component properties. The `hsl(var(--sax-*))` wrap belongs only to `--sax-css-*` definitions.

## Implementation

`set-color` / `set-colors` emit `--sax-css-*` on `:root`. `getColor()` returns `var(--sax-css-*, hsl(var(--sax-*)))` and uses `color-mix` for alpha. `getCssColor()` resolves theme tokens and literal colors to that complete color layer for Vue style bindings.

## Verification

- `packages/theme-chalk/__tests__/color-token-layer.test.ts`
- `packages/utils/__tests__/color.test.ts`
- `packages/components/textarea/__tests__/textarea.test.ts`
- `pnpm run build:theme`
- `pnpm run test:docs-examples`
- Docs homepage and `/theme/` in the local browser: `--sax-css-primary` resolves to `hsl(var(--sax-primary))`, and the default color swatches still render primary/success/danger/warn/dark.
