---
status: implemented
kind: project-specification
completed_at: 2026-09-30
modules:
  - packages/components/dialog
  - packages/locale/lang/en.ts
  - packages/locale/lang/zh-cn.ts
  - docs/components/dialog.md
  - docs/zh/components/dialog.md
---

# Dialog Promise-based close approval

## User request

> 不急 先加一个钩子 beforeClose 如果有配置这个钩子 只有当返回Promise.resolve的时候才能继续关，否则reject的文字作为提示弹出并阻止关闭，做完这个后再在真实关闭弹窗的时候做这个钩子

## Contract

- `DialogBeforeCloseFn` is `() => Promise<void>`. The callback-style done argument is replaced by Promise approval. With no guard, existing closing continues immediately. With a guard, only fulfillment permits the real exit path; rejection, synchronous exceptions, and non-Promise returns leave the dialog open.
- Rejected strings and Error.message are displayed using the existing SNotification surface, with localized fallback text, an explicit plain-text rendering option, and a z-index above the active dialog. The close-error event preserves the rejected payload for logging. Both on-demand Dialog style entries include Notification styling.
- Close icon, dock close, overlay, Escape, built-in cancellation/confirmation, instance close(), and controlled model-false requests share one close task. Pending requests merge, close buttons show loading and become disabled, and confirmation cannot run while closing is being checked. Footer scope and exposed instance include closePending.
- Rejected controlled closes emit update:modelValue true so the model agrees with the visible surface. close() resolves a Boolean indicating approval to start exiting, while closed remains the signal that exit/disposal has finished.
- An active check captures its guard once; normal rerendering with a new function identity does not cancel it. Reopening invalidates prior approval, and unmount invalidates prior approval/rejection so stale results cannot close a new session or show notifications. Local owner teardown remains lifecycle disposal. Global orphaned surfaces retain pending checks and dock state until approved, then follow their existing final cleanup path.
- SDialogBox forwards the same guard. Rejected closing does not settle the service Promise and resets its tentative action so a later ordinary close cannot report the previous rejected confirmation/cancellation. Successful service results still settle after closed and host disposal.
- The publishing workflow uses held Promises for unsaved-draft consent: keep editing rejects with the preservation message, discard resolves, and publishing-in-progress rejects with its reason. A new paired before-close example covers asynchronous rejection, approval, and minimized global bubbles. Code, Playground, API types and canonical heading slugs remain synchronized across locales.

## Verification

- 39 Dialog/configuration/Image Preview tests passed, followed by the final 24-test Dialog run. Coverage includes pending merge/loading, string/Error rejection, strict Promise returns, all close entries, controlled visibility restoration, stale results, reopening, orphaned global approval and imperative disposal/action correctness.
- 21 full documentation example checks, web/Vitest type checks and complete library build passed. Final module/full-bundle refreshes passed after the last behavior refinement, and emitted definitions expose Promise-based guards, closePending and Promise-returning close().
- Browser verified localized rejection notifications while the original dialog stays open, identical behavior on the dock close action, and approved closure only after resolving. Both locales' Code dialogs contain complete SFC blocks and their Playground previews run the new example. The migrated publishing example preserves a rejected draft and closes on explicit discard approval.
