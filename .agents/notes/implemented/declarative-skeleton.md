---
status: implemented
kind: project-specification
completed_at: 2026-10-12
modules:
  - packages/components/skeleton
  - packages/theme-chalk/src/skeleton.scss
  - docs/components/skeleton.md
  - docs/zh/components/skeleton.md
---

# Declarative Skeleton component

## 用户原始要求

> 然后增加一下skeleton 组件，要求除了默认的以外能够简单配置不同的行和行内容的，比如圆，正方形，长方形和长条等元素简易声明能组成不同的骨架效果

## Contract

- SSkeleton is publicly exported, registered by full installation, and declared in GlobalComponents. Both source and compiled style entry points are available.
- Default layout contains a title placeholder and three text rows. `rows` accepts arrays as row shorthand, with shape strings or typed objects for circle, square, rectangle, and line.
- SkeletonElement provides width, height, size, and flex; numeric dimensions are pixels and strings are CSS lengths. Circles and squares preserve equal sides. SkeletonRowConfig adds row gap, alignment, and justification.
- SkeletonGroup nests rows to compose avatar-and-text or other mixed layouts. `repeat` repeats the entire layout and `gap` supplies inherited spacing.
- `loading` defaults true. Actual content is provided by the default slot; `placeholder` overrides the declared skeleton. The component performs no data fetching.
- Shimmer, pulse, and none are supported. Reduced-motion preferences disable animation and reveal transitions. Theme tokens supply fill and highlight colors; no outlines or boundary rings are introduced.
- Loading exposes a localized status and aria-busy. Decorative geometry is hidden from assistive technology. Leaving layers become inert and aria-hidden, while entering layers restore interaction to support interrupted transitions.
- Text strips use the pill radius token, while circles use the circle radius token; percentage circle radii must not make wide strips elliptical.
- SkeletonLayout is an internal renderer; normalization and dimension resolution are pure helpers. Example-only presets stay in the documentation.

## Verification

- Four Skeleton tests cover default accessibility, reactive nested rows and repetition, custom placeholders and content gating, and SSR.
- 21 documentation tests pass. Web, Playground, and Vitest type checks pass; theme and complete documentation builds pass (231 pages).
- All eight bilingual examples verified through Code and Playground. Recursive SkeletonRow → SkeletonItem type details verified.
- 280px preview container: shapes and nested profile remain within the container, scrollWidth equals width.
- Reduced-motion browser emulation reports animation-name none and was reset after verification.
- Loading example skeleton and revealed profile both measure 76px in the browser. Shimmer, pulse, static, four shapes, and three-row list verified.
