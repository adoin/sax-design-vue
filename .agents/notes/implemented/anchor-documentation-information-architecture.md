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

Router mode retains its existing public name. Its documentation describes a mixed outline: route-level siblings select chapters and provide boundaries, while `#hash` descendants select headings in the current chapter and update on scroll. A backward wheel boundary enters the previous chapter at its final scroll position after its content mounts; ordinary route-link clicks keep the router's normal entry behavior.

At the scroll owner's page bottom, the final mounted hash descendant is active even if its heading remains below the normal fixed-header activation threshold. This applies equally to the window owner and a custom `get-container` owner, matching the next-route boundary's bottom visibility.

Anchor supports a reusable `activeStrategy` default of `heading` and an opt-in `visible-section` strategy. The latter compares the current page's heading-to-next-heading intervals against the readable scroll viewport below `offset`, selects the section with the largest overlap, and applies a small switch margin. The `activeOffset` prop and global Anchor field change only the heading-crossing line; without either, the established `offset` value remains its fallback. Both new fields resolve local prop, nearest Provider, outer Provider, then built-in behavior. Router mode keeps page-route and local-hash active state separate.

The documentation site's shared `SidebarRight` outline explicitly uses `visible-section` on ordinary pages and routed Table guides. This site choice does not change the library's `heading` default for application consumers.

For forward boundary navigation, visible-section router mode does not expose transient local-hash states while the new route retains the old page's scroll position or its content height settles. The route page state remains available; when the owner reaches the new page top and the first configured hash is mounted, the first hash becomes active. The first section stays selected through the short chapter-intro scroll range and until the next heading reaches the reading-focus line. Ordinary area scoring then resumes, while page-bottom selection remains unchanged.

The documentation site overrides the library's global `html` smooth-scroll rule with an immediate root-scroll default. Route navigation therefore snaps to the new page's top instead of visually rolling upward from the previous page's bottom. Anchor hash navigation retains its explicit smooth `ScrollToOptions.behavior`; the route-boundary SVG progress transition is unchanged.

English and Chinese pages share the `anchor-route-boundary` H2 followed by the `anchor-container` H3 in the same order. The scroll-container rendered example, Code source and Playground source are localized independently; the Chinese page must not render English example copy by default.

## Verification

- `pnpm run normalize:doc-examples` — completed with no skipped examples.
- `pnpm run test:docs-examples` — 4 files and 12 tests passed.
- `pnpm exec vitest run play/__tests__/localized-heading-slugs.test.ts` — 1 file and 4 tests passed.
- `pnpm exec eslint docs/.vuepress/components/anchor-zh/container.vue --no-cache` — passed.
- `pnpm run typecheck:web` — passed.
- `pnpm run docs:build` — passed; 201 pages rendered.
- Browser verification confirmed both locales render `anchor-route-boundary` as H2 and `anchor-container` as H3 inside the same card, with no standalone container card. Code and Playground expose complete localized SFCs, and both Playground previews render.
