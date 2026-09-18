---
status: implemented
kind: project-specification
updated_at: 2026-09-11
completed_at: 2026-09-11
modules:
  - docs/.vuepress/app/component-categories.ts
  - docs/.vuepress/client.ts
  - docs/.vuepress/theme/shared/tableDocumentation.ts
  - packages/hooks/use-floating/vue/use-floating.ts
  - packages/components/scrollbar/src/scrollbar.vue
  - packages/components/anchor/src/anchor.vue
  - packages/components/anchor/src/anchor-route-boundary*
  - docs/.vuepress/theme/components/SidebarRight.vue
  - docs/components/table.md
  - docs/components/table/*.md
  - docs/zh/components/table.md
  - docs/zh/components/table/*.md
---

# Documentation scroll performance

## Contract

Closed floating layers do not recompute their viewport position on window scroll or resize, including persistent content kept mounted for fast opening. Opening a layer attaches its positioning work again and preserves normal scroll tracking while visible.

`SScrollbar` coalesces component-update measurements into at most one animation-frame callback. `SAnchor` coalesces scroll events into one frame and resolves the active heading by walking from the current item to adjacent headings instead of scanning every page heading on every frame. Initial resolution and large scroll jumps still find the correct item, and dynamic heading positions are read when crossed.

Large component guides split independent feature groups into route-level pages. The Table overview retains only the generated API as a compatibility endpoint; ordinary Table navigation lands on the first feature route. Each of the 13 feature routes owns only that section's explanatory copy, examples, Code sources, and Playgrounds. Page height is therefore stable after navigation and no placeholder or viewport-driven mount/unmount behavior is used.

`SAnchor` renders semantic links for both page hashes and route URLs and includes the native `MouseEvent` in its click event. The documentation outline presents the Table feature routes as one hierarchy and expands the current route with its local example hashes. The documentation theme cancels ordinary primary-button navigation for same-origin route links and delegates it to Vue Router, while external links and modified clicks keep browser-native behavior. Same-page hashes retain Anchor's offset-aware scrolling and active-state tracking.

`SAnchor` owns route continuation whenever a router is available and the active item participates in the flattened boundary sequence. It reads the active location from a local or global structural router adapter and derives previous and next entries across nested groups. Full routes without hashes participate by default; item-level `boundary` can include a cross-document hash or exclude a route. Hash children remain page-local anchors, path-plus-hash targets use the router only to reach another document, and group labels omit `href`. The internal `SAnchorRouteBoundary` observes scroll metrics without wrapping or modifying route content and renders compact fixed prompts only at the corresponding viewport edge. The gesture that first reaches either edge is ignored; after a configurable pause, a new wheel gesture in that direction accumulates visible progress and navigates through the same adapter. A module-level route cooldown prevents residual events from one gesture from crossing multiple routes. Semantic links preserve pointer, keyboard, touch, context-menu, and modified-click behavior. The first eligible item has no previous boundary and the last has no next boundary.

## Verification

- A stable Chinese Table documentation page contained 74 mounted, hidden poppers.
- Before the fix, a 60-frame document scroll took 6351ms, performed 23,040 `getBoundingClientRect` reads, and produced long tasks throughout the run.
- After closed-popper gating and frame coalescing, the same run took 1488ms with 10,380 reads and two approximately 50ms long tasks.
- After neighboring-heading resolution, the final run took 1506ms with 641 reads and the same two approximately 50ms long tasks.
- Popper, Scrollbar, Anchor, and focused Table suites passed: 5 files and 33 tests.
- `pnpm run typecheck:web` and targeted ESLint checks passed.
- The Table overview mounts no examples and ordinary navigation skips it for the first feature chapter. The largest routed feature chapter contains 13 examples instead of the previous page's 65, so every route has a fixed document height and a bounded component count.
- Documentation source validation recursively covers the routed Table chapters in both locales and preserves all 65 paired examples.
- Anchor tests cover semantic route links, disabled route entries, page-current state, nested hashes, and the configurable active marker.
- Browser verification confirms Table chapter navigation preserves `performance.timeOrigin`, proving the document shell is not reloaded during same-origin Anchor navigation.
- Browser verification confirms continued scrolling from row selection to sorting and filtering, and upward scrolling back to row selection, preserve the same `performance.timeOrigin`. The arrival gesture does not navigate, a paused follow-up gesture does, and an immediate residual gesture remains on the newly opened route.
