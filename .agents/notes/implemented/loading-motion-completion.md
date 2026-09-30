---
status: implemented
kind: project-specification
completed_at: 2026-09-30
modules:
  - packages/hooks/use-loading-completion
  - packages/components/icon/src/logo-loading.vue
  - packages/components/icon/src/logo-loading-motion.ts
  - packages/components/button
  - packages/components/dialog
---

# Loading motion completion before Dialog exit

## User request

> 这个loading尽量都要播放完前摇、后摇部分 目前异步校验结束后直接关了稍微等等动画

## Contract

- Dialog operation state and visual loader activation are separate. A settled beforeClose turns the visible loader inactive while retaining it and the dialog until its starting/restoring motion completes. Confirmation uses the same ending-motion wait before requesting exit; confirmation business events remain independent from visual exit timing.
- The default Button overlay retains its IconLoading after loading becomes false, drives active=false, and releases the overlay after restored. Its disabled/aria-busy state includes visual completion. Existing inline prefix/suffix restoration remains intact. Explicit loading presets and custom loading slots keep their existing presentation paths.
- An internal Vue completion scope collects only already-restoring Sax loaders in the current Dialog subtree; unrelated active loaders are not stopped or awaited. Participants resolve waiters on idle, restart or unmount. Registry injection uses a shared Symbol key so imported copies use the same scoped protocol.
- LogoLoading restored is emitted after the final SVG frame is patched. Phase generations suppress stale deferred completion signals. Early stop during starting uses the existing pending-stop state, completing the lead-in before the return path.
- Close/confirm indicators begin only if the operation survives to a rendering frame. Instant checks that never display a loader add no artificial full-animation delay. Reduced motion ends immediately, and hiding a page during restoration resolves it rather than waiting on paused animation frames.
- Close requests remain merged and controls remain protected through the finishing phase. Late results after reopening or unmount cannot mutate the new session. Normal owner teardown remains immediate lifecycle cleanup.

## Verification

- 77 tests across Dialog, Button, icons, configuration inheritance and Image Preview passed. New deterministic animation tests cover complete starting/stopping for close and confirmation, minimized bubbles, instant approval, reduced motion and background-page completion. Button tests cover retained default overlays and blocked interaction until restoration.
- 21 documentation checks, web/Vitest type checking and module compilation passed. Public Dialog copy explains the visible-motion completion behavior in both locales.
- Chromium sampling observed starting around 38ms, stopping around 969ms and Dialog leave around 2342ms for a 600ms close check. Confirmation showed starting around 107ms, stopping around 1025ms and leave around 2401ms. Exit therefore follows the existing loader return path instead of truncating it at operation settlement.
