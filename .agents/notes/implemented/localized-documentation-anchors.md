---
status: implemented
kind: project-specification
updated_at: 2026-09-11
completed_at: 2026-09-11
modules:
  - docs/.vuepress/config.ts
  - docs/.vuepress/node/localizedHeadingSlugs.ts
  - packages/components/anchor
  - packages/theme-chalk/src/anchor.scss
  - docs/zh
---

# Localized documentation anchor values

## Public URL contract

Localized headings keep their translated visible labels while sharing the concise English heading slug from the matching canonical document. The English and Chinese documents at the same relative path keep their heading order aligned so the Markdown build can pair each heading deterministically. A Chinese Table heading such as `行选择` therefore renders with `id="row-selection"`, and selecting `单选` updates the URL to `#single-selection`.

Localized API metadata uses the same English values for same-page `usage` links. Public documentation must not emit percent-encoded CJK hashes for localized headings.

## Outline hierarchy

Expanded outline levels use one opaque one-pixel vertical guide per depth. Adjacent row segments meet without overlap so joins do not create darker dots. A child group draws horizontal connectors at the top of its first item and the bottom of its last item, spanning only between the parent and child vertical guides so the expanded branch closes cleanly. Middle siblings continue the child guide without adding horizontal rungs, and no connector extends from a guide to label text.

Vertical items remain on the base surface in default, hover, selected, and active-ancestor states; hover changes only the text color. The selected item absolutely positions its marker immediately outside the label's left edge, so activation does not change text alignment, wrapping, or row height. `SAnchor` renders an inline location SVG by default, independent of installed icon collections. Global configuration may replace it through `anchor.activeIcon`, and the `active-icon` slot overrides both while receiving the active item and href. The marker uses a restrained one-pixel lift and pulse; reduced-motion users receive the same marker without animation. Selected hash links expose `aria-current="location"`, while selected route links expose `aria-current="page"`. Hierarchy guide gutters remain visually independent, and horizontal anchors retain their underline treatment.

Anchor route items remain semantic links and emit both the selected item and native `MouseEvent`. Router-based hosts can cancel ordinary same-origin clicks and perform client-side navigation without adding a Vue Router dependency to the component. Modified clicks, external URLs, context menus, and copied addresses continue to use native link behavior.

`SAnchor` generates route continuation internally in `router` mode. The active item's route siblings supply optional previous and next edges; no content wrapper or separately installed public component is required. The boundary exposes localized direction, continued-scroll, loading, and progress labels; hidden edges are removed from the accessibility tree and tab order. Its default inline direction SVG does not depend on an icon collection, reduced-motion users receive no repeated nudge animation, and the `route-previous` and `route-next` slots can replace edge copy without replacing link or progress semantics.

The Anchor reference documents the automatic router mode rather than requiring the live Table guide to explain wiring. The example passes normal recursive items and a router object to `SAnchor`; Anchor derives adjacent items, preserves modified native clicks, delegates ordinary activation to `push` or `replace`, and links to the Table chapters for live interaction. A second example shows application-wide adapter registration. The adapter is structural and keeps Anchor free of runtime dependencies on Vue Router, vue-smart-router, or another routing package.


## Verification

- Localized heading tests confirm every paired English and Chinese document produces identical H2/H3 slug sequences while retaining translated labels.
- Anchor hierarchy tests confirm recursive expansion, one branch connector per child group, one active icon, and `aria-current` on the selected item.
- Documentation example tests pass for both locales.
- Type checking, ESLint, and the 201-page production documentation build pass.
- Browser verification confirms Chinese Table labels navigate to English values such as `#single-selection`.
- Browser verification confirms same-origin Table chapter navigation preserves the page runtime while updating the route and rendered chapter.
- Boundary intent tests confirm arrival inertia is ignored and only a paused follow-up gesture can reach the configured navigation threshold.
