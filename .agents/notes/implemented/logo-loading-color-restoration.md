---
status: implemented
kind: project-specification
updated_at: 2026-10-09
---

# Brand loading color restoration

## User request

> brand loading的收尾有点问题那一小段偏绿的颜色会在最后几帧先小再大，且不自然，按我们之前颜色流动的设定颜色不太会缺损才对，你看看怎么个事好不好弄

## Diagnosis

- The restore path previously used a fixed half-circumference-sized sampling window and the maximum return-route travel for both strands. Once samples reached the shorter source logo path, its lookup clamped excess points to the endpoint.
- Both colored tips could consequently collapse to zero geometric length late in stopping, then jump to the idle logo's 11-unit accent. Dense sampling at multiple stop angles reproduced the defect; at stop time 3000–3399ms the green tip was zero, followed by 11 at idle.

## Contract

- Restore each strand's sampling window along its own return-route length. Interpolate its span from the running half-circumference to its original source-path length using the same smooth restore progress.
- Keep the colored tail's normalized position within that window. Samples remain inside the continuous circle/return/source route and reach the complete source logo together; do not let endpoint clamping erase the tail before idle.
- Preserve the brand paths, palette, speed, start/stop durations, shared scheduler and rendered-restored signal. Compact corner-clearing keeps its existing intentional disappearance behavior.

## Verification

- Four targeted files/64 tests passed: logo motion/rendering, control exit handoff, Button and Dialog. New regression cases sweep five stop angles on rounded and square paths, require intact color lengths throughout stopping, identical running/stopping accents at entry, and less than 0.03 SVG units of point movement into the idle frame.
- Web/test typechecks, targeted ESLint and diff whitespace checks passed.
- Actual browser sampling at default speed showed green lengths 17.23 → 16.66 → 16 → 15.21 → 14.37 → 13.65 → 12.85 → 12.23 → 11.62 → 11.25 → 11.02 → 11 at idle. No collapsing tip or final growth remained; the console had no errors.
- Ignored verification artifacts: `.codex/artifacts/brand-loading-tail-samples.json` and `.codex/artifacts/brand-loading-tail-preview.png`.
