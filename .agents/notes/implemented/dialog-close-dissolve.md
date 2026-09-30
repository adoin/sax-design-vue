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
- Closing first approves beforeClose, then finishes existing loading restoration, then dissolves for 220ms by default, and finally removes the surface and overlay together. Rejections do not start dissolution. Close requests remain merged and the filtered target becomes inert while dissolving.
- The graph and curve are shared with Input placeholders via private SvgDissolveFilter/useSvgDissolve modules. Input retains its native Vue IDs, text bounds, 480ms outgoing and 650ms incoming timing. Dialog uses tighter surface bounds, instant reset on reopen, and its existing shared ID injection context so independent global render roots do not collide. Each instance owns its mutable filter graph and frame loop; static SVG registration is not used.
- Reopening cancels the old close task, restores the original filter/inert state and confirmation availability, and resets local filter parameters. Owner unmount cancels pending frames/Promises; retained global surfaces continue until their actual close. Reduced motion and hidden pages settle immediately.
- Paired documentation includes a localized close-animation toggle and synchronized complete Code/Playground source. Public descriptions describe current API behavior only.

## Verification

- 61 Dialog/loading/Input-placeholder/Image Preview/ConfigProvider tests and 21 documentation checks passed. Coverage includes ordinary and dock targets, rejection, local/global-default opt-out, unique global filter IDs, reopen/confirmation restart, hidden-page settlement and teardown, plus existing Input SSR/reversal/KeepAlive behavior.
- Web/Vitest type checks, module and theme compilation passed.
- Chromium screenshot showed particle erosion of the entire Dialog surface. During sampled dissolution the overlay filter remained none, opacity 1, and its background unchanged. Verified opt-out, local and orphaned-global dock closure, imperative settlement, and both localized rendered demos, complete Code and Playground previews.

## Faster configurable timing (2026-09-30)

> 刚的关闭动画似乎是动画先结束 然后遮罩再消失？，而且对于一个弹窗来说有点慢了，这里可以加快，如果是一个固定的方法来生成这个东西的话 可以抽离一个速度参数或者时间参数。总之这里太慢了

- Shared private dissolve options now accept `dissolveDuration` as a number/ref/getter in milliseconds. Input retains its 480ms dissolve and 650ms aggregation defaults. Invalid private timing cannot leave a never-ending frame loop.
- Dialog adds `closeAnimationDuration` / `close-animation-duration`, default 220ms, non-negative finite milliseconds; zero finishes immediately. Imperative options and Dialog global defaults accept the same setting. The 480ms original Dialog timing is superseded.
- After the particle timeline completes, a synchronous Vue leave callback removes the overlay in that same patch, bypassing the framework's extra CSS leave-frame scheduling. Mask opacity/filter stay unchanged until removal.
- Paired examples offer 120/220/480ms comparison controls with matching complete Code/Playground sources.
- Verification: 69 focused component tests, including a real Transition mask-removal test at custom 60ms and 0ms, passed. Browser sampling saw both surface and mask disappear together at the zero-alpha endpoint; no zero-alpha frame retained the mask. Both localized demos, Code and Playground were verified, including the 120ms choice.
