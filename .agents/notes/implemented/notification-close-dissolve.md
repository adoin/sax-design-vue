---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Notification particle dismissal

## Contract

- Notification defaults to a 220ms surface particle dissolve. `closeAnimation: false` or `closeAnimationDuration: 0` skips motion. Reduced motion and hidden documents also skip graph allocation.
- The close button (after its existing synchronous approval), duration expiry and imperative handle all use the same dismissal path. Duplicate requests do not restart the effect or duplicate callbacks.
- Notification and Dialog compose the same `useSurfaceDissolve` lifecycle around the registered dissolve animation module. Each surface has its own ID and mutable graph, allocated only while closing and released at completion or cancellation.
- Dissolution preserves the notification's stack footprint until completion. Only the notification surface receives the filter; neighboring notifications and the shared position container are unaffected. No extra CSS leave animation is appended.
- `onClose` runs once after completion. Imperative notifications then unmount through the destroy event, releasing their Vue instance, timer and frame resources.
- Reopening cancels an unfinished exit, restores filter/opacity/inert state and restarts the lifetime. Owner teardown cancels the exit and clears duration/progress timers.
- English and Chinese close-animation examples, Code and Playground sources expose animation opt-out and manual/automatic closure.

## Verification

- Notification dissolution/loading and Dialog dissolution regression: 21 tests passed, including lazy allocation, unique IDs, neighboring surfaces, cancellation, custom timing, auto expiry, opt-out, reduced motion, reopen, teardown and imperative disposal.
- Documentation example/API audit: 21 tests passed. Web and Vitest type checks passed.
- Browser observed zero idle particle filters, one during Notification close, zero afterward, with the notification removed. Localized rendered examples, Code and Playground were checked in one reused verification tab.
