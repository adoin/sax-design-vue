---
status: implemented
kind: project-specification
completed_at: 2026-09-30
modules:
  - packages/theme-chalk/src
  - docs/.vuepress/theme
---

# Stable reading targets during hover

## User request

> 其他的有hover的时候左右移动的特效有哪些罗列一下，你看看其中哪些应该也改成其他特效的，横移会造成视角无法聚焦，伤眼睛的

> 嗯 按你的处理 然后placeholder那个你看 还是会

## Contract

- Hover feedback for reading targets uses color, surface tint, opacity, elevation, or layering while preserving horizontal text and hit-target coordinates. Audit transform, padding, margin, width, left/right, and parent layout together.
- Select options, Menu rows, Tabs overflow entries, and documentation card headings no longer move sideways. Select clear actions fade at their reserved position.
- AvatarGroup overlapping avatars remain stationary; hover raises stacking/elevation. Grouped action icons reserve trailing space and fade beside the avatar, including focus-within support.
- Button's default animate-slot swap cross-fades in place with opacity. Explicit vertical, scale, and rotate animation types remain available.
- Horizontal Card overlay/reveal text and actions retain their layout, material, and named preset while using opacity instead of lateral travel. The user explicitly approved this adjustment to their hover treatment.
- Layout outside-toggle arrows change color, Pagination quick-jump icons cross-fade at their centered coordinates, documentation home mock options change tint, and the documentation notification icon area keeps its width during hover.
- Preserve state-bearing travel such as Switch thumbs, Carousel navigation, Drawer opening, and selection indicators. Constant translate offsets used to center elements or space Splitter markers are not hover displacement.
- New fading/swapping effects honor reduced motion. Do not add outlines or ring shadows as feedback.

## Verification

- 162 relevant component tests, 21 documentation tests, Web type checking, and theme compilation passed.
- The shipped stylesheet scan no longer reports the removed hover translations; Splitter markers retain identical horizontal offsets in resting and hovered states.
- Browser checks confirmed stationary Select option content with the hover class active, stationary overlapping AvatarGroup roots, and stable Warn field/label geometry through focus, input, clear, and blur.
