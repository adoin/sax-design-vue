---
status: implemented
kind: project-specification
updated_at: 2026-09-07
completed_at: 2026-09-07
modules:
  - packages/components/watermark
  - docs/components/watermark.md
  - docs/zh/components/watermark.md
supersedes: []
---

# Watermark blind mode

## Contract

`SWatermark` supports `mode="visible"`, `mode="blind"`, and `mode="both"`. Blind mode encodes a supplied identifier through small color-channel differences. `blind-content` accepts an application-provided user or session identifier and falls back to `content`; `blind-strength` controls the modulation tradeoff between reveal contrast and perceptibility.

`revealWatermark(file, options)` processes an image locally in the browser and returns a revealed PNG data URL. The component does not collect identity, upload screenshots, detect screenshot actions, prevent capture, or perform automatic identity verification. The application owns the identifier-to-user mapping.

The technique is a page color signal rather than encryption. Original PNG screenshots over flat opaque backgrounds provide the strongest recovery. Complex imagery, JPEG compression, resizing, filters, photographs, and page modification can weaken or destroy the signal; documentation must state these limits without overstating attribution certainty.

Visible watermark opacity remains independent from blind modulation. Blind regions use the theme background by default, and custom backgrounds must remain opaque for predictable recovery.

## Verification

- `packages/components/watermark/__tests__/watermark.test.ts` covers deterministic blind patterns, identifier distinction, strength, visible/blind/both rendering, fallback content, and reveal pixel processing.
- English and Chinese documentation provide localized visible and blind examples with complete Code and Playground sources.
