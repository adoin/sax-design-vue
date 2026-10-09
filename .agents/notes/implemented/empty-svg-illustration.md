---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Empty animated SVG illustration

## User request

> Empty现在是用的图片，而且跟空内容没啥关系，重新设计一个复杂的svg，并且有动画，动画精细程度可以参考D:\workspace\day-or-night 里面的控制代码。同时保留现在的image 和image-size来供用户替换

## Contract

- The default illustration is a decorative inline SVG of an open, entirely empty box: visible floor and inner walls, three open flaps, subtle interior lighting, ground shadow and sparse ambient marks. Documents, magnifiers and search indicators are excluded from the default scene. Keep it related to missing content, with the description and optional action independently supplied by the consumer.
- `empty.vue` owns the public image/description/action composition. `empty-illustration.vue` composes the scene and completion state; `empty-geometry.ts` owns the camera, rigid rectangles and cached projection samples; `empty-flap.vue` presents projected paper planes, and `empty-surprise.vue` presents transient star light. `use-empty-motion.ts` owns viewport/document/KeepAlive and reduced-motion state. Preserve image URLs, the image slot's precedence, numeric/CSS image-size, description overrides and the action slot.
- Default illustration box is 160 × 128px. Explicit image-size continues to set both box dimensions; SVG aspect ratio is preserved, and custom native images retain object-fit: contain.
- `animated` defaults to true and enables the built-in entry sequence once per instance. Its false state removes animation nodes and shows the fully open pose. The reduced-motion media query also selects the static fully open pose; a remount or false-to-true change can replay the sequence.
- Every box plane and flap detail uses one perspective camera. Each flap is a rigid 3D rectangle hinged along its two rim vertices. All three flaps share one monotone eased opening progress, from a 112-degree partly open pose to the fully open pose over 1.4 seconds. Browser-native SVG path interpolation presents 25 cached samples; there are no per-frame Vue updates or JS animation dependencies. The paper edge, crease shading and highlights follow the same projected plane. A few luminous four-point stars glow after opening and fade by 2.4 seconds. On native endEvent, animation nodes are removed and the SVG clock is paused, retaining the fully open base paths.
- Viewport intersection, document visibility and KeepAlive activation govern pausing. Observer/listener teardown follows the illustration lifetime. Image/slot replacement bypasses the built-in illustration and its playback resources entirely.
- Gradients use Vue app-scoped useId identifiers, unique within the Vue application and stable between SSR/client rendering. The artwork uses ordinary SVG paint resources and semantic color tokens, with no SVG filters. Respect app-level idPrefix when integrating independently mounted Vue applications.
- Five paired documentation examples cover default, playback, sizing, custom image and slots. Public API metadata, canonical English hashes, localized controls, complete Code sources and Playground previews remain synchronized. The custom image is a local static SVG asset, independent from the built-in scene.

## Verification

- Six Empty tests passed: decorative/status semantics, custom image sizing/replacement, slot precedence, paint ID uniqueness and SSR/client consistency, visibility/teardown, and KeepAlive playback.
- Final full documentation example/source/compiler/API audit: four files, 21 tests passed. Component and test typechecks, targeted ESLint, theme build and diff whitespace checks passed.
- VuePress built all 201 pages successfully, with the pre-existing chunk-size and plugin-timing warnings.
- Browser verified both locales' Code and Playground, actual playback/animation toggling, paused offscreen artwork, loaded custom image at 144 × 144px with no built-in scene, and reduced-motion emulation changing computed animation-name to none. Media emulation was reset and temporary tabs closed.
- Actual page screenshot saved as an ignored working artifact at `.codex/artifacts/empty-preview.png`.

## Empty-only scene correction (2026-10-09)

> empty的这个图案 你更像查找吧 里面没文件才对你看看怎么弄来表达空空如也

- Replaced the original search-oriented scene after this explicit correction. Remove the document sheet, magnifier, crosshair, scan ring, glass gradient and lens clip path rather than hiding them with CSS. Open flaps frame an unobstructed, visibly vacant interior.
- Updated both documentation locales to describe the open empty box and flap/lighting choreography. Image, image-size, slots, animation control and lifecycle playback are unchanged.
- Reverification: six Empty tests, 21 full documentation checks, component typecheck, targeted ESLint and theme build passed. Browser shows no file/search elements, three animated flaps, and working animation opt-out. New screenshot: `.codex/artifacts/empty-box-preview.png`.

## Perspective, material and synchronized entry (2026-10-09)

> 播放动画也没看出有什么动画啊，而且你这个盒子三个打开的面不像长方形在各自3D场景中的正确画面吧，再研究一下？
>
> 几何学对了 能否再想办法美化一下
>
> 你现在的盒子三个活动面试随风飘一样乱动，改成同时从半开状态打开，然后里面是空的，并且加一些惊讶的效果试试
>
> 惊讶不要感叹号 这太傻了，弄一点亮光那种星星 试试

- Replaced screen-space flap transforms with shared 3D projection. Fixed hinges, constant edge lengths, orthogonal edges and common vanishing points are verified. Independent phase loops were superseded by a single entry action; the partly open flaps now layer over the cavity to reveal it correctly as they open.
- Preserved the accepted geometry while adding soft cream paper gradients, neutral blue-gray outlines, thin paper edge thickness, crease bands, highlights, a small exterior label recess and diffuse/contact shadows. Theme materials consume complete semantic color tokens.
- Surprised emphasis uses only luminous star glints and radial glow, not exclamation marks or a speech bubble. No documents or search symbols are placed inside the box. Replay controls use SButton/SSwitch; paired complete example sources remain localized.
- SVG clocks pause for viewport/page/KeepAlive and reduced-motion changes; preference and completion listeners clean up with the scene. Animation completion removes all animation/glow nodes. No infinite flap timelines remain.
- Final verification: two Empty files, 14 tests passed; full documentation audit, four files/21 tests passed; component and test typechecks, targeted ESLint, theme build, normalization and diff whitespace checks passed. Final VuePress build rendered 201 pages successfully.
- Browser verified both localized Code/Playground sources, replay from a new instance, synchronized opening, star glow, and automatic final cleanup: all 25 animation nodes become zero while the open box remains. Actual star-phase screenshot: `.codex/artifacts/empty-opening-stars-preview.png`.
- Keep the prohibited approaches in `.agents/notes/prohibited/empty-illustration-motion.md` excluded.
