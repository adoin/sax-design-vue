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

The Anchor documentation presents mixed route and local-anchor navigation as one top-level example card. Scroll-container configuration is a third-level subsection inside that card rather than a separate peer card, because `get-container` configures the scrolling context used by router boundaries and anchor state rather than introducing another mode.

The subsection must still state the full API scope: `get-container` applies to local hash anchors and route-aware outlines. It supplies one container for anchor navigation, active-state calculation and route-boundary wheel ownership.

Anchor has no navigation mode prop. When a router is available it classifies each item independently: an omitted `href` is a group label, a bare `#hash` is local, another same-origin document is routed, and a pathname plus hash routes only when its document differs. Boundary order is flattened across groups; full routes without hashes participate by default, while item-level `boundary` can include a cross-document hash or exclude a route. A backward wheel boundary enters the previous entry at its final scroll position after its content mounts; ordinary route-link clicks keep the router's normal entry behavior.

When multiple items share a pathname, route-aware matching prefers an exact normalized `path + query + hash` before falling back to pathname matching. This lets a dedicated full-path hash target such as a generated API reference remain distinct from its overview compatibility path and expose its own local hash descendants without entering the route-boundary sequence.

At the scroll owner's page bottom, the final mounted hash descendant is active even if its heading remains below the normal fixed-header activation threshold. This applies equally to the window owner and a custom `get-container` owner, matching the next-route boundary's bottom visibility.

Anchor supports a reusable `activeStrategy` default of `heading` and an opt-in `visible-section` strategy. The latter compares the current page's heading-to-next-heading intervals against the readable scroll viewport below `offset`, selects the section with the largest overlap, and applies a small switch margin. The `activeOffset` prop and global Anchor field change only the heading-crossing line; without either, the established `offset` value remains its fallback. Both new fields resolve local prop, nearest Provider, outer Provider, then built-in behavior. Route-aware matching keeps page-route and local-hash active state separate.

The documentation site's shared `SidebarRight` outline explicitly uses `visible-section` on ordinary pages and routed Table guides. This site choice does not change the library's `heading` default for application consumers.

For forward boundary navigation, the visible-section strategy does not expose transient local-hash states while the new route retains the old page's scroll position or its content height settles. The route page state remains available; when the owner reaches the new page top and the first configured hash is mounted, the first hash becomes active. The first section stays selected through the short chapter-intro scroll range and until the next heading reaches the reading-focus line. Ordinary area scoring then resumes, while page-bottom selection remains unchanged.

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
