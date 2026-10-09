---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Notice Bar asynchronous close approval

## Contract

- `beforeClose` is `() => Promise<void>`. The built-in button, scoped slot close function and instance close method await fulfillment before emitting an approved close request or changing internal visibility.
- Rejection, synchronous exceptions and non-Promise returns preserve visibility and emit `closeError` with the reason. Consumers decide whether rejection needs visible feedback; canceling a choice does not automatically create a notification.
- `close()` returns `Promise<boolean>`: true means an approved close request, false means rejection or cancellation. The existing `closed` event remains the completed-exit signal. Without a guard, the visibility request remains synchronous.
- Pending requests share one Promise and captured guard. `closePending` is exposed and included in slot scopes; it disables the built-in close button and pauses automatic scrolling and cycling.
- Open, owner teardown, deactivation and external hiding invalidate pending approval. Stale completions cannot emit close/error events or close a new session. A guard canceled before its queued invocation does not run.
- Direct v-model changes retain owner-controlled visibility semantics. For guarded programmatic dismissal, use the instance or slot close method.
- Permanent-vs-temporary dismissal is application policy. The paired example composes Notice Bar and Dialog, saves its own localStorage preference, handles storage failure, rejects canceled decisions, and exposes a preference-reset action.

## Verification

- Notice Bar suites: 20 tests passed, covering approval, rejection/retry, invalid guards, pending merging, autoplay pause, controlled ownership, slot/button/instance entry points, stale completion, pre-invocation cancellation and baseline behavior.
- Documentation source/API audit: 21 tests passed; web and Vitest type checks passed.
- Browser verified cancellation, temporary dismissal and reload recovery, permanent dismissal and persistence, preference reset, and localized Code/Playground examples through one reused verification tab.
