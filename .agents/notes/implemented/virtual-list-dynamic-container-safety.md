# Virtual List dynamic container safety (pending release)

Status: implemented and locally verified; held locally at the user's request, not published.

- The viewport uses size containment and a 320px intrinsic fallback so an unresolved percentage height cannot expand from its own virtual spacer.
- Definite parent dimensions continue to control percentage sizing. ResizeObserver updates the visible range after resize, hidden states, and reactivation; no permanent height lock is introduced.
- maxRenderedItems defaults to 500 including overscan. Oversized ranges are bounded around the current scroll anchor immediately, in development and production.
- Only a continuously limited, visible viewport lasting 200ms produces a development warning. Recovery and unmount cancel pending warnings; zero-height hidden states do not warn. Normal sizing automatically restores normal range calculation.
- Tests cover oversized viewport recovery, changing overscan and budget, anchor retention, transient warning cancellation, hidden states, and cleanup.

Validation: web typecheck; 96 relevant Virtual List/Table/documentation tests; 47 Agent shared tests; 233-page documentation build. Both localized demos, complete Code sources, and Playground were checked in the browser. Parent auto/220px/420px/0px/recovery yielded bounded rendering and automatic resizing.

The original Admin multi-minute freeze was not reproduced exactly. The intrinsic-size expansion mechanism was reproduced independently; this protection addresses that mechanism without claiming it uniquely explains every previous stall.


Release authorization: 2026-10-15 user requested publishing the new library version and upgrading Admin. Included in 2.1.7 after local verification; previous release hold is superseded.
