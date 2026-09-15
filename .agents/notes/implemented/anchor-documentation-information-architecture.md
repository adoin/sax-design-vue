---
status: implemented
kind: project-specification
created_at: 2026-09-14
completed_at: 2026-09-14
modules:
  - docs/components/anchor.md
  - docs/zh/components/anchor.md
  - docs/.vuepress/components/anchor
  - docs/.vuepress/components/anchor-zh
supersedes: []
---

# Anchor documentation information architecture

## Contract

The Anchor documentation presents router mode as one top-level example card. Scroll-container configuration is a third-level subsection inside that card rather than a separate peer card, because `get-container` configures the scrolling context used by router boundaries and anchor state rather than introducing another Anchor mode.

The subsection must still state the full API scope: `get-container` applies to regular hash anchors and router mode. It supplies one container for anchor navigation, active-state calculation and route-boundary wheel ownership.

English and Chinese pages share the `anchor-route-boundary` H2 followed by the `anchor-container` H3 in the same order. The scroll-container rendered example, Code source and Playground source are localized independently; the Chinese page must not render English example copy by default.

## Verification

- `pnpm run normalize:doc-examples` — completed with no skipped examples.
- `pnpm run test:docs-examples` — 4 files and 12 tests passed.
- `pnpm exec vitest run play/__tests__/localized-heading-slugs.test.ts` — 1 file and 4 tests passed.
- `pnpm exec eslint docs/.vuepress/components/anchor-zh/container.vue --no-cache` — passed.
- `pnpm run typecheck:web` — passed.
- `pnpm run docs:build` — passed; 201 pages rendered.
- Browser verification confirmed both locales render `anchor-route-boundary` as H2 and `anchor-container` as H3 inside the same card, with no standalone container card. Code and Playground expose complete localized SFCs, and both Playground previews render.
