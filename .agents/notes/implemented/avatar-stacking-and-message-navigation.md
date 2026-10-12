---
status: implemented
kind: project-specification
completed_at: 2026-10-12
modules:
  - packages/components/avatar
  - packages/components/message-scroller
---

# Avatar stacking and latest-message navigation

## 用户要求

> 然后Avatar堆叠功能加一下到我们的Avatar中
>
> 不需要向上的箭头吧，只需要提供一个回到最新消息的箭头就好，而且弄好看点 这个太平庸了

## Contract

- SAvatarGroup reuses SAvatar. `max` counts visible members, with a separate `+N` counter for remaining members. The previous overlay on the last visible photograph is replaced.
- `size` provides a group default with child overrides; `overlap` sets shared pixels, default 18. `float` keeps side-by-side placement. Counter geometry follows the adjacent avatar and counter content supports `overflow({ count })`.
- Slot children, fragments, conditional members, max and size changes are resolved reactively during rendering. Hidden members are not mounted.
- Bilingual Avatar Group examples show six circular photographs plus a separate +2 counter, dynamic max, and side-by-side placement. Group props have a separate SAvatarGroup API table.
- MessageScroller's built-in navigation offers only the latest-message down arrow. The public scrollToTop method and custom controls slot remain available for consumers.
- Latest button is a 44px circular surface with soft shadow, hover/press feedback, unread dot, and reduced-motion-aware enter/leave feedback. It disappears after returning to the bottom and restores following.

## Verification

- 47 Avatar and Agent component tests passed; 21 documentation tests passed.
- Web and Playground type checks and theme build passed.
- Chinese and English Avatar Code and Playground sources render six photographs and +2; switching max shows all eight members.
- Browser measurements: 48px avatar width, 36px advance for overlap 12.
- MessageScroller browser: only latest-message control appears while reading history; clicking returns to the bottom.
