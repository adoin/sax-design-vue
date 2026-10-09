---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Drawer capabilities and slots

## User request

> Drawer的功能和插槽都不够多，至少要对齐antdv和ele+的

## References

- Ant Design Vue 4 Drawer: https://antdv.com/components/drawer ; official source API reference at `vueComponent/ant-design-vue/components/drawer/index.en-US.md`.
- Element Plus Drawer: https://element-plus.org/en-US/component/drawer.html .

## Contract

- Keep controlled `v-model`, placement and CSS/numeric size. Add `v-model:open`, width/height, named default/large sizes, direction aliases and controlled size/width/height updates from resizing.
- Header, title, extra, footer, close-icon, loading, mask and resizer are scoped slots. Preserve the closeIcon slot alias. Header replacement retains separate extra and close controls; headerless drawers retain a floating close control. Slot scope includes close, open, closePending, loading, titleId/titleClass, placement, live size and resizing.
- Region style/class APIs address mask, wrapper, header, body and footer. Shape follows the shared component hook. Preserve semantic tokens and borderless focus feedback; close targets do not translate on hover.
- Default mounting is Teleport to body. `getContainer` must explicitly default to undefined: Vue's implicit Boolean false would incorrectly disable Teleport. `appendTo` takes precedence; selectors, elements and getContainer callbacks are supported. Explicit false or teleported=false renders inline; custom containers need a positioning context.
- Mask, keyboard, scroll locking, auto-focus, focus trapping and restoration are independently configurable. Mask-free penetrable drawers allow page interaction. Shared modal-stack reactivity pauses a lower Drawer focus trap when another modal owns the top layer; Escape belongs only to the top layer. Scroll locks persist through leave and are shared across nested overlays.
- Close control, mask, Escape, exposed close and controlled false requests share a deduplicated guard task. Promise fulfillment permits closing, rejection displays a plain-text Notification, and false silently cancels. Callback guards receive done(cancel?) and reason; done(true) cancels. Guarded mask closing requires an explicit local true, irrespective of inherited defaults.
- Closing waits for ending descendants' loading completion. Async close feedback uses the existing compact corners exit. Disposal and deactivation cancel timers, pending callbacks, queued pointer work and stale approvals. Rejected controlled closes restore the model.
- Lazy content stays mounted after close by default. destroyOnClose releases it after leave; forceRender prepares and retains it. Open/close delays are cancellable. Legacy open/close completion timing is preserved alongside opened/closed and afterOpenChange; beforeOpen/beforeClose mark transition start, and closeRequest reports an attempted closure.
- Nested Drawers support configurable parent push and independent top-layer closing. Ancestor shutdown forces child disposal without waiting on a child guard.
- Resizing supports pointer and keyboard interaction, min/max CSS bounds, Shift stepping and Home/End. Pointer samples are coalesced by animation frame; controlled v-model echoes must not interrupt an active gesture. Resize events carry size, placement and original event. Listeners, cursor and user-select are cleaned up on close/teardown.
- Ten paired examples cover default, placement/size, slots, guard, lifecycle, nesting, mounting/modality, loading, resizing and shape. Canonical English hashes, localized visible copy and full Code/Playground sources stay aligned. Public locale imports are resolved by the shared example runtime module map.

## Verification

- Drawer: 18 tests passed, including real default body Teleport under a locale provider, controlled resize echoes, guarding/disposal, lifecycle, focus, nested Escape/push/scroll locking, mounting, SSR and bounded keyboard/pointer resizing.
- Drawer and Dialog regressions: 48 tests passed in a separate overlapping run. Full documentation source/API/compiler audit: 4 files, 21 tests passed.
- Component and test typechecks, targeted ESLint (including the shared runtime module map), theme build and git diff whitespace check passed. Source normalization reports zero outstanding changes.
- Final VuePress build rendered all 201 pages successfully. Existing chunk-size and plugin-timing diagnostics remain build warnings.
- Browser verified both locales' Code and Playground, actual body/default and custom-container mounting, guard rejection/approval, nested push/Escape and pointer/keyboard controlled resize. Chinese width moved 420 → 430 with keyboard and then 510 with an 80px pointer drag. Child Escape left the surrounding Playground visible.
- Browser screenshots were unavailable from the capture backend; browser checks used rendered DOM, real semantic clicks and native pointer drag.
