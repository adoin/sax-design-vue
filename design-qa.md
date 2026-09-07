# Table parent indicator design QA

## Reference

- Source visual: `D:\codex_home\generated_images\01a06660-cacc-7d40-adf1-9439dacb2017\exec-46191f81-4a45-4af2-a5b1-8b60ca40c5ac.png`
- Source dimensions: 1767 × 889
- Target pattern: a temporary full-width strip below the table header, with a bent return arrow, the nearest parent label, and a compact “return to parent row” action.

## Implementation evidence

- Route: `http://localhost:8081/zh/components/table.html#远程分组与虚拟行`
- Browser viewport: 1706 × 960
- State: virtual table scrolled inside child rows; indicator visible 250 ms after scroll input.
- Capture: CUA/CDP inline browser capture from in-app browser tab 7. The browser integration did not expose a local filesystem path for the final capture.
- Earlier iteration screenshot: `C:\Users\ADMINI~1\AppData\Local\Temp\codex-clipboard-c95667d7-fddc-47b7-bd8a-e9ef490a5e63.png`

## Comparison and iteration history

### Iteration 1

- P2: the leading chevron inside the circular mark looked like a generic collapse control and did not communicate “return to parent”.
- P2: the trailing chevron pointed upward, while the reference uses a rightward continuation cue.

### Fix

- Replaced the leading asset with the project icon `cb:arrow-up-left`.
- Replaced the trailing asset with `cb:chevron-right`.
- Preserved the reference composition: 24 px pale primary mark, parent context in the center, compact action on the right, and a 36 px full-width strip.

### Final review

- Typography: parent label, context label, and action have distinct hierarchy without introducing a new font treatment.
- Spacing: the icon, label, and action align vertically and remain compact below the sticky header.
- Color: surfaces derive from the project primary HSL color through `color-mix`; the strip remains distinct from the header and zebra rows.
- Shape and shadow: the icon uses the project pill radius; the strip uses a contained weak shadow and no border.
- Motion: the strip enters and leaves in 150 ms, honors reduced motion, appears only during vertical scrolling, and stays visible for the configured delay after scrolling ends.
- Interaction: hover and focus pause dismissal; activation returns to the nearest group or tree parent row.
- Content: the implementation uses live parent values (for example “批次 1”), while the reference uses illustrative numeric data. This expected data difference does not change the layout or behavior.
- No remaining P0, P1, or P2 visual mismatches were found in the final state.

### Configurable content follow-up

- Added `parentIndicator.enabled` without changing the default enabled state.
- Kept the return icon under component control so custom content cannot break its alignment or visual meaning.
- Moved custom content into the remaining grid area and exposed `parentKey`, `label`, and `jump()` to the slot.
- Browser verification at 1706 × 960 confirmed the custom Chinese example renders as a `DIV` container with the fixed icon, replaces the default action content, and returns scroll position from 1960 to the parent at 0 when its action calls `jump()`.
- Unit coverage confirms `{ enabled: false }` suppresses the indicator.

## Result

passed
