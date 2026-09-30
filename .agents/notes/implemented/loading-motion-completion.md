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
  - packages/components/radio
---

# Loading motion completion before Dialog exit

## User request

> 这个loading尽量都要播放完前摇、后摇部分 目前异步校验结束后直接关了稍微等等动画

## Contract

- Dialog operation state and visual loader activation are separate. A settled beforeClose turns the visible loader inactive while retaining it and the dialog until its starting/stopping motion completes. Close and dock indicators use the compact four-point clearing tail described below. Confirmation buttons retain the default logo restoration and ending-motion wait; confirmation business events remain independent from visual exit timing.
- The default Button overlay retains its IconLoading after loading becomes false, drives active=false, and releases the overlay after restored. Its disabled/aria-busy state includes visual completion. Existing inline prefix/suffix restoration remains intact. Explicit loading presets and custom loading slots keep their existing presentation paths.
- An internal Vue completion scope collects only already-restoring Sax loaders in the current Dialog subtree; unrelated active loaders are not stopped or awaited. Participants resolve waiters on idle, restart or unmount. Registry injection uses a shared Symbol key so imported copies use the same scoped protocol.
- LogoLoading restored is emitted after the final SVG frame is patched. Phase generations suppress stale deferred completion signals. Early stop during starting uses the existing pending-stop state, completing the lead-in before the return path.
- Close/confirm indicators begin only if the operation survives to a rendering frame. Instant checks that never display a loader add no artificial full-animation delay. Reduced motion ends immediately, and hiding a page during restoration resolves it rather than waiting on paused animation frames.
- Close requests remain merged and controls remain protected through the finishing phase. Late results after reopening or unmount cannot mutate the new session. Normal owner teardown remains immediate lifecycle cleanup.

## Verification

- 77 tests across Dialog, Button, icons, configuration inheritance and Image Preview passed. New deterministic animation tests cover complete starting/stopping for close and confirmation, minimized bubbles, instant approval, reduced motion and background-page completion. Button tests cover retained default overlays and blocked interaction until restoration.
- 21 documentation checks, web/Vitest type checking and module compilation passed. Public Dialog copy explains the visible-motion completion behavior in both locales.
- Chromium sampling observed starting around 38ms, stopping around 969ms and Dialog leave around 2342ms for a 600ms close check. Confirmation showed starting around 107ms, stopping around 1025ms and leave around 2401ms. Exit therefore follows the existing loader return path instead of truncating it at operation settlement.

## Compact four-point exit (2026-09-30)

User request:

> 目前这种loading后摇先不动，给很多地方都有用，再做一个简单后摇的版本，参考checkbox也是四个点收起消失，radio和这里都使用这套。

- Reuse the shared `stop-behavior="corners"` variant already used by Checkbox. The default `restore` variant and its geometry/timing remain unchanged. Both variants finish an early-stopped lead-in without replaying it.
- Radio and Dialog close/dock indicators opt into compact clearing: each colored strand travels to its next quadrant boundary and disappears. The tail is 550ms at speed 1, or 220ms at the default speed 2.5.
- Radio retains the same loader after its loading prop becomes false, blocks native/model selection and reports busy until restored, then displays the normal circle/custom icon. Restart during compact exit resumes the same orbit. Reduced motion restores immediately.
- Dialog retains existing approval/rejection, duplicate suppression, global lifetime and completion coordination. Confirmation Button loading keeps the default restore tail. The previous long-tail close sampling above is historical; compact close verification is recorded below.
- Radio documentation adds separate localized loading toggle examples; paired Code/Playground sources and descriptions explain the compact exit.
- Verification: 84 focused Radio/Dialog/logo/Button tests, 21 documentation checks, web/Vitest type checks and module compilation passed. Browser sampling measured Radio stopping-to-restored at 217ms, Dialog close rejection restoration at 234ms and dock removal at 235ms. Both localized Radio demos, full Code sources and Playground loading switches were exercised; rejected Dialog closing retains its surface and approved dock closing waits for the compact tail.
