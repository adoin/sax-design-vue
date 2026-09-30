---
status: implemented
kind: project-specification
completed_at: 2026-09-30
modules:
  - packages/components/dialog
  - packages/components/base/src/svg-dissolve-filter.vue
  - packages/hooks/use-svg-dissolve
  - packages/components/input/src/input-placeholder.vue
  - packages/theme-chalk/src/dialog.scss
  - docs/components/dialog.md
  - docs/zh/components/dialog.md
---

# Dialog surface-only particle closing

## User request

> 然后弹窗的关闭增加之前我们做的粒子消散效果除非配置关闭动画，记住只动弹窗不动遮罩

## Contract

- `closeAnimation` / `close-animation` defaults to true. False disables close animation, including the old scale/fade tail. It is accepted by declarative Dialog, imperative SDialogBox options and Dialog global defaults.
- Only the Dialog surface or its minimized bubble receives a local SVG filter. The overlay retains its original opacity, background, geometry and filter throughout dissolution, and is removed at completion. Enter animation stays intact.
- Closing first approves beforeClose, then finishes existing loading restoration, then dissolves for 480ms, and finally removes the surface. Rejections do not start dissolution. Close requests remain merged and the filtered target becomes inert while dissolving.
- The graph and curve are shared with Input placeholders via private SvgDissolveFilter/useSvgDissolve modules. Input retains its native Vue IDs, text bounds, 480ms outgoing and 650ms incoming timing. Dialog uses tighter surface bounds, instant reset on reopen, and its existing shared ID injection context so independent global render roots do not collide. Each instance owns its mutable filter graph and frame loop; static SVG registration is not used.
- Reopening cancels the old close task, restores the original filter/inert state and confirmation availability, and resets local filter parameters. Owner unmount cancels pending frames/Promises; retained global surfaces continue until their actual close. Reduced motion and hidden pages settle immediately.
- Paired documentation includes a localized close-animation toggle and synchronized complete Code/Playground source. Public descriptions describe current API behavior only.

## Verification

- 61 Dialog/loading/Input-placeholder/Image Preview/ConfigProvider tests and 21 documentation checks passed. Coverage includes ordinary and dock targets, rejection, local/global-default opt-out, unique global filter IDs, reopen/confirmation restart, hidden-page settlement and teardown, plus existing Input SSR/reversal/KeepAlive behavior.
- Web/Vitest type checks, module and theme compilation passed.
- Chromium screenshot showed particle erosion of the entire Dialog surface. During sampled dissolution the overlay filter remained none, opacity 1, and its background unchanged. Verified opt-out, local and orphaned-global dock closure, imperative settlement, and both localized rendered demos, complete Code and Playground previews.
