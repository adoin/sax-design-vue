---
status: implemented
kind: project-specification
created_at: 2026-09-22
completed_at: 2026-09-22
modules:
  - packages/components/text
  - packages/theme-chalk/src/text.scss
  - docs/components/text.md
  - docs/zh/components/text.md
supersedes: []
---

# Text effect API

## Contract

`SText.effect` is the single visual-effect selector. Its stable values are `default`, `shimmer`, `typing`, `rainbow`, `neon`, and `shadow`; `default` preserves the ordinary Text rendering. Effects are mutually exclusive. The previous Boolean or numeric `typing` prop is not a second activation path: typewriter rendering uses `effect="typing"`.

`shimmer` follows the current shadcn text utility structure: a `currentColor` gradient uses a 20-degree band, a two-second linear sweep, RTL reversal, semantic-color inheritance, and a brighter dark-theme highlight. Its component-scoped custom properties remain overridable. Reduced-motion preference removes the gradient animation and restores the current text color.

`typing` reveals `content` by Unicode code point at the established default interval, keeps the complete source string as its accessible label, exposes busy state only while characters remain, cancels stale runs after content or effect changes, and renders the complete string immediately under reduced-motion preference.

`rainbow`, `neon`, and `shadow` adapt the first matching treatments from Abdulrahman's CSS Text Animation CodePen. Rainbow keeps the four-second linear color cycle but uses project semantic colors. Neon keeps the alternating glow intensity while deriving every layer from `currentColor`. Shadow keeps the moving text shadow and blurred gradient follower; the mirrored follower uses `content` through a decorative `data-text` layer. Reduced-motion preference converts all three to static treatments.

English and Chinese documentation use separate localized example SFCs. Rendered demos, Code, Playground, and API metadata expose every effect value without the removed `typing` prop.

## Verification

- Text, theme, and API metadata tests: 3 files and 20 tests passed.
- Targeted ESLint and `pnpm run typecheck:web` passed.
- `pnpm run build:theme` passed.
- `pnpm run test:docs-examples`: 4 files and 17 tests passed.
- `pnpm run docs:build`: 203 pages rendered; the built English and Chinese Text pages contain an interactive `TextEffect` declaration entry in `API_TYPE_DETAILS`.
- Browser verification covered semantic shimmer, rainbow, neon, and shadow animation names, durations, colors and shadow layers; light and dark themes; localized English and Chinese examples; and both Code and Playground sources.
