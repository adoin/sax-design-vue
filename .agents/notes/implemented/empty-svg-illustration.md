---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Empty animated SVG illustration

## User request

> Empty现在是用的图片，而且跟空内容没啥关系，重新设计一个复杂的svg，并且有动画，动画精细程度可以参考D:\workspace\day-or-night 里面的控制代码。同时保留现在的image 和image-size来供用户替换

## Contract

- The default illustration is a decorative inline SVG of an empty tray and magnifying glass: cavity, folded flaps, placeholder sheet, glass/rim/handle, reflected light, ground shadow, orbit marks and spark accents. Keep it related to missing content, with the description and optional action independently supplied by the consumer.
- `empty.vue` owns the public image/description/action composition. `empty-illustration.vue` owns vector artwork; `use-empty-motion.ts` owns visibility and lifecycle playback. Preserve image URLs, the image slot's precedence, numeric/CSS image-size, description overrides and the action slot.
- Default illustration box is 160 × 128px. Explicit image-size continues to set both box dimensions; SVG aspect ratio is preserved, and custom native images retain object-fit: contain.
- `animated` defaults to true and affects only built-in artwork. Its false state removes the animated timelines and shows the resting scene. CSS reduced-motion preference also suppresses animation.
- The local day-or-night reference uses layered artwork, independent rotation pivots, phase offsets and dwell periods. Empty applies those techniques to the tray scene: its five coordinated CSS tracks share an 8.4s cycle, while the main tray, text and action stay anchored. CSS animates transforms and opacity; there are no per-frame reactive updates, timers or animation dependencies.
- Viewport intersection, document visibility and KeepAlive activation govern pausing. Observer/listener teardown follows the illustration lifetime. Image/slot replacement bypasses the built-in illustration and its playback resources entirely.
- Gradients and clip paths use Vue app-scoped useId identifiers, unique within the Vue application and stable between SSR/client rendering. The artwork uses ordinary SVG paint resources and semantic color tokens, with no SVG filters. Respect app-level idPrefix when integrating independently mounted Vue applications.
- Five paired documentation examples cover default, playback, sizing, custom image and slots. Public API metadata, canonical English hashes, localized controls, complete Code sources and Playground previews remain synchronized. The custom image is a local static SVG asset, independent from the built-in scene.

## Verification

- Six Empty tests passed: decorative/status semantics, custom image sizing/replacement, slot precedence, paint ID uniqueness and SSR/client consistency, visibility/teardown, and KeepAlive playback.
- Final full documentation example/source/compiler/API audit: four files, 21 tests passed. Component and test typechecks, targeted ESLint, theme build and diff whitespace checks passed.
- VuePress built all 201 pages successfully, with the pre-existing chunk-size and plugin-timing warnings.
- Browser verified both locales' Code and Playground, actual playback/animation toggling, paused offscreen artwork, loaded custom image at 144 × 144px with no built-in scene, and reduced-motion emulation changing computed animation-name to none. Media emulation was reset and temporary tabs closed.
- Actual page screenshot saved as an ignored working artifact at `.codex/artifacts/empty-preview.png`.
