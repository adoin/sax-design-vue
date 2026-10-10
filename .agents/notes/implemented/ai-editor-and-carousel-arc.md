---
status: implemented
recorded_at: 2026-10-10
scope:
  - packages/components/carousel
  - packages/components/ai-editor
  - docs/.vuepress/app/component-categories.ts
  - docs/components/ai-editor.md
  - docs/components/carousel.md
---

# Kobra-inspired Carousel and AI Editor

## User scope

Commit the existing code before new development; add a Kobra-style Carousel presentation, an “AI相关” component category, and the first AI Editor component inspired by https://kobra.systems/components/ai-editor.

The pre-development checkpoint was committed and pushed on main as `6aea5de`. Implementation uses the existing Vue component architecture and theme; no React, Motion, editor framework, or AI SDK dependency was introduced.

## Carousel

- `effect="arc"` adds portrait cards on a curved fan, progressively quieter tilted neighbors, and a separately rendered active `caption` slot.
- Shared controlled state, arrows, indicators, dragging, autoplay, disabled-item navigation, transition timing and reduced-motion behavior remain in Carousel.
- Looping sets of five or more items use seven keyed render positions with hidden edge buffers; render count is independent of total item count. Small and non-looping sets retain real items.
- Child text controls retain keyboard editing instead of triggering carousel navigation.
- Paired examples use publicly served Kobra preview photography and credit the source.

## AI Editor

- `SAiEditor` is globally installable and individually importable, with style entries, type exports, generated offline icon fallbacks and English/Chinese locale strings.
- Controlled plain text and `v-model:marks` persist independently. Formatting ranges use UTF-16 indices with inclusive starts and exclusive ends; overlapping bold, italic, underline, strike and code formatting is supported.
- Own document rendering creates only known tags and text nodes. Paste/drop transfers and answers stay plain text; no provider HTML is rendered. Composition, external updates, caret restoration and undo/redo are handled by the document module.
- Selection controls reuse SPopper positioning, clipping, teleport and outside-close behavior. Asking joins the shared focus layer so the prompt works in Dialog/Playground. The preserved selection survives toolbar focus, and explicit dismissal does not reopen on a repeated selection event.
- The assistant module accepts a provider callback returning text, a result with sources, or an async iterable of incremental text. Context includes prompt, selection, document, AbortSignal and a progress reporter. Cancellation resolves promptly and ignores stale results/progress, including uncooperative producers.
- Complete strings reveal in no more than 180 grapheme batches; externally streamed chunks keep producer timing. Chinese word segmentation and whole Unicode graphemes are preserved. Motion obeys the animation toggle and reduced-motion preference; shared loading exits finish before disposal of the status indicator.
- Finished answers may replace a selected range, insert after its paragraph or be copied. Readonly/disabled behavior, shared square/rounded shape resolution, accessible labels, keyboard shortcuts and scoped toolbar/answer/title slots are available.
- The shared category catalog exposes English “AI” and Chinese “AI相关” across navigation surfaces.

## Verification

- 45 Carousel/AI Editor component tests passed, including bounded arc looping, keyboard ownership, safe text transfers, partial formatting toggles, composition and controlled caret behavior, Unicode segmentation, bounded long-answer reveal, request replacement/cancellation/error handling, modal focus, explicit dismissal and readonly state.
- Web and test TypeScript checks and targeted ESLint passed.
- All 21 documentation checks passed; source normalization covered every new example.
- Theme build passed. The full documentation build rendered 203 pages successfully; existing plugin-time/chunk-size diagnostics were non-blocking.
- Six AI Editor examples plus Arc were checked in both rendered locales, their complete Code source blocks and the shared Playground. Real UI checks covered formatting, prompting, applying answers and carousel navigation. At an actual 375 CSS-pixel viewport, the prompt panel measured 351px with 12px gutters. Temporary viewport overrides and verification tabs were restored/closed.
